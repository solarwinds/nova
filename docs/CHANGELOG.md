# Changelog

## [Unreleased]

### Fixes

- `@nova-ui/bits` | Aligned the message dismiss button with the status icon, including when the message wraps.

## [20.0.14] 📅 2026-11-24

### Fixes

- `@nova-ui/bits` | Escape closes a menu inside a dialog without also dismissing the dialog.
- `@nova-ui/dashboards` | After removing a widget by keyboard, focus moves to a nearby dashboard control.
- `@nova-ui/bits` | A11y fixes for nui-radio: visible keyboard focus, explicit label association, hints exposed as descriptions and accessible names for radio group examples
- `@nova-ui/bits` | Corrected menu keyboard focus and active-descendant semantics, respected handled keyboard events, and kept menu switches out of the tab order.
- `@nova-ui/bits` | Preserved popup adapter visibility when deprecated popup styles are loaded and rendered popup content before notifying open listeners.
- `@nova-ui/bits` | Enforced toast activation limits and queue ordering, and canceled pending activation when toasts are cleared, removed, or destroyed.
- `@nova-ui/bits` | Let Angular cancel paginator keyboard focus checks and virtual navigation when the component-scoped controller is destroyed.
- `@nova-ui/charts` | Provide keyboard tooltip interaction state per chart through Angular DI without changing the opt-in behavior, and explicitly type the resize callback.
- `@nova-ui/dashboards` | Provide independent keyboard reorder state through Angular DI for each supported configurator.
- Accessibility regression tests now include WCAG 2.0 AA rules alongside later WCAG versions and synchronize popup dismissal and panel hover checks without fixed browser sleeps.
- `@nova-ui/bits` | Preserved numeric zero values when selecting a SelectV2 option and updating its options, and added numbers to the option value type.
- `@nova-ui/bits` | Preserved native keyboard navigation in editable toolbar content, kept the overflow menu reachable when actions change disabled state, and restored keyboard focus indicators on menu buttons.
- `@nova-ui/bits` | Improved keyboard access and focus visibility for overflowing tabs, hoverable and collapsible panels, and sortable table headers.
- `@nova-ui/bits` | Added keyboard and non-dragging table column resizing, and keyboard resizing for LTR panels with resolvable numeric size bounds.
- `@nova-ui/bits` | Preserved native activation of host-referenced popups and exposed checkbox semantics and state on the keyboard-focusable control.
- `@nova-ui/charts` | Added opt-in keyboard tooltip inspection for aligned chart series and optional focusable legend series for focus-driven emphasis, with related examples and documentation.
- `@nova-ui/dashboards` | Separated timeseries legend visibility controls from drilldown links, and added keyboard access and focus emphasis to interactive proportional chart legends.
- `@nova-ui/dashboards` | Added keyboard activation and visible focus to interactive KPI and risk-score tiles while preserving native links.
- `@nova-ui/dashboards` | Improved widget editor and Remove Widget menu focus management, keyboard navigation, and dismissal.
- `@nova-ui/dashboards` | Added keyboard reordering to dynamic items, table columns V2, and background-color rules. Generic drag/repeat components and click/tap reordering without dragging remain outside this fix.
- `@nova-ui/bits` | Preserved paginator focus after page changes, including disabled Previous/Next controls, popup selection, and Shadow DOM. Ellipsis popups support Escape dismissal, close when focus leaves or a focused page is removed, and retain logical Tab order across virtualized pages and body-appended popups.
- `@nova-ui/bits` | **nui-paginator** keeps keyboard focus after a page change (WCAG 2.4.3), including when Previous/Next becomes disabled inside Shadow DOM. The activated button stays focused, focus moves to the current page when Previous/Next becomes disabled or a page is selected from the ellipsis popup, including body-appended popups. The ellipsis popup closes with Escape (focus returns to its trigger) or when focus leaves it, including when a focused page is removed during an update. Tab from the trigger enters the popup directly, also when it is appended to the body. In virtualized popups, Tab enters at the first page and keyboard navigation follows the logical page order.
- `@nova-ui/bits` | Improve checkbox and switch accessible names, checkbox descriptions and states, and form-field updates in OnPush hosts. Explicit accessible names now take precedence over form-field captions.
- `@nova-ui/bits` | Keep form-field help references separate from consumer-provided descriptions. Custom templates in control subclasses should render `resolvedAriaDescribedby` (or `descriptionIds` for checkboxes) to retain field help.
- `@nova-ui/bits` | Fix form-field captions for checkboxes and textboxes with a conflicting host ID. The native input receives a separate ID in these cases.
- `@nova-ui/bits` | Keep selections independent across radio groups without an explicit name.
- `@nova-ui/dashboards` | Show accessible placeholders for unavailable PerfStack legend values instead of blank tiles or misleading zero percentages.
- `@nova-ui/dashboards` | Percent stacked-area legends support per-series multipliers, keeping PerfStack CPU and `Remaining` values accurate when chart data is normalized by total CPU count. PerfStack retains its legacy fallback when no valid multiplier is supplied, and unavailable values remain distinct from zero when one is supplied.
- `@nova-ui/charts` | Percentage-area stacking excludes series marked `preprocess: false` from stack totals.
- `@nova-ui/bits` | Fixed SelectV2 and ComboboxV2 Playwright atoms to target their own popup by trigger ID, preventing strict-mode failures when multiple overlays coexist. Added paginator regression coverage.
- `@nova-ui/bits` | Track dialog opening order across containers and preserve focus in the active dialog when a background dialog closes.

