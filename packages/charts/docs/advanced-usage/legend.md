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

## Focusable non-interactive series

Set `[interactive]="false"` on `nui-legend` and `[focusable]="true"` on its
`nui-legend-series` items to include informational series in the Tab order.
The `focusable` input defaults to `false`. It does not enable visibility
toggling or change the series from a list item into a checkbox or button.
Tab and Shift+Tab move between the series; Enter and Space do not toggle them.
Use native links or buttons for independent actions rather than treating a
focusable series as an action control.

Focus alone does not emphasize the chart. Bind `focusin` and `focusout` to the
same initialized `ChartAssist` used by the chart, as in this focus-driven
emphasis example:

```html
<nui-chart [chart]="chartAssist.chart"></nui-chart>
<nui-legend [interactive]="false">
    <nui-legend-series
        *ngFor="let series of chartAssist.legendSeriesSet"
        [focusable]="true"
        [descriptionPrimary]="series.name"
        [seriesRenderState]="chartAssist.renderStatesIndex[series.id]?.state"
        (focusin)="chartAssist.emphasizeSeries(series.id)"
        (focusout)="chartAssist.resetVisibleSeries()">
        <nui-basic-legend-tile></nui-basic-legend-tile>
    </nui-legend-series>
</nui-legend>
```
