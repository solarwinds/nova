# Charts E2E Coverage Report

Generated from repository contents on 2026-04-21.

## Method notes

- Public API scope was taken from [packages/charts/src/public-api.ts](packages/charts/src/public-api.ts) and the area exports under [packages/charts/src](packages/charts/src).
- E2E source was reviewed under [packages/charts/e2e](packages/charts/e2e).
- No inventory file was found for Charts.
- No usable E2E line/branch instrumentation artifacts were found under [packages/charts/test-results](packages/charts/test-results), so all percentages below are **estimated** from source-to-test behavior mapping.
- Charts currently has no `.a11y.spec.ts` files, even though the shared Playwright projects include an `a11y` project in [playwright.config.base.ts](playwright.config.base.ts).
- Visual coverage is materially stronger than behavioral coverage for Charts.

## Naming mismatches

- `thresholds-summary` ↔ Thresholds public area
- `tooltips` ↔ `ChartTooltips*`
- `popover` ↔ `ChartPopoverComponent`
- `status-chart`, `spark-chart`, `bucketed-bar-chart`, `waterfall-chart`, and `time-frame-bar` ↔ shared renderer exports rather than one-to-one public API areas
- `donut-chart` ↔ indirect coverage for `ChartDonutContentComponent`

## Executive summary

| Component/Area | E2E specs | A11y specs | Visual specs | Line coverage % | Branch coverage % | Confidence | Status | Main gap |
| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| Chart shell & assists | 0 direct; 6 indirect | 0 | 0 direct; 14 indirect | 35 | 25 | low | partial E2E coverage | Lifecycle, resize, rebuild not directly tested |
| Legend | 1 | 0 | 1 | 70 | 60 | high | broad E2E coverage | No keyboard/a11y coverage |
| Thresholds | 1 | 0 | 1 | 55 | 45 | medium | partial E2E coverage | Most exported threshold APIs untested |
| Gauge | 0 | 0 | 1 | 25 | 20 | low | no E2E coverage | Visual-only |
| Tooltips | 0 | 0 | 1 | 20 | 15 | low | no E2E coverage | Visual-only |
| Popover | 0 | 0 | 1 | 30 | 20 | low | no E2E coverage | Visual-only |
| Donut Content | 0 direct; 1 indirect | 0 | 0 | 45 | 35 | medium | partial E2E coverage | Resize/reposition logic untested |
| Marker | 0 direct; 2 indirect | 0 | 0 direct; 2 indirect | 35 | 25 | medium | partial E2E coverage | Sizing and drawing branches untested |
| Chart Collection | 0 direct; 2 indirect | 0 | 0 | 30 | 25 | low | partial E2E coverage | Add/remove/destroy sync logic untested |
| Renderers - Line & Spark | 2 | 0 | 2 | 65 | 55 | medium | broad E2E coverage | Non-default line branches missing |
| Renderers - Bar / Status / TimeFrame / Waterfall | 1 | 0 | 5 | 40 | 30 | medium | partial E2E coverage | Mostly visual outside status chart |
| Renderers - Area | 0 | 0 | 2 | 20 | 15 | low | no E2E coverage | Visual-only |
| Renderers - Radial (Pie / Donut) | 2 | 0 | 2 | 55 | 45 | medium | partial E2E coverage | Geometry and config branches weak |
| Core/Common technical exports | 0 direct | 0 | 0 direct | 15 | 10 | low | no E2E coverage | Large exported surface only exercised incidentally |

## Per-area reports

### Chart shell & assists

