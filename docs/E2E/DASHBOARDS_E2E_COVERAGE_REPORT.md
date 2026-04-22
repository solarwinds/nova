# Dashboards E2E Coverage Report

Generated from repository contents on 2026-04-22.

## Method notes

- Public API scope was traced from [packages/dashboards/src/public-api.ts](packages/dashboards/src/public-api.ts) and the area exports under [packages/dashboards/src](packages/dashboards/src).
- Playwright project types are defined in [playwright.config.base.ts](playwright.config.base.ts): `e2e`, `a11y`, and `visual`.
- E2E source was reviewed under [packages/dashboards/e2e](packages/dashboards/e2e).
- Current Dashboards Playwright inventory contains 2 `e2e` spec files, 0 `a11y` spec files, 7 `visual` spec files, and 9 atom helper files.
- [packages/dashboards/e2e/table-widget.e2e.ts](packages/dashboards/e2e/table-widget.e2e.ts) is a legacy Protractor-style file and was not counted in current Playwright totals.
- No usable Dashboards inventory or E2E instrumentation artifacts were found, so all percentages below are **estimated** from source-to-test behavior mapping.
- Dashboards is covered much more heavily by visual snapshots than by behavioral E2E, and it currently has no a11y suite at all.

## Naming mismatches

- `time-series-widget.visual.spec.ts` ↔ `timeseries-widget` public area
- `overview.visual.spec.ts` ↔ dashboard shell / layout coverage rather than a single `overview` public API area
- `kpi-widget.visual.spec.ts` and `kpi-error.visual.spec.ts` ↔ `kpi.component` public export area
- `drilldown.visual.spec.ts` ↔ split ownership across list-widget and configurator drilldown exports rather than a top-level `drilldown` public API
- `table-widget.e2e.ts` ↔ legacy non-Playwright file beside `table-widget.e2e.spec.ts`

## Executive summary

| Component/Area                                        |                     E2E specs | A11y specs |         Visual specs | Line coverage % | Branch coverage % | Confidence | Status               | Main gap                                                                                               |
| ----------------------------------------------------- | ----------------------------: | ---------: | -------------------: | --------------: | ----------------: | ---------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| Dashboard shell / layouts                             |          0 direct; 2 indirect |          0 |             1 direct |              15 |                10 | medium     | partial E2E coverage | Reorder, lazy-load, resize, and layout reflow are effectively unowned                                  |
| Widget base / common / header / search                |          0 direct; 2 indirect |          0 |           1 indirect |              20 |                15 | medium     | partial E2E coverage | Remove, reload, collapse, link, and search behavior are largely untested                               |
| Table Widget                                          |                             1 |          0 |                    1 |              25 |                20 | high       | partial E2E coverage | Runtime table behavior is far broader than current configurator-focused tests                          |
| Timeseries Widget                                     | 1 active file; 1 skipped case |          0 |                    1 |              30 |                20 | medium     | partial E2E coverage | Zoom, inspection menu, presets, and transformer correctness are weakly owned                           |
| Proportional Widget                                   |                             0 |          0 |                    1 |              15 |                10 | low        | no E2E coverage      | Visual-only; interaction, color, and layout-switch logic are unasserted                                |
| KPI Widget                                            |                             0 |          0 |                    2 |              20 |                15 | low        | no E2E coverage      | Visual-only; formatter, interaction, busy, and empty-state branches are untested                       |
| Risk Score Tile                                       |                             0 |          0 |                    0 |               0 |                 0 | low        | no E2E coverage      | Completely untested                                                                                    |
| List Widget / Drilldown                               |                             0 |          0 |                    1 |              15 |                10 | medium     | no E2E coverage      | Only a visual drill step exists; search, back/home, and event semantics are uncovered                  |
| Time Frame Selection                                  |                             0 |          0 |                    0 |               0 |                 0 | low        | no E2E coverage      | Set/undo/clear/history and data-source filter registration are untested                                |
| Configurator / Wizard                                 |                      1 direct |          0 | 2 direct; 1 indirect |              30 |                25 | medium     | partial E2E coverage | Huge exported surface is represented mostly by table edit flows and KPI error snapshots                |
| Loading / Errors / Embedded Content                   |                             0 |          0 |           1 indirect |              10 |                 5 | low        | no E2E coverage      | Sanitization, loading, fallback, and widget error presentation lack owned tests                        |
| Pizzagna / Widget Types / Directives                  |          0 direct; 2 indirect |          0 |           2 indirect |              15 |                10 | low        | partial E2E coverage | Dynamic composition and registry contracts are exercised only incidentally                             |
| Services / Providers / Common / Functions / Constants |          0 direct; 2 indirect |          0 |           2 indirect |              10 |                 5 | low        | no E2E coverage      | Exported registries, adapters, handlers, and helpers have almost no component-owned E2E accountability |