## [20.0.13] 📅 2026-10-26

### Fixes

- `@nova-ui/bits` | Improved dialog and wizard focus management for WCAG 2.4.3: restore focus to usable dialog openers, preserve external focus during wizard navigation, recover focus after removing the active step, and fix horizontal wizard keyboard navigation across responsive overflow. Added a dialog example demonstrating focus handoff through `closed$` when the opener is removed.
- `@nova-ui/bits` | Dismisses focus- and hover-triggered popovers with Escape without reopening during the active trigger session, and supports Tab/Shift+Tab navigation through interactive content.
- `@nova-ui/bits` | Guard lazy overlay access in `nui-popup` when `isOpen` is initially `false` and cancel stale deferred open/close timers.
- `@nova-ui/bits` | Exposed progressbar semantics only on the progress bar, including determinate zero and indeterminate values.
- `@nova-ui/bits` | A11y fixes and improvements across form controls, pickers, panels, expanders, repeat lists, tables and wizards.
- `@nova-ui/dashboards` | Table widget scroll area is reachable by the Tab key when its content overflows, even without focusable content inside, and is exposed as a region named by the widget title (WCAG 2.1.1).

### Added

- `@nova-ui/bits` | Added `panel-collapse` and `panel-expand` icons.
- `@nova-ui/bits` | **nui-expander** new input `useRegionLandmark`; the body is no longer a `region` landmark by default

## [20.0.11] 📅 2026-09-23

### Fixes

- `@nova-ui/bits` | Improved tab accessibility by aligning tab and panel IDs, adding APG keyboard navigation with roving `tabindex`, exposing disabled states, and adding `ariaLabel` support. `nui-tab-heading` sets `aria-controls` when a controlled panel ID is provided through `ariaControls`.
- `@nova-ui/bits` | Improved switch accessibility by enabling Enter key activation, correctly associating projected labels, preventing duplicate element IDs, and adding a localized fallback accessible name.
- `@nova-ui/dashboards` | Fixed regression in keyboard scrolling in Modern Dashboard table widgets
- Prettier formatting fixes across the project

## [20.0.10] 📅 2026-08-11

### Fixes

- `@nova-ui/bits` | SkipSpace a11y regression fixed

## [20.0.9] 📅 2026-08-05

### Fixes

- Essentional A11y fixies
- `@nova-ui/bits` | Added unique IDs to expander landmarks
- `@nova-ui/bits` | A11y fixes for nui-toolbar

## [20.0.8] 📅 2026-07-27

### Added

- `@nova-ui/dashboards` | Decoupled KPI tile and proportional chart into reusable view components (`KpiTileViewComponent`, `ProportionalChartViewComponent`)
- `@nova-ui/dashboards` | Added `ViewsModule` exposing reusable module-based view components for use outside of widget context

## [20.0.7] 📅 2026-07-22

### versions of package were upgrade to be at least the same as in Fusion

## [20.0.5] 📅 2026-06-04

### Fixes

- `@nova-ui/bits` | A11y fixies for Home Summary
- `@nova-ui/bits` | A11y fixies for Search component
- `@nova-ui/bits` | new accessible blue for active menu button text

## [20.0.4] 📅 2026-05-27

