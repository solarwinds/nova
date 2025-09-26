# Changelog

## [19.0.0] 📅 2025-09-26
### Added
- `@nova-ui/bits` | Added colorpicker

## [17.0.1] 📅 2025-07-31

### Added

- `@nova-ui/dashboards` | Added ability to globaly disable refreshers

## [17.0.0] 📅 2025-04-20
### Angular upgrade 17

## [16.0.9] 📅 2025-04-02
### Fixes
- `@nova-ui/dashboards` | Fix kpi scale for values
- `@nova-ui/dashboards` | Fix editor preview component
- `@nova-ui/dashboards` | Fix search addon listening chagnes

## [16.0.8] 📅 2025-04-02
### Fixes
- `@nova-ui/dashboards` | Fix selection config
- `@nova-ui/dashboards` | Added ability to listen preview component through the cloner

## [16.0.6] 📅 2025-03-12
### Added
- `@nova-ui/bits` | Added unit conversion for milliseconds

## [16.0.3] 📅 2025-02-14
### Added
- `@nova-ui/dasbhard` | Added table widget bus events for select items

### Bugfix
- `@nova-ui/dashboards` | Bug fix widget table with paginator, search with selection

## [16.0.2] 📅 2024-11-20

### Angular 16 update

### Bugfix
- `@nova-ui/bits` | fix memory leaks
- `@nova-ui/dashboards` | remove warnings in formatter for prod
- `@nova-ui/dashboards` | Bug fix widget table scroll type
- `@nova-ui/dashboards` | Bug fix wiget timeseries dark mode

## [15.0.10] 📅 2024-09-04

### Added

- `@nova-ui/bits` | Added `selectionConfig` input and made `selectable` deprecated in the table component.
- `@nova-ui/dashboards` | Added `selectionConfiguration` option to the table widget configuration.

## [15.0.9] 📅 2024-08-04

### Bugfix

-   `@nova-ui/dashboards` | Fix KPI widget empty state icon
-   `@nova-ui/bits` `@nova-ui/charts` `@nova-ui/dashboards` | Update vulnerable crypto-js
-   `@nova-ui/bits` `@nova-ui/charts` `@nova-ui/dashboards` | Fix nova-docs source code paths

## [15.0.8] 📅 2024-06-03

### Added

-   `@nova-ui/dashboards` | Paginator added for table widget.

### Bugfix

-   `@nova-ui/dashboards` | Added missing empty image for _nuiListWidgetComponent_ with no data.
-   `@nova-ui/dashboards` | Added missing empty image for all Empty widgets.

## [15.0.6] 📅 2024-05-13

### Bugfix

-   `@nova-ui/bits` | Properly show _niuMenuComponent_ popup when menu button is located at the bottom right corner of the viewport.

## [12.0.43] 📅 2023-04-09

### Added

-   `@nova-ui/bits` | _nuiTooltipEllipsis_ added input for tooltip. Used on overflowing text.

## [15.0.5] 📅 2024-03-18

-   `@nova-ui/bits` | _NUI-6198_ | Fix unwanted dialog dismiss when opened from `ngOnInit`

## [15.0.2] 📅 2023-08-24

-   `@nova-ui/bits` `@nova-ui/charts` `@nova-ui/dashboards` | Upgraded to Angular v15 (compatible with v16 apps)

## [13.0.1] 📅 2022-11-16

-   `@nova-ui/bits` `@nova-ui/charts` `@nova-ui/dashboards` | Upgraded to Angular v13 (compatible with v14 apps)

## [12.0.8] 📅 2022-07-27

### Bugfix

-   `@nova-ui/bits` | _unitConversionConstants_ fixed typo in Gbps (was Gpbs)

## [12.0.7] 📅 2022-06-30

### Added

-   `@nova-ui/bits` | _NUI-6180_ | _ToolbarComponent_ now has default message for state with no items (implemented using new **nui-toolbar-message** component which can also be used by consumers explicitly inside **nui-toolbar**)

### Bugfix

-   `@nova-ui/dashboards` | _DashboardUnitConversionPipe_ now takes unit type to determine nuit number base

## [12.0.6] 📅 2022-05-25

### Bugfix

-   `@nova-ui/dashboards` | Fixed bug, when "Explore this data" in the widget's header icon does not open a defined URL in some cases.

## [12.0.5] 📅 2022-05-04

### Bugfix

-   `@nova-ui/dashboards` | _NUI-6169_ | Fixed url interaction handler provider

## [12.0.4] 📅 2022-04-29

### Added

-   `@nova-ui/bits` | _NUI-6163_ | Added _preventRowClick_ flag on **nui-repeater** (to be used when items contain clickable content)

</details>

## [12.0.3] 📅 2022-04-14

### Bugfix

-   `@nova-ui/dashboards` | _NUI-6169_ | Usage of lodash template, which is considered unsafe by 'Content Security Policy' and the evaluation of template is blocked by browser, was replaced with safer (explicit) property evaluation.

## [12.0.2] 📅 2022-03-29

### Bugfix

-   `@nova-ui/bits` | _NUI-431_ | Properly show tooltip on hover in overlapping scrollable container.

## [12.0.1] 📅 2022-03-14

### Bugfix

-   `@nova-ui/bits` | _NUI-426_ | Properly update _pageSize_ in **nui-paginator** on input change.

## [12.0.0] 📅 2022-02-22

### Upgrade

-   `@nova-ui/bits` `@nova-ui/charts` `@nova-ui/dashboards` | Upgraded to Angular v12 (compatible with v13 apps)
