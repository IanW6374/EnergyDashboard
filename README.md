# Editable Energy Card

Editable Energy Card is a small Home Assistant custom Lovelace card that wraps
Home Assistant's built-in energy cards and adds a card editor.

It renders the selected built-in card through Home Assistant's own card factory,
so the display stays as close as possible to the native card. The custom part is
the wrapper configuration and editor.

## Install

Copy `editable-energy-card.js` into your Home Assistant config directory:

```text
<config>/www/editable-energy-card.js
```

Add it as a dashboard resource:

```yaml
url: /local/editable-energy-card.js
type: module
```

Then add a card:

```yaml
type: custom:editable-energy-card
card_type: energy-distribution
link_dashboard: true
```

## Supported Built-In Cards

- `energy-distribution`
- `energy-sankey`
- `power-sankey`
- `energy-usage-graph`
- `energy-solar-graph`
- `energy-grid-neutrality-gauge`
- `energy-self-sufficiency-gauge`
- `energy-solar-consumed-gauge`

## Editable Options

- Built-in energy card type
- Energy collection key
- Link to Energy dashboard, for `energy-distribution`
- Layout, for `energy-sankey`
- Group by floor, for `energy-sankey`
- Group by area, for `energy-sankey`
- Extra raw built-in card JSON

## Examples

Native energy distribution card with an editor:

```yaml
type: custom:editable-energy-card
card_type: energy-distribution
link_dashboard: true
```

Energy Sankey card:

```yaml
type: custom:editable-energy-card
card_type: energy-sankey
layout: auto
group_by_floor: true
group_by_area: true
```

Power Sankey card:

```yaml
type: custom:editable-energy-card
card_type: power-sankey
```

Pass through extra built-in card config:

```yaml
type: custom:editable-energy-card
card_type: energy-distribution
inner_config:
  collection_key: my_energy_collection
```

## Notes

This card intentionally delegates rendering to Home Assistant's built-in energy
cards instead of copying their source. That keeps the UI close to Home
Assistant's native behavior, but these internal card types can change between
Home Assistant releases.

The built-in energy cards still use Home Assistant's Energy dashboard
configuration and long-term statistics. This wrapper does not replace the Energy
dashboard setup.