- Source files reviewed: [packages/charts/src/chart/chart.component.ts](packages/charts/src/chart/chart.component.ts), [packages/charts/src/core/chart.ts](packages/charts/src/core/chart.ts), [packages/charts/src/core/chart-assists/chart-assist.ts](packages/charts/src/core/chart-assists/chart-assist.ts)
- Tests found: indirect coverage via [packages/charts/e2e/chart/line-chart.e2e.spec.ts](packages/charts/e2e/chart/line-chart.e2e.spec.ts), [packages/charts/e2e/chart/spark-chart.e2e.spec.ts](packages/charts/e2e/chart/spark-chart.e2e.spec.ts), [packages/charts/e2e/chart/status-chart.e2e.spec.ts](packages/charts/e2e/chart/status-chart.e2e.spec.ts), [packages/charts/e2e/chart/thresholds-summary.e2e.spec.ts](packages/charts/e2e/chart/thresholds-summary.e2e.spec.ts)
- Covered behaviors: render/build paths, assist-driven highlight behavior, shared hover flows through chart examples
- Uncovered or weakly covered behaviors: resize observer, intersection observer, chart rebuild/destroy, explicit refresh-event handling
- Line coverage: 35% estimated
- Branch coverage: 25% estimated
- Confidence: low
- Risk summary: shell regressions can affect many chart types at once while escaping current specs.

### Legend

- Source files reviewed: [packages/charts/src/legend/public-api.ts](packages/charts/src/legend/public-api.ts), [packages/charts/src/legend/legend.component.ts](packages/charts/src/legend/legend.component.ts), [packages/charts/src/legend/legend-series/legend-series.component.ts](packages/charts/src/legend/legend-series/legend-series.component.ts)
- Tests found: [packages/charts/e2e/legend/legend.e2e.spec.ts](packages/charts/e2e/legend/legend.e2e.spec.ts), [packages/charts/e2e/legend/legend.visual.spec.ts](packages/charts/e2e/legend/legend.visual.spec.ts)
- Covered behaviors: basic and rich tile rendering, projected values/descriptions, deselection/deemphasis, hover-vs-tile-hover behavior, marker/icon replacement
- Uncovered or weakly covered behaviors: keyboard focus, horizontal orientation, `activeChanged` semantics, accessibility roles/states
- Line coverage: 70% estimated
- Branch coverage: 60% estimated
- Confidence: high
- Risk summary: legend is one of the better-covered areas, but accessibility and keyboard regressions remain exposed.

### Thresholds

- Source files reviewed: [packages/charts/src/thresholds/public-api.ts](packages/charts/src/thresholds/public-api.ts), [packages/charts/src/thresholds/thresholds-service.ts](packages/charts/src/thresholds/thresholds-service.ts), [packages/charts/src/thresholds/thresholds-summary-grid-config.ts](packages/charts/src/thresholds/thresholds-summary-grid-config.ts)
- Tests found: [packages/charts/e2e/chart/thresholds-summary.e2e.spec.ts](packages/charts/e2e/chart/thresholds-summary.e2e.spec.ts), [packages/charts/e2e/chart/thresholds-summary.visual.spec.ts](packages/charts/e2e/chart/thresholds-summary.visual.spec.ts)
- Covered behaviors: summary visibility, multi-series vs single-series behavior, rectangle count/position/color, legend hover/click opacity, connected-chart interaction
- Uncovered or weakly covered behaviors: `getThresholdZones()`, `getThresholdLines()`, side indicators, interval logic, dynamic zones, collision handling
- Line coverage: 55% estimated
- Branch coverage: 45% estimated
- Confidence: medium
- Risk summary: the summary scenario is covered, but much of the exported threshold API is still weakly protected.

### Gauge

- Source files reviewed: [packages/charts/src/gauge/public-api.ts](packages/charts/src/gauge/public-api.ts), [packages/charts/src/gauge/gauge-util.ts](packages/charts/src/gauge/gauge-util.ts)
- Tests found: [packages/charts/e2e/chart/gauge.visual.spec.ts](packages/charts/e2e/chart/gauge.visual.spec.ts)
- Covered behaviors: visual variants and theme states only
- Uncovered or weakly covered behaviors: clamp-to-range, threshold activation, label plugins, update paths, edge cases
- Line coverage: 25% estimated
- Branch coverage: 20% estimated
- Confidence: low
- Risk summary: gauge exports are largely unprotected by functional E2E coverage.

### Tooltips

