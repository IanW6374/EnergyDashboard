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
  "energy-carbon-consumed-gauge": {
    label: "Carbon consumed gauge",
    size: 2,
  },
  "energy-grid-balance": {
    label: "Grid balance",
    size: 2,
  },
  "energy-compare": {
    label: "Energy compare",
    size: 3,
  },
  "energy-sources-table": {
    label: "Energy sources table",
    size: 4,
  },
  "energy-devices-detail-graph": {
    label: "Energy devices detail graph",
    size: 4,
  },
  "energy-devices-graph": {
    label: "Energy devices graph",
    size: 4,
  },
  "energy-gas-graph": {
    label: "Gas graph",
    size: 4,
  },
  "energy-water-graph": {
    label: "Water graph",
    size: 4,
  },
  "water-sankey": {
    label: "Water Sankey",
    size: 5,
  },
  "water-flow-sankey": {
    label: "Water flow Sankey",
    size: 5,
  },
  "power-sources-graph": {
    label: "Power sources graph",
    size: 4,
  },
  "energy-date-selection": {
    label: "Energy date selection",
    size: 1,
  },
};

const DASHBOARD_VIEWS = {
  overview: {
    label: "Overview",
    cards: [
      { key: "distribution", type: "energy-distribution", title: "Energy distribution" },
      {
        key: "sources",
        type: "energy-sources-table",
        title: "Energy sources",
        show_only_totals: true,
      },
      {
        key: "power_sources",
        type: "power-sources-graph",
        title: "Power sources",
        show_legend: false,
      },
      { key: "usage", type: "energy-usage-graph", title: "Energy usage" },
      { key: "gas", type: "energy-gas-graph", title: "Gas usage" },
      { key: "water", type: "energy-water-graph", title: "Water usage" },
      { key: "water_sankey", type: "water-sankey", title: "Water distribution" },
    ],
  },
  electricity: {
    label: "Electricity",
    cards: [
      { key: "date", type: "energy-date-selection" },
      { key: "distribution", type: "energy-distribution", title: "Energy distribution" },
      { key: "grid_balance", type: "energy-grid-balance" },
      { key: "grid_neutrality", type: "energy-grid-neutrality-gauge" },
      { key: "solar_consumed", type: "energy-solar-consumed-gauge" },
      { key: "self_sufficiency", type: "energy-self-sufficiency-gauge" },
      { key: "carbon", type: "energy-carbon-consumed-gauge" },
      { key: "compare", type: "energy-compare" },
      { key: "usage", type: "energy-usage-graph", title: "Energy usage" },
      { key: "solar", type: "energy-solar-graph", title: "Solar production" },
      {
        key: "sources",
        type: "energy-sources-table",
        title: "Energy sources",
        types: ["grid", "solar", "battery"],
      },
      {
        key: "device_detail",
        type: "energy-devices-detail-graph",
        title: "Monitor individual devices",
      },
      { key: "devices", type: "energy-devices-graph", title: "Devices" },
      { key: "sankey", type: "energy-sankey", title: "Energy Sankey" },
    ],
  },
  gas: {
    label: "Gas",
    cards: [
      { key: "date", type: "energy-date-selection" },
      { key: "gas", type: "energy-gas-graph", title: "Gas usage" },
      {
        key: "sources",
        type: "energy-sources-table",
        title: "Gas sources",
        types: ["gas"],
      },
    ],
  },
  water: {
    label: "Water",
    cards: [
      { key: "date", type: "energy-date-selection" },
      { key: "water", type: "energy-water-graph", title: "Water usage" },
      { key: "water_sankey", type: "water-sankey", title: "Water distribution" },
    ],
  },
  now: {
    label: "Now",
    cards: [
      { key: "power_sources", type: "power-sources-graph", title: "Power sources" },
      { key: "power_sankey", type: "power-sankey", title: "Power Sankey" },
      { key: "water_flow", type: "water-flow-sankey", title: "Water flow" },
    ],
  },
};

const DEFAULT_CONFIG = {
  view: "electricity",
  show_view_tabs: true,
  show_date_selection: true,
  link_dashboard: true,
  group_by_floor: true,
  group_by_area: true,
  layout: "auto",
  card_options: {},
  hidden_cards: [],
};

const clone = (value) => JSON.parse(JSON.stringify(value || {}));

const unique = (values) => [...new Set(values.filter(Boolean))];

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeAttr = (value) =>
  escapeHtml(value)
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const dispatchConfig = (element, config) => {
  const event = new Event("config-changed", {
    bubbles: true,
    composed: true,
  });
  event.detail = { config };
  element.dispatchEvent(event);
};

const normalizeConfig = (config, defaults = DEFAULT_CONFIG) => ({
  ...defaults,
  ...clone(config),
});

const extraConfigForCard = (config, key, type) => ({
  ...clone(config.card_options?.[type]),
  ...clone(config.card_options?.[key]),
});

const dashboardCardConfig = (card, config) => {
  const result = {
    ...clone(card),
    ...extraConfigForCard(config, card.key, card.type),
  };

  applyCommonCardOptions(result, config);
  applyTypeOptions(result, config, result.type);
  delete result.key;

  return result;
};