## Per-area reports

### Dashboard shell / layouts

- Source files reviewed: [packages/dashboards/src/lib/components/dashboard/public-api.ts](packages/dashboards/src/lib/components/dashboard/public-api.ts), [packages/dashboards/src/lib/components/dashboard/dashboard.component.ts](packages/dashboards/src/lib/components/dashboard/dashboard.component.ts), [packages/dashboards/src/lib/components/layouts/public-api.ts](packages/dashboards/src/lib/components/layouts/public-api.ts), [packages/dashboards/src/lib/components/layouts/base-layout.ts](packages/dashboards/src/lib/components/layouts/base-layout.ts), [packages/dashboards/src/lib/components/layouts/stack/stack.component.ts](packages/dashboards/src/lib/components/layouts/stack/stack.component.ts), [packages/dashboards/src/lib/components/layouts/tiles/tiles.component.ts](packages/dashboards/src/lib/components/layouts/tiles/tiles.component.ts)
- Tests found: direct visual [packages/dashboards/e2e/overview.visual.spec.ts](packages/dashboards/e2e/overview.visual.spec.ts); indirect behavioral use from [packages/dashboards/e2e/table-widget.e2e.spec.ts](packages/dashboards/e2e/table-widget.e2e.spec.ts) and [packages/dashboards/e2e/timeseries-widget.e2e.spec.ts](packages/dashboards/e2e/timeseries-widget.e2e.spec.ts)
- Covered behaviors: edit mode can be toggled visually; widgets can be hovered and located inside the dashboard shell; dark-theme snapshot exists
- Uncovered or weakly covered behaviors: gridster drag/resize callbacks, `dashboardChange`, `WIDGET_RESIZE`, `WIDGET_POSITION_CHANGE`, below-fold lazy loading, `TilesComponent` resize ratio switching, `StackComponent` directional layout changes
- Line coverage: 15% estimated
- Branch coverage: 10% estimated
- Confidence: medium
- Risk summary: shell regressions can break many widgets at once while escaping current suites.

### Widget base / common / header / search

- Source files reviewed: [packages/dashboards/src/lib/components/widget/public-api.ts](packages/dashboards/src/lib/components/widget/public-api.ts), [packages/dashboards/src/lib/components/widget/widget.component.ts](packages/dashboards/src/lib/components/widget/widget.component.ts), [packages/dashboards/src/lib/components/widget/widget-header/widget-header.component.ts](packages/dashboards/src/lib/components/widget/widget-header/widget-header.component.ts), [packages/dashboards/src/lib/components/widget-search/widget-search.component.ts](packages/dashboards/src/lib/components/widget-search/widget-search.component.ts)
- Tests found: indirect coverage from [packages/dashboards/e2e/table-widget.e2e.spec.ts](packages/dashboards/e2e/table-widget.e2e.spec.ts), [packages/dashboards/e2e/table-widget.visual.spec.ts](packages/dashboards/e2e/table-widget.visual.spec.ts), and [packages/dashboards/e2e/overview.visual.spec.ts](packages/dashboards/e2e/overview.visual.spec.ts)
- Covered behaviors: widget lookup by header title, edit-button path, basic hover states in edit mode
- Uncovered or weakly covered behaviors: remove button, reload button, collapse state, custom header content detection, header link preparation, `WidgetSearchComponent` debounce / keyup modes / refresh emission, widget type root switching edge cases
- Line coverage: 20% estimated
- Branch coverage: 15% estimated
- Confidence: medium
- Risk summary: common widget controls look present but their real contracts are mostly unverified.