- Source files reviewed: [packages/charts/src/chart-tooltips/chart-tooltips.component.ts](packages/charts/src/chart-tooltips/chart-tooltips.component.ts), [packages/charts/src/chart-tooltips/chart-tooltip.directive.ts](packages/charts/src/chart-tooltips/chart-tooltip.directive.ts), [packages/charts/src/core/plugins/tooltips/chart-tooltips-plugin.ts](packages/charts/src/core/plugins/tooltips/chart-tooltips-plugin.ts)
- Tests found: [packages/charts/e2e/chart/tooltips.visual.spec.ts](packages/charts/e2e/chart/tooltips.visual.spec.ts)
- Covered behaviors: tooltip appearance snapshots for several chart types
- Uncovered or weakly covered behaviors: collision avoidance, orientation branches, hidden-series filtering, out-of-view hiding, attach/detach behavior
- Line coverage: 20% estimated
- Branch coverage: 15% estimated
- Confidence: low
- Risk summary: tooltip regressions are likely caught only when visually obvious.

### Popover

- Source files reviewed: [packages/charts/src/chart-popover/chart-popover.component.ts](packages/charts/src/chart-popover/chart-popover.component.ts), [packages/charts/src/core/plugins/chart-popover-plugin.ts](packages/charts/src/core/plugins/chart-popover-plugin.ts)
- Tests found: [packages/charts/e2e/chart/popover.visual.spec.ts](packages/charts/e2e/chart/popover.visual.spec.ts)
- Covered behaviors: visual placement snapshots for bar, donut, and line scenarios
- Uncovered or weakly covered behaviors: close/update logic, invalid-data handling, event semantics, coordinate math
- Line coverage: 30% estimated
- Branch coverage: 20% estimated
- Confidence: low
- Risk summary: popover position and lifecycle bugs can ship without failing functional tests.

### Donut Content

- Source files reviewed: [packages/charts/src/chart-donut-content/chart-donut-content.component.ts](packages/charts/src/chart-donut-content/chart-donut-content.component.ts)
- Tests found: indirect coverage via [packages/charts/e2e/chart/donut-chart.e2e.spec.ts](packages/charts/e2e/chart/donut-chart.e2e.spec.ts)
- Covered behaviors: center content presence and text
- Uncovered or weakly covered behaviors: resize/reposition logic, multiple radial-series scenarios, cleanup paths
- Line coverage: 45% estimated
- Branch coverage: 35% estimated
- Confidence: medium
- Risk summary: center-content behavior is only lightly protected.

### Marker

- Source files reviewed: [packages/charts/src/chart-marker/chart-marker.component.ts](packages/charts/src/chart-marker/chart-marker.component.ts)
- Tests found: indirect coverage via [packages/charts/e2e/chart/line-chart.e2e.spec.ts](packages/charts/e2e/chart/line-chart.e2e.spec.ts) and [packages/charts/e2e/chart/spark-chart.e2e.spec.ts](packages/charts/e2e/chart/spark-chart.e2e.spec.ts)
- Covered behaviors: position and color updates through line and spark examples
- Uncovered or weakly covered behaviors: svg drawing branch, `maxSize` capping, async sizing via `getBBox()`, cleanup behavior
- Line coverage: 35% estimated
- Branch coverage: 25% estimated
- Confidence: medium
- Risk summary: marker behavior is public but mostly exercised indirectly.

### Chart Collection

- Source files reviewed: [packages/charts/src/chart-collection/public-api.ts](packages/charts/src/chart-collection/public-api.ts), [packages/charts/src/chart-collection/chart-collection.service.ts](packages/charts/src/chart-collection/chart-collection.service.ts)
- Tests found: indirect coverage via [packages/charts/e2e/chart/spark-chart.e2e.spec.ts](packages/charts/e2e/chart/spark-chart.e2e.spec.ts) and [packages/charts/e2e/chart/thresholds-summary.e2e.spec.ts](packages/charts/e2e/chart/thresholds-summary.e2e.spec.ts)
- Covered behaviors: shared hover/highlight outcomes across grouped charts
- Uncovered or weakly covered behaviors: rebroadcast loops, remove-on-destroy, id changes, error paths for unregistered charts
- Line coverage: 30% estimated
- Branch coverage: 25% estimated
- Confidence: low
- Risk summary: synchronization behavior works in examples but lacks direct contract coverage.

### Renderers - Line & Spark

