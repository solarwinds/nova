# Changelog

## [12.0.0] - 2022-06-01

<details>
    <summary>Dashboards</summary>

### Bugfix
 - Fixed bug, when "Explore this data" in the widget's header icon does not open a defined URL in some cases.
 - Usage of lodash template, which is considered unsafe by 'Content Security Policy' and the evaluation of template is blocked by browser, was replaced with safer (explicit) property evaluation.
    
</details> 
    
## [11.0.0] - 2021-11-21

<details>
    <summary>Bits</summary>

### Added
- Combobox-v2 Component.
- Select-v2 Component.
- Tree Component.
- TableVirtualScrollStickyHeader Component.
- Ability to internationalize sorter items for Sorter Component.
- Ability to list menu items horizontally.
- Ability to conditionally hide selection column.
- Chips Overflow.
- Possibility to set focus programmatically on Textbox Component.


### Changed
- Made Selector using nui-overlay instead of adapter.
- Synced Arrow Component to work with nui-overlay.

### Breaking
 - **REMOVED**: NuiModule module. From now on you should import each component separately
 - **REMOVED**: NuiEvent interface. Use native TypeScript Event instead.
 - **REMOVED**: *getEventStream()* method of **EventBusService**. It was deprecated a while ago, the EventBus base class's *getStream()* method must be used instead.
 - **REMOVED**: *@Input()* **required** of **TextboxNumberComponent**
 - **REMOVED**: *@Output()* **rowsSelected** of **TableComponent**. Use selectionChange instead.
 - **REMOVED**: deprecated lowercase entries of the IconStatus enum. Use Pascal case entries instead
 - **REMOVED**: *@Input()* **required** of **TextboxNumberComponent** (the input wasn't used by the component)
 - **REMOVED**: *@Input()* **suffix** of **TextboxNumberComponent**  (the input wasn't used by the component)
 - **RENAMED**: NuiDateTimerPickerModule to NuiDateTimePickerModule

### Deprecated
 - Components, Services, etc.
    - SelectComponent
    - BaseSelectComponent
    - ComboboxComponent
    - TableVirtualScrollDirective (use TableVirtualScrollLinearDirective instead)
    - TableVirtualScrollStrategy  (use TableVirtualScrollLinearStrategy instead)
    - LocalFilteringDataSource
    - PopupDeprecatedComponent
    - PopupContainerComponent
 - Inputs, Methods, etc.
    - *@Input()* **itemsSource** of **SorterComponent**. Set to be removed in v12.
 - Styles
    - All styles marked **// deprecated** and/or **// unofficial** are now deprecated and will be removed in v12
    - Files affected:
        - [nui-framework-colors-dark.less](../packages/bits/src/styles/nui-framework-colors-dark.less)
        - [nui-framework-colors.less](../packages/bits/src/styles/nui-framework-colors.less)
        - [nui-framework-palette.less](../packages/bits/src/styles/nui-framework-palette.less)
</details>
<details>
    <summary>Charts</summary>

### Added

- Simple stacked area chart.
- Chips Overflow.
- Default overflow strategy for horizontal axis tick labels.


### Changed

- Visual style update of Chips.

### Breaking
 - **REMOVED**: *deemphasizeSeries()* method of **ChartAssist**. Use *resetVisibleSeries()* method instead.
 - **REMOVED**: **charts** property from **SparkChartAssist**. Use **sparks** instead as collection of ISpark objects.
 - **REMOVED**: ISparkChartAssistChart interface. Use ISpark instead.
 - **REMOVED**: *adjustClipPath()* method of **RadialGrid**. Use *adjustRenderingArea()* method instead.
 - **REMOVED**: **minOrdinalSize** property from **IBarRendererConfig**, because of no effect on the renderer.
 - **REMOVED**: **STROKE_STYLE_DASHED** and **STROKE_STYLE_DOTTED** properties. Use *getStrokeStyleDashed()* and *getStrokeStyleDotted()* accordingly.
</details>
<details>
    <summary>Dashboards</summary>

### Added
- Ability to customize chart palette in widgets.
- Custom widget which supports html code.
- Click handler to KPI widget.
- Support for allowing data source to communicate that interaction is supported. 
- Zooming with transform:scale for kpi widget.
- Search functionality for Drilldown Component.
- Responsivity and layout improvements for Drilldown widget.
- Ability to hide widget header.
- Widgets stack left-right, top-bottom in Mobile view.
- Sorting by certain columns only Table widget.

### Changed
- Improved group statuses mapping for Drilldown
- Integrated search-filtering into table widget
- Synced colors in visualization data to legend Proportional widget
- Removed vertical scrollbar on the Proportional widget
- Improved layout responsivity KPI widget
- Changed proportions of chart and legend in small widget size for Proportional widget

### Deprecated
- Interfaces
  - **IKpiWidgetIndicatorData**. Use **IKpiData** instead.
- Inputs, Methods, etc.
    - *updateConfiguration* of **IConfigurable**. Will be renamed to *updateProperties*.
    - *radioButtonGroupValue* of **ThresholdsConfigurationComponent**. No necessity in this after refactoring.
    - *formattersStateChanged$* of **FormatterRegistryService**. Use *stateChanged$*
    - *formattersStateChanged$* of **FormatterRegistryService**. Use *addItems*
    - *getFormatters* of **FormatterRegistryService**. Use *getItems*
</details>
