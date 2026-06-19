const CARD_TYPES = {
  "history-graph": {
    label: "History graph",
    size: 4,
  },
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
    label: "Summary",
    cards: [
      { key: "date", type: "energy-date-selection" },
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
        key: "battery_soc",
        type: "history-graph",
        title: "Battery SoC",
        hours_to_show: 24,
      },
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

const DEFAULT_VIEW_KEYS = Object.keys(DASHBOARD_VIEWS);

const DEFAULT_CONFIG = {
  view: "electricity",
  show_view_tabs: true,
  show_date_selection: true,
  link_dashboard: true,
  group_by_floor: true,
  group_by_area: true,
  layout: "auto",
  tabs_position: "top",
  visible_tabs: DEFAULT_VIEW_KEYS,
  hidden_tabs: [],
  tab_options: {},
  card_options: {},
  hidden_cards: [],
  badges: {},
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

const displayedViews = (config) => {
  const hidden = new Set(config.hidden_tabs || []);
  const visible = config.visible_tabs?.length ? new Set(config.visible_tabs) : undefined;
  const views = DEFAULT_VIEW_KEYS.filter(
    (view) => (visible ? visible.has(view) : !hidden.has(view)) && !hidden.has(view)
  );
  return views.length ? views : [config.view || DEFAULT_CONFIG.view];
};

const currentViewKey = (config) => {
  const views = displayedViews(config);
  return views.includes(config.view) ? config.view : views[0];
};

const tabConfig = (config, viewKey = currentViewKey(config)) => ({
  ...config,
  ...clone(config.tab_options?.[viewKey]),
});

const tabCardOptions = (config, viewKey) => ({
  ...clone(config.card_options),
  ...clone(config.tab_options?.[viewKey]?.card_options),
});

const extraConfigForTabCard = (config, viewKey, key, type) => {
  const options = tabCardOptions(config, viewKey);
  return {
    ...clone(options[type]),
    ...clone(options[key]),
  };
};

const dashboardCardConfig = (card, config, viewKey) => {
  const options = tabConfig(config, viewKey);
  const result = {
    ...clone(card),
    ...extraConfigForTabCard(config, viewKey, card.key, card.type),
  };

  applyCommonCardOptions(result, options);
  applyTypeOptions(result, options, result.type);
  applySpecialCardOptions(result, options, card);
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

const applySpecialCardOptions = (result, config, card) => {
  if (card.key !== "battery_soc") {
    return;
  }

  const entity = config.battery_soc_entity || config.battery_soc_sensor;
  const entities = config.battery_soc_entities || (entity ? [entity] : undefined);
  if (entities?.length && !result.entities) {
    result.entities = entities;
  }
  result.title = result.title || "Battery SoC";
  result.hours_to_show = result.hours_to_show || config.battery_soc_hours_to_show || 24;
};

const viewCards = (config, viewKey = currentViewKey(config)) => {
  const view = DASHBOARD_VIEWS[viewKey] || DASHBOARD_VIEWS.electricity;
  const options = tabConfig(config, viewKey);
  const hidden = new Set([
    ...hiddenCardsFor(config.hidden_cards, viewKey),
    ...hiddenCardsFor(config.tab_options?.[viewKey]?.hidden_cards, viewKey),
  ]);
  const enabledCards = options.enabled_cards || config.enabled_cards;
  const enabled = enabledCards?.length ? new Set(enabledCards) : undefined;
  const cardOrder = options.card_order || config.card_order;
  const cards = orderedCards(view.cards, cardOrder);

  return cards.filter((card) => {
    if (!options.show_date_selection && card.type === "energy-date-selection") {
      return false;
    }
    if (card.key === "battery_soc" && !hasBatterySocConfig(config, viewKey)) {
      return false;
    }
    return enabled ? enabled.has(card.key) || enabled.has(card.type) : !hidden.has(card.key) && !hidden.has(card.type);
  });
};

const hasBatterySocConfig = (config, viewKey) => {
  const options = tabConfig(config, viewKey);
  const cardOptions = tabCardOptions(config, viewKey);
  return Boolean(
    options.battery_soc_entity ||
      options.battery_soc_sensor ||
      options.battery_soc_entities?.length ||
      cardOptions.battery_soc?.entities?.length ||
      cardOptions["history-graph"]?.entities?.length
  );
};

const badgeConfigs = (config, viewKey) => {
  const options = tabConfig(config, viewKey);
  const badges = options.badges ?? config.badges?.[viewKey] ?? config.badges;
  return Array.isArray(badges) ? badges : [];
};

const badgeName = (badge, state) =>
  badge.name || badge.label || state?.attributes?.friendly_name || badge.entity || "";

const badgeValue = (badge, state) => {
  if (!badge.entity) {
    return badge.value ?? "";
  }
  if (!state) {
    return "Unavailable";
  }
  const unit = badge.unit ?? state.attributes?.unit_of_measurement ?? "";
  return `${state.state}${unit ? ` ${unit}` : ""}`;
};

const renderBadges = (hass, badges) =>
  badges
    .map((badge) => {
      const state = badge.entity ? hass?.states?.[badge.entity] : undefined;
      return `
        <div class="badge">
          ${badge.icon ? `<ha-icon icon="${escapeAttr(badge.icon)}"></ha-icon>` : ""}
          <div>
            <div class="badge-name">${escapeHtml(badgeName(badge, state))}</div>
            <div class="badge-value">${escapeHtml(badgeValue(badge, state))}</div>
          </div>
        </div>
      `;
    })
    .join("");

const orderedCards = (cards, cardOrder) => {
  if (!cardOrder?.length) {
    return [...cards];
  }

  const used = new Set();
  const byKey = new Map(cards.flatMap((card) => [[card.key, card], [card.type, card]]));
  const ordered = cardOrder
    .map((key) => byKey.get(key))
    .filter((card) => {
      if (!card || used.has(card.key)) {
        return false;
      }
      used.add(card.key);
      return true;
    });

  return [...ordered, ...cards.filter((card) => !used.has(card.key))];
};

const hiddenCardsFor = (hiddenCards, viewKey) => {
  if (!hiddenCards) {
    return [];
  }
  if (Array.isArray(hiddenCards)) {
    return hiddenCards;
  }
  return hiddenCards[viewKey] || [];
};

const cardLayoutFor = (config, viewKey, card) => {
  const layout = {
    ...clone(config.card_layout),
    ...clone(config.tab_options?.[viewKey]?.card_layout),
  };
  return layout[card.key] || layout[card.type];
};

const cardPositionFor = (config, viewKey, card) => {
  const position = {
    ...clone(config.card_position),
    ...clone(config.tab_options?.[viewKey]?.card_position),
  };
  return position[card.key] || position[card.type];
};

const gridStyle = (options) => {
  const gap = Number(options.gap || 12);
  const minWidth = Number(options.min_card_width || 280);
  return `--energy-dashboard-gap: ${gap}px; --energy-dashboard-min-card-width: ${minWidth}px;`;
};

const gridClass = (options) => {
  const columns = String(options.columns || "auto");
  return ["1", "2", "3", "4", "5", "6"].includes(columns) ? `grid columns-${columns}` : "grid";
};

const contentClass = (options) =>
  options.layout_type === "sidebar" || options.sidebar_cards?.length
    ? "content sidebar-layout"
    : "content";

const sidebarCardKeys = (options) => new Set(options.sidebar_cards || []);

const sidebarGridStyle = (options) => {
  const gap = Number(options.gap || 12);
  const minWidth = Number(options.sidebar_min_card_width || 180);
  return `--energy-dashboard-gap: ${gap}px; --energy-dashboard-min-card-width: ${minWidth}px;`;
};

const sidebarGridClass = (options) => {
  const columns = String(options.sidebar_columns || "1");
  return ["1", "2", "3"].includes(columns) ? `grid columns-${columns}` : "grid columns-1";
};

const applyCardLayout = (element, layout) => {
  element.style.removeProperty("grid-column");
  element.style.removeProperty("grid-row");

  if (!layout) {
    return;
  } else if (layout === "full" || layout.full_width) {
    element.style.gridColumn = "1 / -1";
  } else {
    const span = Number(typeof layout === "object" ? layout.columns : layout);
    if (Number.isFinite(span) && span > 1) {
      element.style.gridColumn = `span ${Math.min(span, 6)}`;
    }
  }
};

const applyCardGridPosition = (element, position) => {
  if (!position || typeof position !== "object") {
    return;
  }

  const column = Number(position.column ?? position.col);
  const row = Number(position.row);
  const columnSpan = Number(position.column_span ?? position.col_span ?? position.columns);
  const rowSpan = Number(position.row_span ?? position.rows);

  if (Number.isFinite(column) && column > 0) {
    element.style.gridColumnStart = String(column);
  }
  if (Number.isFinite(columnSpan) && columnSpan > 0) {
    element.style.gridColumnEnd = `span ${Math.min(columnSpan, 6)}`;
  }
  if (Number.isFinite(row) && row > 0) {
    element.style.gridRowStart = String(row);
  }
  if (Number.isFinite(rowSpan) && rowSpan > 0) {
    element.style.gridRowEnd = `span ${rowSpan}`;
  }
};

const applyCardPosition = (element, index) => {
  element.style.order = String(index);
};

const createCardShell = (element, card, layout, position, index) => {
  const shell = document.createElement("div");
  shell.className = card.type === "energy-date-selection" ? "energy-date-shell" : "energy-card-shell";
  shell.dataset.cardKey = card.key;
  shell.dataset.cardType = card.type;
  shell._energyCard = element;

  applyCardLayout(shell, layout);
  applyCardGridPosition(shell, position);
  applyCardPosition(shell, index);

  if (card.type !== "energy-date-selection") {
    element.style.position = "static";
    element.style.inset = "auto";
  }
  element.style.removeProperty("grid-column");
  element.style.removeProperty("order");
  element.style.width = "100%";
  element.style.maxWidth = "none";
  shell.replaceChildren(element);

  return shell;
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
    this._cards.forEach((cardShell) => {
      if (cardShell._energyCard) {
        cardShell._energyCard.hass = hass;
      }
    });
    this._updateBadges();
  }

  getCardSize() {
    return Math.max(12, viewCards(this._config, currentViewKey(this._config)).length * 2);
  }

  getGridOptions() {
    return {
      columns: 12,
      min_columns: 12,
      rows: this.getCardSize(),
    };
  }

  getLayoutOptions() {
    return {
      grid_columns: 12,
      grid_min_columns: 12,
      grid_rows: this.getCardSize(),
    };
  }

  async _render() {
    const viewKey = currentViewKey(this._config);
    const options = tabConfig(this._config, viewKey);
    const cards = viewCards(this._config, viewKey);
    const renderKey = JSON.stringify({
      config: this._config,
      viewKey,
      cards,
    });

    if (renderKey === this._renderKey && this._cards.length) {
      return;
    }

    this._renderKey = renderKey;
    this._cards = [];
    this.shadowRoot.innerHTML = `
      ${baseStyles()}
      <div class="dashboard">
        ${this._config.show_view_tabs !== false ? this._viewTabs() : ""}
        <div id="badges" class="badges"></div>
        <div class="${contentClass(options)}">
          <div id="grid" class="${gridClass(options)}" style="${gridStyle(options)}"></div>
          <div id="sidebar" class="${sidebarGridClass(options)} sidebar-grid" style="${sidebarGridStyle(options)}"></div>
        </div>
        <div id="date-footer" class="date-footer"></div>
      </div>
    `;

    const grid = this.shadowRoot.getElementById("grid");
    const sidebar = this.shadowRoot.getElementById("sidebar");
    const dateFooter = this.shadowRoot.getElementById("date-footer");
    this._updateBadges();

    try {
      this._helpers = this._helpers || (await window.loadCardHelpers());
      const elements = await Promise.all(
        cards.map(async (card, index) => {
          const cardConfig = dashboardCardConfig(card, this._config, viewKey);
          try {
            const element = await this._helpers.createCardElement(cardConfig);
            if (this._hass) {
              element.hass = this._hass;
            }
            return createCardShell(
              element,
              card,
              cardLayoutFor(this._config, viewKey, card),
              cardPositionFor(this._config, viewKey, card),
              index
            );
          } catch (error) {
            const errorCard = createErrorCard(`Unable to load ${cardConfig.type}: ${error.message}`);
            return createCardShell(
              errorCard,
              card,
              cardLayoutFor(this._config, viewKey, card),
              cardPositionFor(this._config, viewKey, card),
              index
            );
          }
        })
      );
      this._cards = elements;
      const dateElements = elements.filter(
        (element) => element.dataset.cardType === "energy-date-selection"
      );
      const gridElements = elements.filter(
        (element) => element.dataset.cardType !== "energy-date-selection"
      );
      const sidebarKeys = sidebarCardKeys(options);
      const sidebarElements = gridElements.filter(
        (element) => sidebarKeys.has(element.dataset.cardKey) || sidebarKeys.has(element.dataset.cardType)
      );
      const mainElements = gridElements.filter((element) => !sidebarElements.includes(element));
      grid.replaceChildren(...mainElements);
      sidebar.replaceChildren(...sidebarElements);
      sidebar.hidden = sidebarElements.length === 0;
      dateFooter.replaceChildren(...dateElements);
      dateFooter.hidden = dateElements.length === 0;
    } catch (error) {
      this._cards = [];
      renderError(grid, `Unable to load energy dashboard: ${error.message}`);
    }
  }

  _viewTabs() {
    const positionClass =
      this._config.tabs_position === "card" ? "card-tabs" : "top-tabs";

    return `
      <div class="tabs ${positionClass}">
        ${displayedViews(this._config)
          .map((view) => [view, DASHBOARD_VIEWS[view] || { label: view }])
          .map(
            ([view, definition]) => `
              <button
                class="${currentViewKey(this._config) === view ? "active" : ""}"
                data-view="${view}"
                type="button"
              >${definition.label}</button>
            `
          )
          .join("")}
      </div>
    `;
  }

  _updateBadges() {
    const badges = this.shadowRoot?.getElementById("badges");
    if (!badges) {
      return;
    }

    const items = badgeConfigs(this._config, currentViewKey(this._config));
    badges.innerHTML = renderBadges(this._hass, items);
    badges.hidden = items.length === 0;
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
    this._editTab = undefined;
    this._rawDashboardConfig = "{}";
    this._rawTabConfig = "{}";
    this._rawError = "";
  }

  setConfig(config) {
    this._config = normalizeConfig(config);
    if (!DEFAULT_VIEW_KEYS.includes(this._editTab)) {
      this._editTab = currentViewKey(this._config);
    }
    this._rawDashboardConfig = JSON.stringify(this._config.card_options || {}, null, 2);
    this._rawTabConfig = JSON.stringify(this._config.tab_options || {}, null, 2);
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

  _setEditorValue(key, value) {
    if (key === "edit_tab") {
      this._editTab = value;
      this._render();
    }
  }

  _setVisibleTab(viewKey, visible) {
    const visibleTabs = new Set(this._config.visible_tabs || DEFAULT_VIEW_KEYS);
    if (visible) {
      visibleTabs.add(viewKey);
    } else {
      visibleTabs.delete(viewKey);
    }
    this._config = {
      ...this._config,
      visible_tabs: DEFAULT_VIEW_KEYS.filter((view) => visibleTabs.has(view)),
    };

    if (!this._config.visible_tabs.includes(this._config.view)) {
      this._config.view = this._config.visible_tabs[0] || DEFAULT_CONFIG.view;
    }

    this._emit();
  }

  _setTabValue(viewKey, key, value) {
    const tabOptions = clone(this._config.tab_options);
    const tab = {
      ...clone(tabOptions[viewKey]),
      [key]: value,
    };

    Object.keys(tab).forEach((tabKey) => {
      if (tab[tabKey] === "" || tab[tabKey] === undefined || tab[tabKey] === null) {
        delete tab[tabKey];
      }
    });

    tabOptions[viewKey] = tab;
    this._config = {
      ...this._config,
      tab_options: tabOptions,
    };
    this._emit();
  }

  _setTabHiddenCard(viewKey, key, hidden) {
    const tabOptions = clone(this._config.tab_options);
    const tab = clone(tabOptions[viewKey]);
    const hiddenCards = new Set(tab.hidden_cards || []);

    if (hidden) {
      hiddenCards.add(key);
    } else {
      hiddenCards.delete(key);
    }

    tab.hidden_cards = [...hiddenCards];
    tabOptions[viewKey] = tab;
    this._config = {
      ...this._config,
      tab_options: tabOptions,
    };
    this._emit();
  }

  _setTabCardLayout(viewKey, key, value) {
    const tabOptions = clone(this._config.tab_options);
    const tab = clone(tabOptions[viewKey]);
    const cardLayout = clone(tab.card_layout);

    if (!value || value === "auto") {
      delete cardLayout[key];
    } else {
      cardLayout[key] = value;
    }

    if (Object.keys(cardLayout).length) {
      tab.card_layout = cardLayout;
    } else {
      delete tab.card_layout;
    }

    tabOptions[viewKey] = tab;
    this._config = {
      ...this._config,
      tab_options: tabOptions,
    };
    this._emit();
  }

  _setTabCardOrder(viewKey, key, value) {
    const cards = DASHBOARD_VIEWS[viewKey]?.cards || DASHBOARD_VIEWS.electricity.cards;
    const tabOptions = clone(this._config.tab_options);
    const tab = clone(tabOptions[viewKey]);
    const order = orderedCards(cards, tab.card_order)
      .map((card) => card.key)
      .filter((item) => item !== key);
    const position = Number(value);

    if (Number.isFinite(position) && position > 0) {
      order.splice(Math.min(position - 1, order.length), 0, key);
    }

    if (order.length) {
      tab.card_order = order;
    } else {
      delete tab.card_order;
    }

    tabOptions[viewKey] = tab;
    this._config = {
      ...this._config,
      tab_options: tabOptions,
    };
    this._emit();
  }

  _moveTabCard(viewKey, key, direction) {
    const cards = DASHBOARD_VIEWS[viewKey]?.cards || DASHBOARD_VIEWS.electricity.cards;
    const tabOptions = clone(this._config.tab_options);
    const tab = clone(tabOptions[viewKey]);
    const orderedKeys = orderedCards(cards, tab.card_order).map((card) => card.key);
    const index = orderedKeys.indexOf(key);
    const nextIndex = index + direction;

    if (index < 0 || nextIndex < 0 || nextIndex >= orderedKeys.length) {
      return;
    }

    const [moved] = orderedKeys.splice(index, 1);
    orderedKeys.splice(nextIndex, 0, moved);
    tab.card_order = orderedKeys;
    tabOptions[viewKey] = tab;

    this._config = {
      ...this._config,
      tab_options: tabOptions,
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

  _parseRaw(value, key) {
    if (key === "tab_options") {
      this._rawTabConfig = value;
    } else {
      this._rawDashboardConfig = value;
    }

    try {
      const parsed = value.trim() ? JSON.parse(value) : {};
      this._rawError = "";
      this._config = {
        ...this._config,
        [key]: parsed,
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
      ${this._rawError ? `<div class="error">${escapeHtml(this._rawError)}</div>` : ""}
    `;

    this.shadowRoot.querySelectorAll("select[data-key], input[type='text'][data-key]").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setValue(event.target.dataset.key, event.target.value);
      });
    });

    this.shadowRoot.querySelectorAll("[data-editor-key]").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setEditorValue(event.target.dataset.editorKey, event.target.value);
      });
    });

    this.shadowRoot.querySelectorAll("input[type='checkbox'][data-key]").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setValue(event.target.dataset.key, event.target.checked);
      });
    });

    this.shadowRoot.querySelectorAll("input[type='checkbox'][data-tab-visible]").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setVisibleTab(event.target.dataset.tabVisible, event.target.checked);
      });
    });

    this.shadowRoot.querySelectorAll("[data-tab-key]").forEach((element) => {
      element.addEventListener("change", (event) => {
        const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        this._setTabValue(event.target.dataset.view, event.target.dataset.tabKey, value);
      });
    });

    this.shadowRoot.querySelectorAll("input[type='checkbox'][data-tab-card-key]").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setTabHiddenCard(
          event.target.dataset.view,
          event.target.dataset.tabCardKey,
          !event.target.checked
        );
      });
    });

    this.shadowRoot.querySelectorAll("[data-tab-card-layout-key]").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setTabCardLayout(
          event.target.dataset.view,
          event.target.dataset.tabCardLayoutKey,
          event.target.value
        );
      });
    });

    this.shadowRoot.querySelectorAll("[data-tab-card-order-key]").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._setTabCardOrder(
          event.target.dataset.view,
          event.target.dataset.tabCardOrderKey,
          event.target.value
        );
      });
    });

    this.shadowRoot.querySelectorAll("[data-tab-card-move]").forEach((element) => {
      element.addEventListener("click", (event) => {
        this._moveTabCard(
          event.currentTarget.dataset.view,
          event.currentTarget.dataset.tabCardMove,
          Number(event.currentTarget.dataset.direction)
        );
      });
    });

    this.shadowRoot.querySelectorAll("textarea").forEach((element) => {
      element.addEventListener("change", (event) => {
        this._parseRaw(event.target.value, event.target.dataset.key);
      });
    });
  }

  _dashboardControls(viewOptions) {
    const viewKey = DEFAULT_VIEW_KEYS.includes(this._editTab)
      ? this._editTab
      : currentViewKey(this._config);
    const cards = DASHBOARD_VIEWS[viewKey]?.cards || DASHBOARD_VIEWS.electricity.cards;
    const visibleTabs = new Set(this._config.visible_tabs || DEFAULT_VIEW_KEYS);
    const options = tabConfig(this._config, viewKey);
    const rawTab = clone(this._config.tab_options?.[viewKey]);
    const cardLayout = clone(rawTab.card_layout);
    const cardOrder = rawTab.card_order || [];
    const hiddenCards = new Set([
      ...hiddenCardsFor(this._config.hidden_cards, viewKey),
      ...hiddenCardsFor(this._config.tab_options?.[viewKey]?.hidden_cards, viewKey),
    ]);
    const orderedEditorCards = orderedCards(cards, rawTab.card_order);
    const allCards = orderedEditorCards.map((card) => card.key);

    return `
      <fieldset>
        <legend>Energy tabs shown</legend>
        ${DEFAULT_VIEW_KEYS.map(
          (view) => `
            <label class="check">
              <input type="checkbox" data-tab-visible="${view}" ${
                visibleTabs.has(view) ? "checked" : ""
              }>
              ${escapeHtml(DASHBOARD_VIEWS[view].label)}
            </label>
          `
        ).join("")}
      </fieldset>
      <label>
        Energy tab to edit
        <select data-editor-key="edit_tab">
          ${Object.entries(DASHBOARD_VIEWS)
            .map(
              ([view, definition]) =>
                `<option value="${view}" ${
                  viewKey === view ? "selected" : ""
                }>${definition.label}</option>`
            )
            .join("")}
        </select>
      </label>
      <label>
        Initial Energy tab shown
        <select data-key="view">${viewOptions}</select>
      </label>
      <label class="check">
        <input type="checkbox" data-key="show_view_tabs" ${
          this._config.show_view_tabs !== false ? "checked" : ""
        }>
        Show view tabs
      </label>
      <label>
        Tab style
        <select data-key="tabs_position">
          <option value="top" ${
            (this._config.tabs_position || DEFAULT_CONFIG.tabs_position) === "top" ? "selected" : ""
          }>Top app-style tabs</option>
          <option value="card" ${
            this._config.tabs_position === "card" ? "selected" : ""
          }>Card pill tabs</option>
        </select>
      </label>
      <label class="check">
        <input type="checkbox" data-view="${viewKey}" data-tab-key="show_date_selection" ${
          options.show_date_selection !== false ? "checked" : ""
        }>
        Show date selection card in this Energy tab
      </label>
      <fieldset>
        <legend>Layout for ${escapeHtml(DASHBOARD_VIEWS[viewKey]?.label || viewKey)}</legend>
        <label>
          Columns
          <select data-view="${viewKey}" data-tab-key="columns">
            <option value="auto" ${String(options.columns || "auto") === "auto" ? "selected" : ""}>Auto</option>
            <option value="1" ${String(options.columns) === "1" ? "selected" : ""}>1</option>
            <option value="2" ${String(options.columns) === "2" ? "selected" : ""}>2</option>
            <option value="3" ${String(options.columns) === "3" ? "selected" : ""}>3</option>
            <option value="4" ${String(options.columns) === "4" ? "selected" : ""}>4</option>
            <option value="5" ${String(options.columns) === "5" ? "selected" : ""}>5</option>
            <option value="6" ${String(options.columns) === "6" ? "selected" : ""}>6</option>
          </select>
        </label>
        <label>
          Minimum card width
          <input data-view="${viewKey}" data-tab-key="min_card_width" type="number" min="160" max="600" value="${
            escapeAttr(rawTab.min_card_width || "")
          }" placeholder="280">
        </label>
        <label>
          Card gap
          <input data-view="${viewKey}" data-tab-key="gap" type="number" min="0" max="48" value="${
            escapeAttr(rawTab.gap || "")
          }" placeholder="12">
        </label>
        <label>
          Sankey layout
          <select data-view="${viewKey}" data-tab-key="layout">
            <option value="auto" ${options.layout === "auto" ? "selected" : ""}>Auto</option>
            <option value="horizontal" ${options.layout === "horizontal" ? "selected" : ""}>Horizontal</option>
            <option value="vertical" ${options.layout === "vertical" ? "selected" : ""}>Vertical</option>
          </select>
        </label>
        <label class="check">
          <input type="checkbox" data-view="${viewKey}" data-tab-key="group_by_floor" ${
            options.group_by_floor !== false ? "checked" : ""
          }>
          Group Sankey cards by floor
        </label>
        <label class="check">
          <input type="checkbox" data-view="${viewKey}" data-tab-key="group_by_area" ${
            options.group_by_area !== false ? "checked" : ""
          }>
          Group Sankey cards by area
        </label>
      </fieldset>
      <fieldset>
        <legend>Cards and card layout in this Energy tab</legend>
        ${orderedEditorCards
          .map((card, index) => {
            const key = card.key;
            const label = card.title || CARD_TYPES[card.type]?.label || card.type;
            const layout = String(cardLayout[key] || cardLayout[card.type] || "auto");
            const order = cardOrder.indexOf(key) + 1 || "";
            return `
              <div class="card-row">
                <label class="check">
                  <input type="checkbox" data-view="${viewKey}" data-tab-card-key="${key}" ${
                    hiddenCards.has(key) || hiddenCards.has(card.type) ? "" : "checked"
                  }>
                  <span>${escapeHtml(label)}</span>
                </label>
                <input
                  data-view="${viewKey}"
                  data-tab-card-order-key="${key}"
                  type="number"
                  min="1"
                  max="${allCards.length}"
                  value="${escapeAttr(order)}"
                  placeholder="-"
                  title="Card order"
                >
                <div class="move-buttons">
                  <button
                    data-view="${viewKey}"
                    data-tab-card-move="${key}"
                    data-direction="-1"
                    type="button"
                    title="Move up"
                    ${index === 0 ? "disabled" : ""}
                  >Up</button>
                  <button
                    data-view="${viewKey}"
                    data-tab-card-move="${key}"
                    data-direction="1"
                    type="button"
                    title="Move down"
                    ${index === orderedEditorCards.length - 1 ? "disabled" : ""}
                  >Down</button>
                </div>
                <select data-view="${viewKey}" data-tab-card-layout-key="${key}" title="Card width">
                  <option value="auto" ${layout === "auto" ? "selected" : ""}>Auto</option>
                  <option value="full" ${layout === "full" ? "selected" : ""}>Full width</option>
                  <option value="2" ${layout === "2" ? "selected" : ""}>Span 2</option>
                  <option value="3" ${layout === "3" ? "selected" : ""}>Span 3</option>
                  <option value="4" ${layout === "4" ? "selected" : ""}>Span 4</option>
                  <option value="5" ${layout === "5" ? "selected" : ""}>Span 5</option>
                  <option value="6" ${layout === "6" ? "selected" : ""}>Span 6</option>
                </select>
              </div>
            `;
          })
          .join("")}
      </fieldset>
      <label>
        Per-card override JSON
        <textarea data-key="card_options">${escapeHtml(this._rawDashboardConfig)}</textarea>
      </label>
      <label>
        Tab options JSON
        <textarea data-key="tab_options">${escapeHtml(this._rawTabConfig)}</textarea>
      </label>
    `;
  }
}

const baseStyles = () => `
  <style>
    :host {
      display: block;
      width: 100%;
      max-width: none;
    }
    ha-card {
      display: block;
      width: 100%;
      max-width: none;
      border: 0;
      background: transparent;
      box-shadow: none;
      overflow: visible;
    }
    .dashboard {
      padding: 12px;
    }
    .badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
      margin: 0 0 12px;
    }
    .badges[hidden] {
      display: none;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 40px;
      padding: 6px 12px;
      border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(127, 127, 127, 0.32)));
      border-radius: 999px;
      background: var(--ha-card-background, var(--card-background-color));
      box-shadow: var(--ha-card-box-shadow, 0 1px 2px rgba(0, 0, 0, 0.08));
      color: var(--primary-text-color);
    }
    .badge ha-icon {
      color: var(--primary-color);
    }
    .badge-name {
      color: var(--secondary-text-color);
      font-size: 12px;
      line-height: 16px;
    }
    .badge-value {
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
    }
    .content {
      display: block;
    }
    .content.sidebar-layout {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, var(--energy-dashboard-sidebar-width, 30%));
      gap: var(--energy-dashboard-gap, 12px);
      align-items: start;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(var(--energy-dashboard-min-card-width, 280px), 1fr));
      gap: var(--energy-dashboard-gap, 12px);
      align-items: start;
      grid-auto-flow: row;
    }
    .grid.columns-1 {
      grid-template-columns: 1fr;
    }
    .grid.columns-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .grid.columns-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .grid.columns-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .grid.columns-5 {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
    .grid.columns-6 {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
    .sidebar-grid[hidden] {
      display: none;
    }
    .energy-card-shell {
      display: block;
      width: 100%;
      min-width: 0;
      border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(127, 127, 127, 0.32)));
      border-radius: var(--energy-dashboard-card-radius, 12px);
      background: var(--ha-card-background, var(--card-background-color));
      box-shadow: var(--ha-card-box-shadow, 0 1px 2px rgba(0, 0, 0, 0.08));
      overflow: hidden;
      clip-path: inset(0 round var(--energy-dashboard-card-radius, 12px));
    }
    .energy-card-shell > * {
      display: block;
      width: 100%;
      max-width: none;
      position: static !important;
      inset: auto !important;
      margin: 0;
    }
    .energy-card-shell ha-card {
      border: 0;
      box-shadow: none;
      border-radius: 0;
    }
    .date-footer {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: var(--energy-dashboard-gap, 12px);
      padding: 0 0 8px;
      position: sticky;
      bottom: 0;
      z-index: 5;
      pointer-events: none;
      filter: drop-shadow(0 8px 18px rgba(0, 0, 0, 0.28));
    }
    .date-footer[hidden] {
      display: none;
    }
    .energy-date-shell {
      width: min(100%, var(--energy-dashboard-date-width, 500px));
      height: var(--energy-dashboard-date-height, 48px);
      pointer-events: auto;
      border: 1px solid var(--ha-card-border-color, var(--divider-color, rgba(127, 127, 127, 0.32)));
      border-radius: var(--energy-dashboard-card-radius, 12px);
      background: var(--ha-card-background, var(--card-background-color));
      box-shadow: var(--energy-dashboard-date-shadow, 0 10px 30px rgba(0, 0, 0, 0.32));
      overflow: hidden;
    }
    .energy-date-shell > * {
      width: 100%;
      max-width: none;
      transform: translateY(var(--energy-dashboard-date-offset, -7px)) scale(var(--energy-dashboard-date-scale, 0.88));
      transform-origin: top center;
    }
    .energy-date-shell ha-card {
      border: 0;
      box-shadow: none;
      border-radius: 0;
    }
    @media (max-width: 640px) {
      .content.sidebar-layout {
        grid-template-columns: 1fr;
      }
      .grid.columns-2,
      .grid.columns-3,
      .grid.columns-4,
      .grid.columns-5,
      .grid.columns-6 {
        grid-template-columns: 1fr;
      }
    }
    .tabs {
      display: flex;
      gap: 4px;
      margin: 0 0 12px;
      overflow-x: auto;
      scrollbar-width: thin;
    }
    .tabs.top-tabs {
      align-items: stretch;
      gap: 0;
      min-height: 48px;
      margin: -12px -12px 12px;
      padding: 0 12px;
      background: var(--app-header-background-color, var(--card-background-color, #fff));
      border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.24));
      position: sticky;
      top: var(--energy-dashboard-tabs-top, 0px);
      z-index: 6;
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
    .tabs.top-tabs button {
      border-radius: 0;
      border-bottom: 2px solid transparent;
      padding: 0 16px;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 14px;
      font-weight: 500;
    }
    .tabs.top-tabs button.active {
      background: transparent;
      border-bottom-color: var(--primary-text-color);
      color: var(--primary-text-color);
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
    .card-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 64px 116px 132px;
      gap: 8px;
      align-items: center;
      margin: 0 0 12px;
    }
    .card-row label {
      margin: 0;
    }
    .card-row select {
      margin: 0;
    }
    .card-row input[type="number"] {
      box-sizing: border-box;
      width: 100%;
      margin: 0;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
    }
    .card-row span {
      min-width: 0;
    }
    .move-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4px;
    }
    .move-buttons button {
      min-width: 0;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 8px 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    .move-buttons button:disabled {
      cursor: default;
      opacity: 0.45;
    }
    @media (max-width: 420px) {
      .card-row {
        grid-template-columns: 1fr;
      }
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
