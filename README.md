# Editable Energy Dashboard

Editable Energy Dashboard is a Home Assistant custom Lovelace card that builds
a customisable version of Home Assistant's built-in Energy dashboard from the
native Energy cards.

It still delegates rendering to Home Assistant's own card factory, so the
graphs, gauges, Sankey cards, tables, and date selector stay close to the
native Energy dashboard. The custom part is the wrapper, view layout, and card
editor.

## Files To Add

Create this file in your Home Assistant config directory:

```text
/config/www/custom-energy-dashboard.js
```

Copy the contents of this repository's `custom-energy-dashboard.js` into that
file.

Home Assistant serves files in `/config/www/` from the `/local/` URL path, so
the browser resource URL is:

```text
/local/custom-energy-dashboard.js
```

## Add Dashboard Resource

### UI-Managed Dashboards

Use this if you edit dashboards from the Home Assistant UI.

1. Go to **Settings**.
2. Open **Dashboards**.
3. Open the three-dot menu.
4. Select **Resources**.
5. Select **Add Resource**.
6. Enter:

```text
URL: /local/custom-energy-dashboard.js
Resource type: JavaScript module
```

### YAML-Mode Dashboards

Use this if your dashboards are managed through YAML.

Add this under the top-level `lovelace:` header in `/config/configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/custom-energy-dashboard.js
      type: module
```

Restart Home Assistant or reload Lovelace resources after editing
`configuration.yaml`.

## Add The Full Dashboard Card

Add this card YAML as a **card** in a dashboard view:

```yaml
type: custom:editable-energy-dashboard
view: electricity
show_view_tabs: true
tabs_position: top
show_date_selection: true
visible_tabs:
  - electricity
  - gas
  - water
```

If you are editing a full dashboard YAML file, the custom dashboard must be
nested under `cards:` inside a Lovelace view:

```yaml
views:
  - title: Energy
    path: energy
    type: panel
    cards:
      - type: custom:editable-energy-dashboard
        view: electricity
        show_view_tabs: true
        tabs_position: top
        visible_tabs:
          - electricity
          - gas
          - now
        tab_options:
          electricity:
            columns: 3
            gap: 12
            min_card_width: 260
            hidden_cards:
              - carbon
              - grid_balance
            card_layout:
              usage: full
              solar: full
          gas:
            columns: 1
            hidden_cards:
              - sources
          now:
            columns: 2
```

Do not put `type: custom:editable-energy-dashboard` directly under `views:`.
Home Assistant will treat that as a view definition instead of a card.

Use `type: panel` on the Lovelace view if you want this dashboard card to take
the full available page width.

The page title at the very top, such as `Energy`, is the Home Assistant
Lovelace view title from `views[].title`, not part of this custom card. Rename
or blank that Lovelace view title if you do not want it shown. A Lovelace card
cannot inject its tabs into Home Assistant's own app header, but
`tabs_position: top` renders a fixed Home Assistant-style tab strip at the top
of the browser window. Use `tabs_position: card` if you prefer the older pill
buttons.

The top tab strip can be tuned with CSS variables if your Home Assistant theme
or sidebar width needs a different offset:

- `--energy-dashboard-tabs-top`: distance from the top of the browser window
- `--energy-dashboard-tabs-left`: distance from the left edge, useful with a sidebar
- `--energy-dashboard-tabs-right`: distance from the right edge
- `--energy-dashboard-tabs-height`: reserved height for the tab strip

You can switch between the included Energy tabs from the card editor or by
using the tabs on the card.

In the visual editor, use **Energy tab to edit** to choose which internal Energy
tab's cards and layout you are changing. This is separate from **Initial Energy
tab shown**, which only controls the tab that opens first inside the custom
card.

Use **Energy tabs shown** in the editor to choose which internal Energy tabs are
visible. In the selected Energy tab's card list, use each card's width selector
to set that card to automatic width, full width, or a 2/3/4/5/6-column span.

If your dashboard is YAML-mode, Home Assistant does not show the normal visual
card editor for custom cards. The editor exists for UI-managed dashboards, but
YAML-mode dashboards must be edited in YAML.

## Included Dashboard Views

- `overview`
- `electricity`
- `gas`
- `water`
- `now`

The `overview` key is displayed as **Summary** in the tab bar.

The `overview`, `electricity`, `gas`, and `water` Energy tabs can include the
date selector when `show_date_selection` is enabled for that tab. The date
selector is rendered as a sticky bottom-centered footer, matching Home
Assistant's built-in Energy dashboard behavior while the page scrolls.

The date selector uses `--energy-dashboard-date-shadow`,
`--energy-dashboard-date-width`, `--energy-dashboard-date-height`,
`--energy-dashboard-date-offset`, and `--energy-dashboard-date-scale` CSS
variables. The default height is `48px` and the default inner scale is `0.88`
to keep the footer compact.

## Dashboard Options

- Home Assistant dashboard view setup
- Separate Energy tab selection
- Show or hide the view tabs
- Top app-style tabs or card pill tabs
- Show or hide individual Energy tabs
- Per-tab badges
- Show or hide the date selection card
- Battery SoC history card in the Electricity tab
- Energy collection key
- Link to Energy dashboard, for `energy-distribution`
- Per-tab column layout
- Per-tab card width and gap
- Per-tab Sankey layout
- Per-tab Sankey grouping by floor or area
- Show or hide individual cards in each Energy tab
- Set each card to auto, full width, or a column span inside an Energy tab
- Per-card override JSON
- Per-tab override JSON

