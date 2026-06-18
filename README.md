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

Add this card YAML to a dashboard:

```yaml
type: custom:editable-energy-dashboard
view: electricity
show_view_tabs: true
show_date_selection: true
visible_tabs:
  - electricity
  - gas
  - water
```

You can switch between the included Energy dashboard views from the card editor
or by using the tabs on the card.

In the visual editor, use **Tab to edit** to choose which tab's cards and layout
you are changing. This is separate from **Initial tab shown**, which only
controls the tab that opens first on the dashboard.

## Included Dashboard Views

- `overview`
- `electricity`
- `gas`
- `water`
- `now`

## Dashboard Options

- Dashboard view
- Separate editor tab selection
- Show or hide the view tabs
- Show or hide individual tabs
- Show or hide the date selection card
- Energy collection key
- Link to Energy dashboard, for `energy-distribution`
- Per-tab column layout
- Per-tab card width and gap
- Per-tab Sankey layout
- Per-tab Sankey grouping by floor or area
- Show or hide individual cards in each tab
- Per-card override JSON
- Per-tab override JSON

## Tab And Layout Options

Use `visible_tabs` to choose which tabs are shown. Use `tab_options` to control
the cards and layout for each tab.

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

- `columns`: `auto`, `1`, `2`, `3`, or `4`
- `min_card_width`: minimum card width in pixels for `auto` layout
- `gap`: spacing between cards in pixels
- `hidden_cards`: card keys or built-in card types to hide in that tab
- `card_order`: optional list of card keys or card types to sort first
- `card_layout`: set a card key or type to `full` or a column span number

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
