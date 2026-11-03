<iframe src="../../examples/#/advanced-usage/legend" width="100%" height="100%"></iframe>

## Independent legend actions

When an interactive legend series contains links, buttons, or a menu, set
`[separateControls]="true"` and supply `toggleAriaLabel` with the series name.
This keeps the visibility checkbox in the tile, outside the projected
description and menu controls. The default whole-series checkbox behavior is
unchanged when this option is omitted.

Tab reaches the tile checkbox and each projected action independently. Enter or
Space toggles visibility from the tile; activating a description action must not
toggle visibility. Stop click propagation from projected actions that should not
activate the series. Legend menus remain visible while focus is inside the
series, and keyboard focus is indicated on the tile.