## Tab And Layout Options

Use `visible_tabs` to choose which internal Energy tabs are shown. Use
`tab_options` to control the cards and layout for each Energy tab.

```yaml
type: custom:editable-energy-dashboard
view: electricity
visible_tabs:
  - electricity
  - gas
  - now
tab_options:
  electricity:
    columns: 3
    gap: 12
    min_card_width: 260
    hidden_cards:
      - carbon
      - grid_balance
    card_layout:
      usage: full
      solar: full
  gas:
    columns: 1
    hidden_cards:
      - sources
  now:
    columns: 2
```

Supported layout values:

- `columns`: `auto`, `1`, `2`, `3`, `4`, `5`, or `6`
- `min_card_width`: minimum card width in pixels for `auto` layout
- `gap`: spacing between cards in pixels
- `hidden_cards`: card keys or built-in card types to hide in that tab
- `card_order`: ordered list of card keys or card types to place first
- `card_layout`: set a card key or type to `full` or a column span number from `2` to `6`
- `card_position`: set exact grid row, column, row span, and column span for a card
- `layout_type`: set to `sidebar` to split a tab into main and sidebar columns
- `sidebar_cards`: card keys or built-in card types to place in the sidebar
- `sidebar_columns`: number of columns inside the sidebar, usually `1` or `2`
- `badges`: entity/value badges to show at the top of the Energy tab
- `battery_soc_entity`: battery state-of-charge percentage entity for the Electricity tab's `battery_soc` card

Each non-date built-in Energy card is wrapped in a dashboard shell so it keeps
a visible rounded outline and stays fixed in the configured grid position.

Card order and width example:

```yaml
tab_options:
  electricity:
    columns: 3
    card_order:
      - distribution
      - usage
      - solar
      - sources
      - devices
      - sankey
    card_layout:
      distribution: full
      usage: full
      solar: full
      sources: 2
      devices: 2
      sankey: full
```

Exact grid position example:

```yaml
tab_options:
  electricity:
    columns: 6
    card_position:
      distribution:
        row: 1
        column: 1
        column_span: 6
      usage:
        row: 2
        column: 1
        column_span: 3
      solar:
        row: 2
        column: 4
        column_span: 3
      sources:
        row: 3
        column: 1
        column_span: 2
      devices:
        row: 3
        column: 3
        column_span: 2
      sankey:
        row: 3
        column: 5
        column_span: 2
```

When `card_position` is set for a card, it overrides that card's automatic
placement in the grid. `card_order` still controls the fallback order for cards
without an exact position.

Sidebar layout example:

```yaml
tab_options:
  electricity:
    layout_type: sidebar
    columns: 1
    sidebar_columns: 2
    sidebar_cards:
      - distribution
      - grid_balance
      - grid_neutrality
      - solar_consumed
      - self_sufficiency
      - carbon
    card_order:
      - usage
      - solar
      - sources
      - distribution
      - grid_balance
      - grid_neutrality
      - solar_consumed
      - self_sufficiency
      - carbon
    card_layout:
      usage: full
      solar: full
      sources: full
      distribution: full
      grid_balance: full
```

Electricity badges and Battery SoC example:

```yaml
tab_options:
  electricity:
    battery_soc_entity: sensor.home_battery_state_of_charge
    battery_soc_hours_to_show: 24
    badges:
      - entity: sensor.home_battery_state_of_charge
        name: Battery
        icon: mdi:battery
      - entity: sensor.solar_power
        name: Solar
        icon: mdi:solar-power
    card_order:
      - usage
      - solar
      - battery_soc
      - sources
    card_layout:
      battery_soc: full
```

The Battery SoC card is part of the Electricity Energy tab and uses Home
Assistant's built-in `history-graph` card. Add `battery_soc` under
`tab_options.electricity.card_order` or `tab_options.electricity.card_layout`
when you want to place it.

In the visual editor, choose an **Energy tab to edit**, then use each card row's
Up/Down buttons, order field, and width selector. The editor saves a full
`card_order` for the selected Energy tab.

To put the date selector at the bottom of the Electricity tab, include `date`
last in that tab's `card_order`. Any visible card that is not listed in
`card_order` is appended after the listed cards, so include every visible card
before `date` if `date` must be the final card.

```yaml
tab_options:
  electricity:
    hidden_cards:
      - carbon
      - grid_balance
      - device_detail
      - devices
      - sankey
    card_order:
      - distribution
      - grid_neutrality
      - solar_consumed
      - self_sufficiency
      - compare
      - usage
      - solar
      - sources
      - date
```

## Card Overrides

Use `card_options` to pass raw config to a built-in Energy card. Keys can be
the card key used by this wrapper, or the built-in card type.

```yaml
type: custom:editable-energy-dashboard
view: electricity
card_options:
  energy-sources-table:
    show_only_totals: false
tab_options:
  electricity:
    hidden_cards:
      - carbon
    card_options:
      sankey:
        layout: horizontal
```

## Notes

This card intentionally delegates rendering to Home Assistant's built-in Energy
cards instead of copying their source. That keeps the UI close to Home
Assistant's native behavior, but these internal card types can change between
Home Assistant releases.

The built-in Energy cards still use Home Assistant's Energy dashboard
configuration and long-term statistics. This wrapper does not replace the Energy
dashboard setup.