- Source files reviewed: [packages/charts/src/renderers/line/public-api.ts](packages/charts/src/renderers/line/public-api.ts), [packages/charts/src/renderers/line/line-renderer.ts](packages/charts/src/renderers/line/line-renderer.ts), [packages/charts/src/core/chart-assists/spark-chart-assist.ts](packages/charts/src/core/chart-assists/spark-chart-assist.ts)
- Tests found: [packages/charts/e2e/chart/line-chart.e2e.spec.ts](packages/charts/e2e/chart/line-chart.e2e.spec.ts), [packages/charts/e2e/chart/spark-chart.e2e.spec.ts](packages/charts/e2e/chart/spark-chart.e2e.spec.ts), [packages/charts/e2e/chart/line-chart.visual.spec.ts](packages/charts/e2e/chart/line-chart.visual.spec.ts), [packages/charts/e2e/chart/spark-chart.visual.spec.ts](packages/charts/e2e/chart/spark-chart.visual.spec.ts)
- Covered behaviors: render counts, marker presence, color mapping, hover marker movement, spark legend sync, cross-chart highlight
- Uncovered or weakly covered behaviors: missing-data handling, infinite-line rendering, enabled zoom, stacked line scenarios
- Line coverage: 65% estimated
- Branch coverage: 55% estimated
- Confidence: medium
- Risk summary: this is one of the stronger renderer families, but non-default branches remain weak.

### Renderers - Bar / Status / TimeFrame / Waterfall

- Source files reviewed: [packages/charts/src/renderers/bar/public-api.ts](packages/charts/src/renderers/bar/public-api.ts), [packages/charts/src/renderers/bar/bar-renderer.ts](packages/charts/src/renderers/bar/bar-renderer.ts), [packages/charts/src/renderers/bar/accessors/status-accessors.ts](packages/charts/src/renderers/bar/accessors/status-accessors.ts)
- Tests found: [packages/charts/e2e/chart/status-chart.e2e.spec.ts](packages/charts/e2e/chart/status-chart.e2e.spec.ts), [packages/charts/e2e/chart/bar-chart.visual.spec.ts](packages/charts/e2e/chart/bar-chart.visual.spec.ts), [packages/charts/e2e/chart/bucketed-bar-chart.visual.spec.ts](packages/charts/e2e/chart/bucketed-bar-chart.visual.spec.ts), [packages/charts/e2e/chart/status-chart.visual.spec.ts](packages/charts/e2e/chart/status-chart.visual.spec.ts), [packages/charts/e2e/chart/time-frame-bar.visual.spec.ts](packages/charts/e2e/chart/time-frame-bar.visual.spec.ts), [packages/charts/e2e/chart/waterfall-chart.visual.spec.ts](packages/charts/e2e/chart/waterfall-chart.visual.spec.ts)
- Covered behaviors: status bar presence/count/opacity, hover deemphasis, icon visibility, visual baselines for other bar variants
- Uncovered or weakly covered behaviors: plain bar interaction, bucketed and waterfall behavior, timeframe undo/clear/change events, highlight strategy branches
- Line coverage: 40% estimated
- Branch coverage: 30% estimated
- Confidence: medium
- Risk summary: this family is broad, but only status-chart has meaningful functional depth.

### Renderers - Area

- Source files reviewed: [packages/charts/src/renderers/area/public-api.ts](packages/charts/src/renderers/area/public-api.ts), [packages/charts/src/renderers/area/area-renderer.ts](packages/charts/src/renderers/area/area-renderer.ts)
- Tests found: [packages/charts/e2e/chart/area-chart.visual.spec.ts](packages/charts/e2e/chart/area-chart.visual.spec.ts), [packages/charts/e2e/chart/area-stacked-two-directional-chart.visual.spec.ts](packages/charts/e2e/chart/area-stacked-two-directional-chart.visual.spec.ts)
- Covered behaviors: visual baselines only
- Uncovered or weakly covered behaviors: domains, stacking logic, highlight behavior, invalid-point handling, interaction behavior
- Line coverage: 20% estimated
- Branch coverage: 15% estimated
- Confidence: low
- Risk summary: publicly exported area renderer logic has almost no behavioral E2E protection.

### Renderers - Radial (Pie / Donut)

