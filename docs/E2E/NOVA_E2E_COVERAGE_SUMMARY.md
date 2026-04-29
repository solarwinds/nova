# Nova E2E Coverage Summary

Numeric summary of the existing Bits, Charts, and Dashboards package coverage reports.

Collected from package reports only. No fresh analysis.

## Executive Numbers

| Package    | Coverage type | A11y        | Total areas | Broad | Partial | No E2E | Zero coverage | Effective no direct | Visual-only | Next tests |
| ---------- | ------------- | ----------- | ----------: | ----: | ------: | -----: | ------------: | ------------------: | ----------: | ---------: |
| Bits       | estimated     | mixed       |          52 |    15 |      30 |      7 |             3 |                   5 |           0 |         10 |
| Charts     | estimated     | none stated |          14 |     2 |       7 |      5 |             5 |                   4 |           6 |         10 |
| Dashboards | estimated     | none stated |          13 |     0 |       6 |      7 |             2 |                   6 |           3 |         10 |

## Package Snapshot

| Package    | Strongest areas | Weakest areas | Short read                                                                                      |
| ---------- | --------------: | ------------: | ----------------------------------------------------------------------------------------------- |
| Bits       |               6 |             8 | Broadest behavioral package, but 7 areas still have no E2E and 5 more have no direct ownership. |
| Charts     |               4 |             8 | Visual-heavy package: 5 zero-coverage areas, 6 visual-only areas, and no a11y suite stated.     |
| Dashboards |               3 |             8 | Thinnest behavioral package: 0 broad areas, 7 with no E2E, and no a11y suite stated.            |

## Top Gaps

- Bits: Color Picker, Risk Score, Toast, Select (legacy), Tooltip, Validation Message, DragDrop / DnD, Overlay
- Charts: Gauge, Tooltips, Popover, Renderers - Area, Core/Common exports, Chart Collection, Chart shell & assists
- Dashboards: Risk Score Tile, Time Frame Selection, Embedded Content, Loading, Template Load Error, Widget Search

## Top Next Actions

- Bits: direct coverage for the 3 zero-coverage areas and 5 more with no direct ownership.
- Charts: functional coverage for Gauge, Tooltips, Popover, Area, Thresholds edge cases, and chart shell lifecycle.
- Dashboards: runtime table and timeseries behavior, dashboard shell flows, Time Frame Selection, Risk Score Tile, and configurator or composition contracts.

## Cross-Package Summary

- Packages with no a11y coverage stated: 2 of 3.
- Packages where visual evidence outweighs behavioral depth: 2 of 3.
- Bits has the widest behavioral spread: 15 broad areas out of 52.
- Charts has the highest visual-only concentration: 6 of 14 areas.
- Dashboards has the weakest broad coverage: 0 broad areas out of 13.
