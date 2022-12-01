# Charts Overview

Nova Charts is a library created to provide potential consumers with solutions for various data visualizations that conform with the Nova Design Language. It's designed to solve common patterns identified by UX designers, but also be very flexible so that pieces of visualizations can be overridden or entirely new visualizations can be customized quickly. As with anything, the more customizations you wish to have, the more work and maintenance you will absorb within your own app's code.

## Getting Started

Getting started with charts is quite simple:

1. Include charts in your package.json file

        "devDependencies": {
            ...
            "@nova-ui/charts": >>last release version<<,
            ...
        }

2. Add a reference to charts styles in your angular.json file. Without this step, the charts will render, but will look and act in unpredictable ways.

        "projects": {
            "your-project": {
                ...
                "architect": {
                    ...
                    "styles": [
                        "src/styles.less",
                        "./node_modules/@nova-ui/bits/bundles/css/styles.css",
                        "./node_modules/@nova-ui/charts/bundles/css/styles.css"
                     ],

3. Import NuiChartsModule

        import { NuiChartsModule } from "@nova-ui/charts";

        @NgModule({
            declarations: [ ... ],
            imports: [ NuiChartsModule ],
            exports: [ ... ],
            providers: [ ... ]
        })

4. Copy/Paste any of our examples (see TOC below) to create your own component, add it to your view and then play around with the options.

## TOC

- [Layout](./additional-documentation/layout.html)
- [Chart Types](./additional-documentation/chart-types.html)
  - [Line](./additional-documentation/chart-types/line.html)
  - [Bar](./additional-documentation/chart-types/bar.html)
    - [Bucketed Bar](./additional-documentation/chart-types/bar/bucketed-bar.html)
    - [Status](./additional-documentation/chart-types/bar/status.html)
    - [Waterfall](./additional-documentation/chart-types/bar/waterfall.html)
  - [Pie and Donut](./additional-documentation/chart-types/pie-and-donut.html)
  - [Spark](./additional-documentation/chart-types/spark.html)
- [Plugins](./additional-documentation/plugins.html)
  - [Tooltips](./additional-documentation/plugins/tooltips.html)
  - [Popovers](./additional-documentation/plugins/popovers.html)
- [Thresholds](./additional-documentation/thresholds.html)
- [Timeframe Selection](./additional-documentation/timeframe-selection.html)
- [Advanced Usage](./additional-documentation/advanced-usage.html)
  - [Chart](./additional-documentation/advanced-usage/chart.html)
  - [Legend](./additional-documentation/advanced-usage/legend.html)
  - [Input Structure](./additional-documentation/advanced-usage/input-structure.html)
    - [Data](./additional-documentation/advanced-usage/input-structure/data.html)
    - [Colors](./additional-documentation/advanced-usage/input-structure/colors.html)
    - [Markers](./additional-documentation/advanced-usage/input-structure/markers.html)
  - [Events](./additional-documentation/advanced-usage/events.html)
  - [Grid](./additional-documentation/advanced-usage/grid.html)
  - [Scales](./additional-documentation/advanced-usage/scales.html)
    - [Domains](./additional-documentation/advanced-usage/scales/domains.html)
    - [Formatters](./additional-documentation/advanced-usage/scales/formatters.html)