const applyCommonCardOptions = (result, config) => {
  if (config.collection_key) {
    result.collection_key = config.collection_key;
  }
};

const applyTypeOptions = (result, config, cardType) => {
  if (cardType === "energy-distribution") {
    result.link_dashboard = config.link_dashboard !== false;
  }

  if (["energy-sankey", "power-sankey", "water-sankey", "water-flow-sankey"].includes(cardType)) {
    result.layout = config.layout || "auto";
    result.group_by_floor = config.group_by_floor !== false;
    result.group_by_area = config.group_by_area !== false;
  }
};

const viewCards = (config) => {
  const view = DASHBOARD_VIEWS[config.view] || DASHBOARD_VIEWS.electricity;
  const hidden = new Set(config.hidden_cards || []);
  const enabled = config.enabled_cards?.length ? new Set(config.enabled_cards) : undefined;

  return view.cards.filter((card) => {
    if (!config.show_date_selection && card.type === "energy-date-selection") {
      return false;
    }
    return enabled ? enabled.has(card.key) || enabled.has(card.type) : !hidden.has(card.key) && !hidden.has(card.type);
  });
};

const renderError = (mount, message) => {
  mount.innerHTML = `
    <ha-card>
      <div class="error">${message}</div>
    </ha-card>
  `;
};

const createErrorCard = (message) => {
  const card = document.createElement("ha-card");
  card.innerHTML = `<div class="error">${escapeHtml(message)}</div>`;
  return card;
};

class EditableEnergyDashboard extends HTMLElement {
  static async getConfigElement() {
    return document.createElement("editable-energy-dashboard-editor");
  }

  static getStubConfig() {
    return {
      type: "custom:editable-energy-dashboard",
      view: "electricity",
      show_view_tabs: true,
      show_date_selection: true,
    };
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = normalizeConfig({});
    this._helpers = undefined;
    this._cards = [];
    this._renderKey = "";
  }

  setConfig(config) {
    this._config = normalizeConfig(config);
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._cards.forEach((card) => {
      card.hass = hass;
    });
  }

