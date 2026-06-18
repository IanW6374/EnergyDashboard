const CARD_TYPES = {
  "energy-distribution": {
    label: "Energy distribution",
    size: 3,
  },
  "energy-sankey": {
    label: "Energy Sankey",
    size: 5,
  },
  "power-sankey": {
    label: "Power Sankey",
    size: 5,
  },
  "energy-usage-graph": {
    label: "Energy usage graph",
    size: 4,
  },
  "energy-solar-graph": {
    label: "Solar graph",
    size: 4,
  },
  "energy-grid-neutrality-gauge": {
    label: "Grid neutrality gauge",
    size: 2,
  },
  "energy-self-sufficiency-gauge": {
    label: "Self-sufficiency gauge",
    size: 2,
  },
  "energy-solar-consumed-gauge": {
    label: "Solar consumed gauge",
    size: 2,
  },
};

const DEFAULT_CONFIG = {
  card_type: "energy-distribution",
  link_dashboard: true,
  group_by_floor: true,
  group_by_area: true,
  layout: "auto",
  inner_config: {},
};

const clone = (value) => JSON.parse(JSON.stringify(value || {}));

const dispatchConfig = (element, config) => {
  const event = new Event("config-changed", {
    bubbles: true,
    composed: true,
  });
  event.detail = { config };
  element.dispatchEvent(event);
};

const normalizeConfig = (config) => ({
  ...DEFAULT_CONFIG,
  ...clone(config),
  type: "custom:editable-energy-card",
});

const builtInConfig = (config) => {
  const normalized = normalizeConfig(config);
  const cardType = normalized.card_type || DEFAULT_CONFIG.card_type;
  const result = {
    ...clone(normalized.inner_config),
    type: cardType,
  };

  if (normalized.collection_key) {
    result.collection_key = normalized.collection_key;
  }

  if (cardType === "energy-distribution") {
    result.link_dashboard = normalized.link_dashboard !== false;
  }

  if (cardType === "energy-sankey") {
    result.layout = normalized.layout || "auto";
    result.group_by_floor = normalized.group_by_floor !== false;
    result.group_by_area = normalized.group_by_area !== false;
  }

  return result;
};

class EditableEnergyCard extends HTMLElement {
  static async getConfigElement() {
    return document.createElement("editable-energy-card-editor");
  }

  static getStubConfig() {
    return {
      card_type: "energy-distribution",
      link_dashboard: true,
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = normalizeConfig({});
    this._builtInKey = "";
    this._helpers = undefined;
    this._card = undefined;
  }

  setConfig(config) {
    this._config = normalizeConfig(config);
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._card) {
      this._card.hass = hass;
    }
  }

  getCardSize() {
    if (this._card && this._card.getCardSize) {
      return this._card.getCardSize();
    }
    return CARD_TYPES[this._config.card_type]?.size || 3;
  }

  getGridOptions() {
    if (this._card && this._card.getGridOptions) {
      return this._card.getGridOptions();
    }
    return {
      columns: 12,
      min_columns: 6,
      rows: this.getCardSize(),
    };
  }