### Table Widget

- Source files reviewed: [packages/dashboards/src/lib/components/table-widget/public-api.ts](packages/dashboards/src/lib/components/table-widget/public-api.ts), [packages/dashboards/src/lib/components/table-widget/table-widget.component.ts](packages/dashboards/src/lib/components/table-widget/table-widget.component.ts), [packages/dashboards/src/lib/configurator/components/widgets/table/public-api.ts](packages/dashboards/src/lib/configurator/components/widgets/table/public-api.ts), [packages/dashboards/src/lib/configurator/components/widgets/configurator-items/data-source-configuration.component.ts](packages/dashboards/src/lib/configurator/components/widgets/configurator-items/data-source-configuration.component.ts), [packages/dashboards/src/lib/configurator/components/widgets/configurator-items/data-source-configuration-v2/data-source-configuration-v2.component.ts](packages/dashboards/src/lib/configurator/components/widgets/configurator-items/data-source-configuration-v2/data-source-configuration-v2.component.ts), [packages/dashboards/src/lib/configurator/components/widgets/table/columns-editor-v2/table-columns-configuration-v2.component.ts](packages/dashboards/src/lib/configurator/components/widgets/table/columns-editor-v2/table-columns-configuration-v2.component.ts)
- Tests found: [packages/dashboards/e2e/table-widget.e2e.spec.ts](packages/dashboards/e2e/table-widget.e2e.spec.ts), [packages/dashboards/e2e/table-widget.visual.spec.ts](packages/dashboards/e2e/table-widget.visual.spec.ts); legacy non-Playwright reference: [packages/dashboards/e2e/table-widget.e2e.ts](packages/dashboards/e2e/table-widget.e2e.ts)
- Covered behaviors: table configurator auto-generates columns for empty widgets with a data source; changing data source without reset preserves prior column state; reset-columns confirmation rebuilds default columns; column-width preview is snapshotted before and after submit
- Uncovered or weakly covered behaviors: runtime sorting, selection, row interactivity, ignored selectors, search limit warning, paginator flow, virtual scroll, `WIDGET_READY`, `SET_NEXT_PAGE`, resize handling, formatter alignment, fallback/error behavior on live data
- Line coverage: 25% estimated
- Branch coverage: 20% estimated
- Confidence: high
- Risk summary: the exported table surface is large, but current Playwright ownership is concentrated in one narrow configurator scenario.

### Timeseries Widget