  getCardSize() {
    return Math.max(6, viewCards(this._config).length * 2);
  }

  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: this.getCardSize(),
    };
  }

  async _render() {
    const cards = viewCards(this._config);
    const renderKey = JSON.stringify({
      config: this._config,
      cards,
    });

    if (renderKey === this._renderKey && this._cards.length) {
      return;
    }

    this._renderKey = renderKey;
    this._cards = [];
    this.shadowRoot.innerHTML = `
      ${baseStyles()}
      <ha-card>
        <div class="dashboard">
          ${this._config.show_view_tabs !== false ? this._viewTabs() : ""}
          <div id="grid" class="grid"></div>
        </div>
      </ha-card>
    `;

    const grid = this.shadowRoot.getElementById("grid");

    try {
      this._helpers = this._helpers || (await window.loadCardHelpers());
      const elements = await Promise.all(
        cards.map(async (card) => {
          const cardConfig = dashboardCardConfig(card, this._config);
          try {
            const element = await this._helpers.createCardElement(cardConfig);
            if (this._hass) {
              element.hass = this._hass;
            }
            return element;
          } catch (error) {
            return createErrorCard(`Unable to load ${cardConfig.type}: ${error.message}`);
          }
        })
      );
      this._cards = elements;
      grid.replaceChildren(...elements);
    } catch (error) {
      this._cards = [];
      renderError(grid, `Unable to load energy dashboard: ${error.message}`);
    }
  }

  _viewTabs() {
    return `
      <div class="tabs">
        ${Object.entries(DASHBOARD_VIEWS)
          .map(
            ([view, definition]) => `
              <button
                class="${this._config.view === view ? "active" : ""}"
                data-view="${view}"
                type="button"
              >${definition.label}</button>
            `
          )
          .join("")}
      </div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.addEventListener("click", (event) => {
      const button = event.target.closest("[data-view]");
      if (!button) {
        return;
      }
      this._config = {
        ...this._config,
        view: button.dataset.view,
      };
      this._render();
    });
  }
}

class EditableEnergyDashboardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = normalizeConfig({});
    this._rawDashboardConfig = "{}";
    this._rawError = "";
  }

  setConfig(config) {
    this._config = normalizeConfig(config);
    this._rawDashboardConfig = JSON.stringify(this._config.card_options || {}, null, 2);
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

  _setHiddenCard(key, hidden) {
    const hiddenCards = new Set(this._config.hidden_cards || []);
    if (hidden) {
      hiddenCards.add(key);
    } else {
      hiddenCards.delete(key);
    }
    this._config = {
      ...this._config,
      hidden_cards: [...hiddenCards],
    };
    this._emit();
  }

  _emit() {
    const config = clone(this._config);
    config.type = "custom:editable-energy-dashboard";
    Object.keys(config).forEach((key) => {
      if (
        config[key] === "" ||
        config[key] === undefined ||
        config[key] === null ||
        (Array.isArray(config[key]) && config[key].length === 0)
      ) {
        delete config[key];
      }
    });
    dispatchConfig(this, config);
    this._render();
  }

  _parseRaw(value) {
    this._rawDashboardConfig = value;

    try {
      const parsed = value.trim() ? JSON.parse(value) : {};
      this._rawError = "";
      this._config = {
        ...this._config,
        card_options: parsed,
      };
      this._emit();
    } catch (error) {
      this._rawError = error.message;
      this._render();
    }
  }

  _render() {
    const viewOptions = Object.entries(DASHBOARD_VIEWS)
      .map(
        ([view, definition]) =>
          `<option value="${view}" ${
            this._config.view === view ? "selected" : ""
          }>${definition.label}</option>`
      )
      .join("");

    const dashboardControls = this._dashboardControls(viewOptions);

    this.shadowRoot.innerHTML = `
      ${editorStyles()}
      <label>
        Energy collection key
        <input data-key="collection_key" type="text" value="${
          escapeAttr(this._config.collection_key || "")
        }" placeholder="Default collection">
      </label>
      <label class="check">
        <input type="checkbox" data-key="link_dashboard" ${
          this._config.link_dashboard !== false ? "checked" : ""
        }>
        Show link to Energy dashboard
      </label>
      ${dashboardControls}
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
      ${this._rawError ? `<div class="error">${escapeHtml(this._rawError)}</div>` : ""}
    `;

    this.shadowRoot.querySelectorAll("select, input[type='text']").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setValue(event.target.dataset.key, event.target.value);
      });
    });

    this.shadowRoot.querySelectorAll("input[type='checkbox'][data-key]").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setValue(event.target.dataset.key, event.target.checked);
      });
    });

    this.shadowRoot.querySelectorAll("input[type='checkbox'][data-card-key]").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setHiddenCard(event.target.dataset.cardKey, !event.target.checked);
      });
    });

    this.shadowRoot.querySelectorAll("textarea").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._parseRaw(event.target.value);
      });
    });
  }

  _dashboardControls(viewOptions) {
    const cards = DASHBOARD_VIEWS[this._config.view]?.cards || DASHBOARD_VIEWS.electricity.cards;
    const hiddenCards = new Set(this._config.hidden_cards || []);
    const allCards = unique(cards.map((card) => card.key));

    return `
      <label>
        Dashboard view
        <select data-key="view">${viewOptions}</select>
      </label>
      <label class="check">
        <input type="checkbox" data-key="show_view_tabs" ${
          this._config.show_view_tabs !== false ? "checked" : ""
        }>
        Show view tabs
      </label>
      <label class="check">
        <input type="checkbox" data-key="show_date_selection" ${
          this._config.show_date_selection !== false ? "checked" : ""
        }>
        Show date selection card
      </label>
      <fieldset>
        <legend>Cards in this view</legend>
        ${allCards
          .map((key) => {
            const card = cards.find((candidate) => candidate.key === key);
            const label = card.title || CARD_TYPES[card.type]?.label || card.type;
            return `
              <label class="check">
                <input type="checkbox" data-card-key="${key}" ${
                  hiddenCards.has(key) || hiddenCards.has(card.type) ? "" : "checked"
                }>
                ${escapeHtml(label)}
              </label>
            `;
          })
          .join("")}
      </fieldset>
      <label>
        Per-card override JSON
        <textarea data-key="card_options">${escapeHtml(this._rawDashboardConfig)}</textarea>
      </label>
    `;
  }
}

const baseStyles = () => `
  <style>
    :host {
      display: block;
    }
    ha-card {
      overflow: hidden;
    }
    .dashboard {
      padding: 12px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
      align-items: start;
    }
    .tabs {
      display: flex;
      gap: 4px;
      margin: 0 0 12px;
      overflow-x: auto;
      scrollbar-width: thin;
    }
    .tabs button {
      flex: 0 0 auto;
      border: 0;
      border-radius: 4px;
      padding: 8px 12px;
      background: transparent;
      color: var(--secondary-text-color);
      font: inherit;
      cursor: pointer;
    }
    .tabs button.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }
    .error {
      color: var(--error-color);
      padding: 16px;
    }
  </style>
`;

const editorStyles = () => `
  <style>
    :host {
      display: block;
      padding: 12px 0;
    }
    label,
    legend {
      display: block;
      color: var(--primary-text-color);
      font-size: 14px;
      margin: 0 0 12px;
    }
    fieldset {
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      margin: 0 0 12px;
      padding: 12px 12px 0;
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
      margin: 0;
    }
    .error {
      color: var(--error-color);
      font-size: 12px;
      margin-top: -8px;
      margin-bottom: 12px;
    }
  </style>
`;

customElements.define("editable-energy-dashboard", EditableEnergyDashboard);
customElements.define("editable-energy-dashboard-editor", EditableEnergyDashboardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "editable-energy-dashboard",
  name: "Editable Energy Dashboard",
  preview: true,
  description: "Customisable wrapper for Home Assistant's built-in Energy dashboard cards.",
  documentationURL: "https://github.com/home-assistant/frontend/tree/dev/src/panels/energy",
});