### Fixes

- `@nova-ui/bits` | Add `resetFilterComponent` method for datasource
- `@nova-ui/dashboards` | Fix unsubscribes for paginator and search in table widget

## [20.0.0] 📅 2025-10-01

### Angular upgrade 20

## [19.0.3] 📅 2025-05-26

### Initial playwrite e2e tests migration

## [19.0.2] 📅 2025-09-30

### Added

- `@nova-ui/bits` | Added colorpicker
- `@nova-ui/bits` | Added nui-tab heading is accessible with keyboard

## [19.0.0] 📅 2025-05-26

### Angular upgrade 19

## [17.0.3] 📅 2025-08-06

### Fixes

- `@nova-ui/dashboards` | Fix kpi scale brokers duplication on config change

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

- `@nova-ui/dashboards` | Fix KPI widget empty state icon
- `@nova-ui/bits` `@nova-ui/charts` `@nova-ui/dashboards` | Update vulnerable crypto-js
- `@nova-ui/bits` `@nova-ui/charts` `@nova-ui/dashboards` | Fix nova-docs source code paths

## [15.0.8] 📅 2024-06-03

### Added

- `@nova-ui/dashboards` | Paginator added for table widget.

### Bugfix

- `@nova-ui/dashboards` | Added missing empty image for _nuiListWidgetComponent_ with no data.
- `@nova-ui/dashboards` | Added missing empty image for all Empty widgets.

## [15.0.6] 📅 2024-05-13

### Bugfix

- `@nova-ui/bits` | Properly show _niuMenuComponent_ popup when menu button is located at the bottom right corner of the viewport.

## [12.0.43] 📅 2023-04-09

### Added

- `@nova-ui/bits` | _nuiTooltipEllipsis_ added input for tooltip. Used on overflowing text.

## [15.0.5] 📅 2024-03-18

- `@nova-ui/bits` | _NUI-6198_ | Fix unwanted dialog dismiss when opened from `ngOnInit`

## [15.0.2] 📅 2023-08-24

- `@nova-ui/bits` `@nova-ui/charts` `@nova-ui/dashboards` | Upgraded to Angular v15 (compatible with v16 apps)

## [13.0.1] 📅 2022-11-16

- `@nova-ui/bits` `@nova-ui/charts` `@nova-ui/dashboards` | Upgraded to Angular v13 (compatible with v14 apps)

## [12.0.8] 📅 2022-07-27

### Bugfix

- `@nova-ui/bits` | _unitConversionConstants_ fixed typo in Gbps (was Gpbs)

## [12.0.7] 📅 2022-06-30

### Added

- `@nova-ui/bits` | _NUI-6180_ | _ToolbarComponent_ now has default message for state with no items (implemented using new **nui-toolbar-message** component which can also be used by consumers explicitly inside **nui-toolbar**)

### Bugfix

- `@nova-ui/dashboards` | _DashboardUnitConversionPipe_ now takes unit type to determine nuit number base

## [12.0.6] 📅 2022-05-25

### Bugfix

- `@nova-ui/dashboards` | Fixed bug, when "Explore this data" in the widget's header icon does not open a defined URL in some cases.

## [12.0.5] 📅 2022-05-04

### Bugfix

- `@nova-ui/dashboards` | _NUI-6169_ | Fixed url interaction handler provider

## [12.0.4] 📅 2022-04-29

### Added

- `@nova-ui/bits` | _NUI-6163_ | Added _preventRowClick_ flag on **nui-repeater** (to be used when items contain clickable content)

## [12.0.3] 📅 2022-04-14

### Bugfix

- `@nova-ui/dashboards` | _NUI-6169_ | Usage of lodash template, which is considered unsafe by 'Content Security Policy' and the evaluation of template is blocked by browser, was replaced with safer (explicit) property evaluation.

## [12.0.2] 📅 2022-03-29

### Bugfix

- `@nova-ui/bits` | _NUI-431_ | Properly show tooltip on hover in overlapping scrollable container.

## [12.0.1] 📅 2022-03-14

### Bugfix

- `@nova-ui/bits` | _NUI-426_ | Properly update _pageSize_ in **nui-paginator** on input change.

## [12.0.0] 📅 2022-02-22

### Upgrade

- `@nova-ui/bits` `@nova-ui/charts` `@nova-ui/dashboards` | Upgraded to Angular v12 (compatible with v13 apps)
