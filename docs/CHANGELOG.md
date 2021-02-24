# Changelog

## [11.0.0] - 2021-?-?

<details>
    <summary>Bits</summary>

### Added

### Changed

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

</details>
<details>
    <summary>Dashboards</summary>

### Deprecated
- Interfaces
  - **IKpiWidgetIndicatorData**. Use **IKpiData** instead.
- Inputs, Methods, etc.
    - **updateConfiguration** of **IConfigurable**. Will be renamed to updateProperties**.
    - **radioButtonGroupValue** of **ThresholdsConfigurationComponent**. No necessity in this after refactoring.
    - **formattersStateChanged$** of **FormatterRegistryService**. Use **stateChanged$**
    - **formattersStateChanged$** of **FormatterRegistryService**. Use **addItems**
    - **getFormatters** of **FormatterRegistryService**. Use **getItems**
</details>