- Source files reviewed: [packages/dashboards/src/lib/components/timeseries-widget/public-api.ts](packages/dashboards/src/lib/components/timeseries-widget/public-api.ts), [packages/dashboards/src/lib/components/timeseries-widget/timeseries-widget.component.ts](packages/dashboards/src/lib/components/timeseries-widget/timeseries-widget.component.ts), [packages/dashboards/src/lib/components/timeseries-widget/chart-presets/public-api.ts](packages/dashboards/src/lib/components/timeseries-widget/chart-presets/public-api.ts), [packages/dashboards/src/lib/components/timeseries-widget/timeseries-chart-preset.service.ts](packages/dashboards/src/lib/components/timeseries-widget/timeseries-chart-preset.service.ts), [packages/dashboards/src/lib/components/timeseries-widget/timeseries-inspection-menu/timeseries-inspection-menu.component.ts](packages/dashboards/src/lib/components/timeseries-widget/timeseries-inspection-menu/timeseries-inspection-menu.component.ts), [packages/dashboards/src/lib/components/timeseries-widget/transformer/public-api.ts](packages/dashboards/src/lib/components/timeseries-widget/transformer/public-api.ts)
- Tests found: [packages/dashboards/e2e/timeseries-widget.e2e.spec.ts](packages/dashboards/e2e/timeseries-widget.e2e.spec.ts), [packages/dashboards/e2e/time-series-widget.visual.spec.ts](packages/dashboards/e2e/time-series-widget.visual.spec.ts); skipped case at [packages/dashboards/e2e/timeseries-widget.e2e.spec.ts](packages/dashboards/e2e/timeseries-widget.e2e.spec.ts#L80)
- Covered behaviors: legend menu button appears for line/status-line charts but not area/bar/status-bar charts; transform icon appears and disappears for selected transforms; hover snapshot exists for a time-interval bar example
- Uncovered or weakly covered behaviors: actual transform-menu contents remain skipped, zoom plugin behavior, inspection-menu zoom/explore/sync/clear events, preset switching, `allowPopover`, empty-state handling, chart render correctness, public transformer algorithm contracts
- Line coverage: 30% estimated
- Branch coverage: 20% estimated
- Confidence: medium
- Risk summary: major timeseries functionality is public, but current E2E mostly checks legend affordances rather than chart behavior.

### Proportional Widget

- Source files reviewed: [packages/dashboards/src/lib/components/proportional-widget/public-api.ts](packages/dashboards/src/lib/components/proportional-widget/public-api.ts), [packages/dashboards/src/lib/components/proportional-widget/proportional-widget.component.ts](packages/dashboards/src/lib/components/proportional-widget/proportional-widget.component.ts), [packages/dashboards/src/lib/configurator/components/widgets/proportional/public-api.ts](packages/dashboards/src/lib/configurator/components/widgets/proportional/public-api.ts)
- Tests found: [packages/dashboards/e2e/proportional-widget.visual.spec.ts](packages/dashboards/e2e/proportional-widget.visual.spec.ts)
- Covered behaviors: default appearance; legend-hover visual state
- Uncovered or weakly covered behaviors: click interaction, `INTERACTION` event emission, donut content plugin behavior, legend placement rules, responsive grid switching, chart-type branching, data-driven vs configured color providers, empty state
- Line coverage: 15% estimated
- Branch coverage: 10% estimated
- Confidence: low
- Risk summary: proportional widgets are effectively visual-only in E2E and can regress functionally without detection.

### KPI Widget

- Source files reviewed: [packages/dashboards/src/lib/components/kpi-widget/public-api.ts](packages/dashboards/src/lib/components/kpi-widget/public-api.ts), [packages/dashboards/src/lib/components/kpi-widget/kpi.component.ts](packages/dashboards/src/lib/components/kpi-widget/kpi.component.ts), [packages/dashboards/src/lib/configurator/components/widgets/kpi/public-api.ts](packages/dashboards/src/lib/configurator/components/widgets/kpi/public-api.ts), [packages/dashboards/src/lib/configurator/components/widgets/configurator-items/data-source-error/data-source-error.component.ts](packages/dashboards/src/lib/configurator/components/widgets/configurator-items/data-source-error/data-source-error.component.ts)
- Tests found: [packages/dashboards/e2e/kpi-widget.visual.spec.ts](packages/dashboards/e2e/kpi-widget.visual.spec.ts), [packages/dashboards/e2e/kpi-error.visual.spec.ts](packages/dashboards/e2e/kpi-error.visual.spec.ts)
- Covered behaviors: default KPI look; configurator snapshots for multiple data-source error/no-error states
- Uncovered or weakly covered behaviors: `INTERACTION` emission, `showEmpty`, boolean/array/zero-value branches, busy state, formatter-property mapping, scale broker lookup, background-color behavior, submit validation
- Line coverage: 20% estimated
- Branch coverage: 15% estimated
- Confidence: low
- Risk summary: KPI coverage is snapshot-heavy and does not materially protect interaction or formatter logic.

### Risk Score Tile

- Source files reviewed: [packages/dashboards/src/lib/components/risk-score-tile/public-api.ts](packages/dashboards/src/lib/components/risk-score-tile/public-api.ts), [packages/dashboards/src/lib/components/risk-score-tile/risk-score-tile.component.ts](packages/dashboards/src/lib/components/risk-score-tile/risk-score-tile.component.ts), [packages/dashboards/src/lib/configurator/components/widgets/risk-score/public-api.ts](packages/dashboards/src/lib/configurator/components/widgets/risk-score/public-api.ts)
- Tests found: none
- Covered behaviors: none
- Uncovered or weakly covered behaviors: all public behavior, including formatter-property mapping, interaction gating, busy state, broker lookup, and configurator-owned risk-score settings
- Line coverage: 0% estimated
- Branch coverage: 0% estimated
- Confidence: low
- Risk summary: the Risk Score public area currently has no practical E2E ownership.

### List Widget / Drilldown

- Source files reviewed: [packages/dashboards/src/lib/components/list-widget/public-api.ts](packages/dashboards/src/lib/components/list-widget/public-api.ts), [packages/dashboards/src/lib/components/list-widget/list-widget.component.ts](packages/dashboards/src/lib/components/list-widget/list-widget.component.ts), [packages/dashboards/src/lib/components/list-widget/list-elements/list-group-item/list-group-item.component.ts](packages/dashboards/src/lib/components/list-widget/list-elements/list-group-item/list-group-item.component.ts), [packages/dashboards/src/lib/components/list-widget/list-elements/list-leaf-item/list-leaf-item.component.ts](packages/dashboards/src/lib/components/list-widget/list-elements/list-leaf-item/list-leaf-item.component.ts), [packages/dashboards/src/lib/components/list-widget/list-elements/list-navigation-bar/list-navigation-bar.component.ts](packages/dashboards/src/lib/components/list-widget/list-elements/list-navigation-bar/list-navigation-bar.component.ts), [packages/dashboards/src/lib/configurator/components/widgets/drilldown/public-api.ts](packages/dashboards/src/lib/configurator/components/widgets/drilldown/public-api.ts), [packages/dashboards/src/lib/configurator/components/widgets/drilldown/grouping-configuration/grouping-configuration.component.ts](packages/dashboards/src/lib/configurator/components/widgets/drilldown/grouping-configuration/grouping-configuration.component.ts), [packages/dashboards/src/lib/configurator/components/widgets/drilldown/entity-formatting-configuration/entity-formatting-configuration.component.ts](packages/dashboards/src/lib/configurator/components/widgets/drilldown/entity-formatting-configuration/entity-formatting-configuration.component.ts)
- Tests found: [packages/dashboards/e2e/drilldown.visual.spec.ts](packages/dashboards/e2e/drilldown.visual.spec.ts)
- Covered behaviors: default drilldown snapshot; one click into the first group with a leaf-state snapshot
- Uncovered or weakly covered behaviors: `DRILLDOWN` event semantics, back/home navigation, list search highlighting through `WIDGET_SEARCH`, responsive width states, empty-state behavior, grouping-form logic, entity field mapping validation
- Line coverage: 15% estimated
- Branch coverage: 10% estimated
- Confidence: medium
- Risk summary: drilldown/list ownership is shallow and mostly visual despite a public surface spanning both list runtime and configurator setup.

### Time Frame Selection

- Source files reviewed: [packages/dashboards/src/lib/components/time-frame-selection/public-api.ts](packages/dashboards/src/lib/components/time-frame-selection/public-api.ts), [packages/dashboards/src/lib/components/time-frame-selection/timeframe-selection.component.ts](packages/dashboards/src/lib/components/time-frame-selection/timeframe-selection.component.ts)
- Tests found: none
- Covered behaviors: none
- Uncovered or weakly covered behaviors: serializable-timeframe reconciliation, `SET_TIMEFRAME` event handling, `REFRESH` emission, `HistoryStorage` undo/clear/restart flows, min/max parsing, data-source filter registration
- Line coverage: 0% estimated
- Branch coverage: 0% estimated
- Confidence: low
- Risk summary: timeframe selection is exported but currently has no E2E accountability.

### Configurator / Wizard

- Source files reviewed: [packages/dashboards/src/lib/configurator/public-api.ts](packages/dashboards/src/lib/configurator/public-api.ts), [packages/dashboards/src/lib/configurator/components/public-api.ts](packages/dashboards/src/lib/configurator/components/public-api.ts), [packages/dashboards/src/lib/configurator/components/configurator/configurator.component.ts](packages/dashboards/src/lib/configurator/components/configurator/configurator.component.ts), [packages/dashboards/src/lib/configurator/services/configurator.service.ts](packages/dashboards/src/lib/configurator/services/configurator.service.ts), [packages/dashboards/src/lib/configurator/components/widgets/public-api.ts](packages/dashboards/src/lib/configurator/components/widgets/public-api.ts), [packages/dashboards/src/lib/configurator/components/wizard/dashwiz/public-api.ts](packages/dashboards/src/lib/configurator/components/wizard/dashwiz/public-api.ts), [packages/dashboards/src/lib/configurator/components/wizard/dashwiz-step/public-api.ts](packages/dashboards/src/lib/configurator/components/wizard/dashwiz-step/public-api.ts), [packages/dashboards/src/lib/directives/widget-editor/widget-editor.directive.ts](packages/dashboards/src/lib/directives/widget-editor/widget-editor.directive.ts)
- Tests found: direct behavioral coverage from [packages/dashboards/e2e/table-widget.e2e.spec.ts](packages/dashboards/e2e/table-widget.e2e.spec.ts); direct visual coverage from [packages/dashboards/e2e/table-widget.visual.spec.ts](packages/dashboards/e2e/table-widget.visual.spec.ts) and [packages/dashboards/e2e/kpi-error.visual.spec.ts](packages/dashboards/e2e/kpi-error.visual.spec.ts); indirect shell coverage from [packages/dashboards/e2e/overview.visual.spec.ts](packages/dashboards/e2e/overview.visual.spec.ts)
- Covered behaviors: edit mode opens configurator; table data-source switching and reset-columns flow; finish button closes configurator; KPI data-source error states are snapshotted
- Uncovered or weakly covered behaviors: cancel path, submit error recovery, route-close behavior, widget creation/cloning, most widget-specific editors, wizard-step validation/icon states, preview overlay behavior, remove-widget directive path
- Line coverage: 30% estimated
- Branch coverage: 25% estimated
- Confidence: medium
- Risk summary: configurator ownership is broader than any single widget, but current tests represent only a small subset of that exported surface.

### Loading / Errors / Embedded Content

- Source files reviewed: [packages/dashboards/src/lib/components/loading/public-api.ts](packages/dashboards/src/lib/components/loading/public-api.ts), [packages/dashboards/src/lib/components/loading/loading.component.ts](packages/dashboards/src/lib/components/loading/loading.component.ts), [packages/dashboards/src/lib/components/template-load-error/public-api.ts](packages/dashboards/src/lib/components/template-load-error/public-api.ts), [packages/dashboards/src/lib/components/template-load-error/template-load-error.component.ts](packages/dashboards/src/lib/components/template-load-error/template-load-error.component.ts), [packages/dashboards/src/lib/components/embedded-content/embedded-content.component.ts](packages/dashboards/src/lib/components/embedded-content/embedded-content.component.ts), [packages/dashboards/src/lib/common/components/widget-error/widget-error.component.ts](packages/dashboards/src/lib/common/components/widget-error/widget-error.component.ts), [packages/dashboards/src/lib/configurator/components/widgets/configurator-items/data-source-error/data-source-error.component.ts](packages/dashboards/src/lib/configurator/components/widgets/configurator-items/data-source-error/data-source-error.component.ts)
- Tests found: indirect visual evidence from [packages/dashboards/e2e/kpi-error.visual.spec.ts](packages/dashboards/e2e/kpi-error.visual.spec.ts)
- Covered behaviors: KPI configurator surfaces several error-state visuals
- Uncovered or weakly covered behaviors: `LoadingComponent` active/inactive animation, `EmbeddedContentComponent` URL-vs-HTML mode and sanitization branches, template-load fallback, widget-error rendering variants, data-source busy vs error vs raw-output permutations
- Line coverage: 10% estimated
- Branch coverage: 5% estimated
- Confidence: low
- Risk summary: several exported fallback and embed surfaces are practically unprotected.

### Pizzagna / Widget Types / Directives

- Source files reviewed: [packages/dashboards/src/lib/pizzagna/public-api.ts](packages/dashboards/src/lib/pizzagna/public-api.ts), [packages/dashboards/src/lib/pizzagna/components/pizzagna/public-api.ts](packages/dashboards/src/lib/pizzagna/components/pizzagna/public-api.ts), [packages/dashboards/src/lib/pizzagna/services/pizzagna.service.ts](packages/dashboards/src/lib/pizzagna/services/pizzagna.service.ts), [packages/dashboards/src/lib/pizzagna/components/pizzagna/pizzagna.component.ts](packages/dashboards/src/lib/pizzagna/components/pizzagna/pizzagna.component.ts), [packages/dashboards/src/lib/widget-types/public-api.ts](packages/dashboards/src/lib/widget-types/public-api.ts), [packages/dashboards/src/lib/widget-types/common/public-api.ts](packages/dashboards/src/lib/widget-types/common/public-api.ts), [packages/dashboards/src/lib/directives/public-api.ts](packages/dashboards/src/lib/directives/public-api.ts), [packages/dashboards/src/lib/directives/widget-editor/widget-editor.directive.ts](packages/dashboards/src/lib/directives/widget-editor/widget-editor.directive.ts)
- Tests found: only incidental runtime exercise through [packages/dashboards/e2e/table-widget.e2e.spec.ts](packages/dashboards/e2e/table-widget.e2e.spec.ts), [packages/dashboards/e2e/timeseries-widget.e2e.spec.ts](packages/dashboards/e2e/timeseries-widget.e2e.spec.ts), and related visual suites
- Covered behaviors: widgets render through the composition stack; edit entry path reaches the directive-driven configurator flow
- Uncovered or weakly covered behaviors: layer merge semantics, `SET_PROPERTY_VALUE`, component creation/removal, widget type registration/version selection, event proxy stream registration, remove-widget flow, dynamic portal behavior
- Line coverage: 15% estimated
- Branch coverage: 10% estimated
- Confidence: low
- Risk summary: core dynamic-composition machinery is public and central, but it has no component-owned E2E contract.

### Services / Providers / Common / Functions / Constants

- Source files reviewed: [packages/dashboards/src/lib/services/public-api.ts](packages/dashboards/src/lib/services/public-api.ts), [packages/dashboards/src/lib/services/widget-to-dashboard-event-proxy.service.ts](packages/dashboards/src/lib/services/widget-to-dashboard-event-proxy.service.ts), [packages/dashboards/src/lib/components/providers/public-api.ts](packages/dashboards/src/lib/components/providers/public-api.ts), [packages/dashboards/src/lib/common/public-api.ts](packages/dashboards/src/lib/common/public-api.ts), [packages/dashboards/src/lib/functions/public-api.ts](packages/dashboards/src/lib/functions/public-api.ts), [packages/dashboards/src/lib/constants/public-api.ts](packages/dashboards/src/lib/constants/public-api.ts)
- Tests found: only indirect exercise through table, timeseries, KPI, proportional, and overview example specs
- Covered behaviors: some provider/data-source paths are touched when examples load and when table/KPI configurators invoke data sources
- Uncovered or weakly covered behaviors: registries, formatter services, URL interaction handlers, refreshers, event registry, proportional aggregators, default palette, common pipe/function exports, service error paths
- Line coverage: 10% estimated
- Branch coverage: 5% estimated
- Confidence: low
- Risk summary: a large exported technical surface is effectively carried by incidental usage rather than owned E2E tests.

## Final findings

### Strongest areas

1. Table Widget
2. Timeseries Widget
3. Configurator / Wizard

Even these are only partially covered, and all three are materially narrower than their public APIs.

### Top weakest-covered areas

1. Risk Score Tile
2. Time Frame Selection
3. Loading / Errors / Embedded Content
4. Services / Providers / Common / Functions / Constants
5. Proportional Widget
6. List Widget / Drilldown
7. Dashboard shell / layouts
8. Pizzagna / Widget Types / Directives

### Zero-coverage areas

- Risk Score Tile
- Time Frame Selection

### Exported public subareas with little or no effective E2E ownership

- [packages/dashboards/src/lib/components/embedded-content/embedded-content.component.ts](packages/dashboards/src/lib/components/embedded-content/embedded-content.component.ts)
- [packages/dashboards/src/lib/components/loading/loading.component.ts](packages/dashboards/src/lib/components/loading/loading.component.ts)
- [packages/dashboards/src/lib/components/template-load-error/template-load-error.component.ts](packages/dashboards/src/lib/components/template-load-error/template-load-error.component.ts)
- [packages/dashboards/src/lib/components/widget-search/widget-search.component.ts](packages/dashboards/src/lib/components/widget-search/widget-search.component.ts)
- [packages/dashboards/src/lib/components/risk-score-tile/risk-score-tile.component.ts](packages/dashboards/src/lib/components/risk-score-tile/risk-score-tile.component.ts)
- [packages/dashboards/src/lib/components/time-frame-selection/timeframe-selection.component.ts](packages/dashboards/src/lib/components/time-frame-selection/timeframe-selection.component.ts)

### Only-visual areas

- Proportional Widget
- KPI Widget
- List Widget / Drilldown

### Only-a11y areas

- None
- Dashboards currently has no `a11y` spec files under [packages/dashboards/e2e](packages/dashboards/e2e)

### Ranked next tests to add

1. Table runtime behavior: sorting, search, selection, paginator, virtual scroll, and row interaction in [packages/dashboards/src/lib/components/table-widget/table-widget.component.ts](packages/dashboards/src/lib/components/table-widget/table-widget.component.ts)
2. Timeseries inspection and zoom menu behavior in [packages/dashboards/src/lib/components/timeseries-widget/timeseries-inspection-menu/timeseries-inspection-menu.component.ts](packages/dashboards/src/lib/components/timeseries-widget/timeseries-inspection-menu/timeseries-inspection-menu.component.ts)
3. Dashboard shell resize / reorder / below-fold lazy-loading in [packages/dashboards/src/lib/components/dashboard/dashboard.component.ts](packages/dashboards/src/lib/components/dashboard/dashboard.component.ts)
4. Time Frame Selection set / undo / clear / refresh behavior in [packages/dashboards/src/lib/components/time-frame-selection/timeframe-selection.component.ts](packages/dashboards/src/lib/components/time-frame-selection/timeframe-selection.component.ts)
5. Risk Score Tile functional coverage in [packages/dashboards/src/lib/components/risk-score-tile/risk-score-tile.component.ts](packages/dashboards/src/lib/components/risk-score-tile/risk-score-tile.component.ts)
6. Proportional interaction, donut content, and responsive layout switching in [packages/dashboards/src/lib/components/proportional-widget/proportional-widget.component.ts](packages/dashboards/src/lib/components/proportional-widget/proportional-widget.component.ts)
7. Configurator cancel, submit-error, route-close, and remove-widget flows in [packages/dashboards/src/lib/configurator/services/configurator.service.ts](packages/dashboards/src/lib/configurator/services/configurator.service.ts) and [packages/dashboards/src/lib/directives/widget-editor/widget-editor.directive.ts](packages/dashboards/src/lib/directives/widget-editor/widget-editor.directive.ts)
8. List/drilldown search, back/home, and event semantics in [packages/dashboards/src/lib/components/list-widget/list-widget.component.ts](packages/dashboards/src/lib/components/list-widget/list-widget.component.ts) and [packages/dashboards/src/lib/components/list-widget/list-elements/list-navigation-bar/list-navigation-bar.component.ts](packages/dashboards/src/lib/components/list-widget/list-elements/list-navigation-bar/list-navigation-bar.component.ts)
9. Embedded content and loading/error fallback behavior in [packages/dashboards/src/lib/components/embedded-content/embedded-content.component.ts](packages/dashboards/src/lib/components/embedded-content/embedded-content.component.ts) and [packages/dashboards/src/lib/common/components/widget-error/widget-error.component.ts](packages/dashboards/src/lib/common/components/widget-error/widget-error.component.ts)
10. Direct Pizzagna / widget-type / event-proxy contract coverage in [packages/dashboards/src/lib/pizzagna/services/pizzagna.service.ts](packages/dashboards/src/lib/pizzagna/services/pizzagna.service.ts), [packages/dashboards/src/lib/pizzagna/components/pizzagna/pizzagna.component.ts](packages/dashboards/src/lib/pizzagna/components/pizzagna/pizzagna.component.ts), and [packages/dashboards/src/lib/services/widget-to-dashboard-event-proxy.service.ts](packages/dashboards/src/lib/services/widget-to-dashboard-event-proxy.service.ts)

## Overall assessment

Dashboards is not broadly behavior-covered. The package has a thin behavioral E2E layer focused on table configurator and a few timeseries legend actions, no a11y suite, and a much larger set of visual snapshots. The strongest evidence is visual correctness; the weakest point is functional ownership of exported runtime infrastructure and secondary widget families.