- Source files reviewed: [packages/charts/src/renderers/radial/public-api.ts](packages/charts/src/renderers/radial/public-api.ts), [packages/charts/src/renderers/radial/radial-renderer.ts](packages/charts/src/renderers/radial/radial-renderer.ts)
- Tests found: [packages/charts/e2e/chart/pie-chart.e2e.spec.ts](packages/charts/e2e/chart/pie-chart.e2e.spec.ts), [packages/charts/e2e/chart/donut-chart.e2e.spec.ts](packages/charts/e2e/chart/donut-chart.e2e.spec.ts), indirect visual support via [packages/charts/e2e/chart/tooltips.visual.spec.ts](packages/charts/e2e/chart/tooltips.visual.spec.ts) and [packages/charts/e2e/chart/popover.visual.spec.ts](packages/charts/e2e/chart/popover.visual.spec.ts)
- Covered behaviors: render visibility, active-segment highlight, inactive fade, donut content surface
- Uncovered or weakly covered behaviors: geometry assertions, event payloads, highlighting configuration branches, radius/thickness branches
- Line coverage: 55% estimated
- Branch coverage: 45% estimated
- Confidence: medium
- Risk summary: radial interactions are covered at a basic UX level, but much configuration logic is still weak.

### Core/Common technical exports

- Source files reviewed: [packages/charts/src/core/public-api.ts](packages/charts/src/core/public-api.ts), [packages/charts/src/core/common/public-api.ts](packages/charts/src/core/common/public-api.ts), [packages/charts/src/core/grid/public-api.ts](packages/charts/src/core/grid/public-api.ts), [packages/charts/src/core/plugins/public-api.ts](packages/charts/src/core/plugins/public-api.ts)
- Tests found: no dedicated component-owned E2E specs; only incidental exercise through chart-type specs
- Covered behaviors: render/update/plugin flows used by higher-level examples only
- Uncovered or weakly covered behaviors: event bus, scales/formatters, data manager, render engine, zoom plugin enabled path, grid variants, plugin lifecycle
- Line coverage: 15% estimated
- Branch coverage: 10% estimated
- Confidence: low
- Risk summary: this is a very large exported surface with almost no direct end-to-end accountability.

## Final findings

### Top 10 weakest-covered areas

1. Core/Common technical exports
2. Renderers - Area
3. Tooltips
4. Gauge
5. Popover
6. Chart Collection
7. Marker
8. Chart shell & assists
9. Renderers - Bar / Status / TimeFrame / Waterfall
10. Thresholds

### Areas with zero practical component-owned E2E coverage

- Gauge
- Tooltips
- Popover
- Renderers - Area
- Core/Common technical exports

### Areas with effectively no direct coverage

- Chart Collection
- Marker
- Donut Content
- Chart shell & assists

### Areas with only `visual` coverage but weak functional coverage

- Gauge
- Tooltips
- Popover
- Renderers - Area
- TimeFrame Bar and Waterfall within the bar family

### Recommended next tests to add, ranked by impact

1. Gauge functional coverage for `GaugeUtil` clamp, threshold activation, labels, and update paths
2. Tooltip functional coverage for collision avoidance, orientation, hidden-series filtering, and out-of-view hiding
3. Popover functional coverage for invalid-data close path, update emission, and coordinate correctness
4. TimeFrame Bar functional coverage for zoom, undo, clear, and change events
5. Area renderer functional coverage for stacking, highlight, and interaction paths
6. Chart Collection direct coverage for rebroadcast, destroy cleanup, and id-change behavior
7. Thresholds edge-case coverage for interval scales, side indicators, collisions, and dynamic zones
8. Radial renderer coverage for geometry and event payload branches
9. Legend keyboard and accessibility coverage
10. Chart shell lifecycle coverage for resize, rebuild, and in-view behavior

## Overall assessment

Strongest areas: Legend, Renderers - Line & Spark, Renderers - Radial (Pie / Donut), and parts of Thresholds.

Weakest areas: Core/Common technical exports, Renderers - Area, Tooltips, Gauge, Popover, and Chart Collection.

Main structural gap: Charts relies heavily on visual snapshots, while many exported areas still lack meaningful behavioral E2E depth and the package currently has no a11y coverage at all.