  async _render() {
    const innerConfig = builtInConfig(this._config);
    const nextKey = JSON.stringify(innerConfig);

    if (nextKey === this._builtInKey && this._card) {
      return;
    }

    this._builtInKey = nextKey;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .error {
          color: var(--error-color);
          padding: 16px;
        }
      </style>
      <div id="mount"></div>
    `;

    try {
      this._helpers = this._helpers || (await window.loadCardHelpers());
      this._card = await this._helpers.createCardElement(innerConfig);
      if (this._hass) {
        this._card.hass = this._hass;
      }
      this.shadowRoot.getElementById("mount").replaceChildren(this._card);
    } catch (error) {
      this._card = undefined;
      this.shadowRoot.getElementById("mount").innerHTML = `
        <ha-card>
          <div class="error">Unable to load ${innerConfig.type}: ${error.message}</div>
        </ha-card>
      `;
    }
  }
}

class EditableEnergyCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = normalizeConfig({});
    this._rawConfig = "{}";
    this._rawError = "";
  }

  setConfig(config) {
    this._config = normalizeConfig(config);
    this._rawConfig = JSON.stringify(this._config.inner_config || {}, null, 2);
    this._rawError = "";
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  _setValue(key, value) {
    this._config = {
      ...this._config,
      [key]: value,
    };
    this._emit();
  }

  _emit() {
    const config = clone(this._config);
    Object.keys(config).forEach((key) => {
      if (config[key] === "" || config[key] === undefined || config[key] === null) {
        delete config[key];
      }
    });
    dispatchConfig(this, config);
    this._render();
  }

  _parseRaw(value) {
    this._rawConfig = value;
    try {
      const parsed = value.trim() ? JSON.parse(value) : {};
      this._rawError = "";
      this._config = {
        ...this._config,
        inner_config: parsed,
      };
      this._emit();
    } catch (error) {
      this._rawError = error.message;
      this._render();
    }
  }

  _render() {
    const cardOptions = Object.keys(CARD_TYPES)
      .map(
        (type) =>
          `<option value="${type}" ${
            this._config.card_type === type ? "selected" : ""
          }>${CARD_TYPES[type].label}</option>`
      )
      .join("");

    const sankeyControls =
      this._config.card_type === "energy-sankey"
        ? `
          <label>
            Layout
            <select data-key="layout">
              <option value="auto" ${this._config.layout === "auto" ? "selected" : ""}>Auto</option>
              <option value="horizontal" ${this._config.layout === "horizontal" ? "selected" : ""}>Horizontal</option>
              <option value="vertical" ${this._config.layout === "vertical" ? "selected" : ""}>Vertical</option>
            </select>
          </label>
          <label class="check">
            <input type="checkbox" data-key="group_by_floor" ${
              this._config.group_by_floor !== false ? "checked" : ""
            }>
            Group by floor
          </label>
          <label class="check">
            <input type="checkbox" data-key="group_by_area" ${
              this._config.group_by_area !== false ? "checked" : ""
            }>
            Group by area
          </label>
        `
        : "";

    const distributionControls =
      this._config.card_type === "energy-distribution"
        ? `
          <label class="check">
            <input type="checkbox" data-key="link_dashboard" ${
              this._config.link_dashboard !== false ? "checked" : ""
            }>
            Show link to Energy dashboard
          </label>
        `
        : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 12px 0;
        }
        label {
          display: block;
          color: var(--primary-text-color);
          font-size: 14px;
          margin: 0 0 12px;
        }
        select,
        input[type="text"],
        textarea {
          box-sizing: border-box;
          width: 100%;
          margin-top: 4px;
          padding: 8px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--card-background-color);
          color: var(--primary-text-color);
          font: inherit;
        }
        textarea {
          min-height: 132px;
          font-family: var(--code-font-family, monospace);
        }
        .check {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .check input {
          width: auto;
        }
        .error {
          color: var(--error-color);
          font-size: 12px;
          margin-top: -8px;
          margin-bottom: 12px;
        }
      </style>
      <label>
        Built-in energy card
        <select data-key="card_type">${cardOptions}</select>
      </label>
      <label>
        Energy collection key
        <input data-key="collection_key" type="text" value="${
          this._config.collection_key || ""
        }" placeholder="Default collection">
      </label>
      ${distributionControls}
      ${sankeyControls}
      <label>
        Extra built-in card config JSON
        <textarea data-key="inner_config">${this._rawConfig}</textarea>
      </label>
      ${this._rawError ? `<div class="error">${this._rawError}</div>` : ""}
    `;

    this.shadowRoot.querySelectorAll("select, input[type='text']").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setValue(event.target.dataset.key, event.target.value);
      });
    });

    this.shadowRoot.querySelectorAll("input[type='checkbox']").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setValue(event.target.dataset.key, event.target.checked);
      });
    });

    this.shadowRoot.querySelector("textarea").addEventListener("change", (event) => {
      this._parseRaw(event.target.value);
    });
  }
}

customElements.define("editable-energy-card", EditableEnergyCard);
customElements.define("editable-energy-card-editor", EditableEnergyCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "editable-energy-card",
  name: "Editable Energy Card",
  preview: true,
  description: "Editable wrapper for Home Assistant's built-in energy cards.",
  documentationURL: "https://github.com/home-assistant/frontend/tree/dev/src/panels/lovelace/cards/energy",
});
