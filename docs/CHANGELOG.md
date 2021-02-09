# Changelog

## [11.0.0] - 2021-?-?

<details>
    <summary>Bits</summary>

### Added

### Changed

### Breaking
 - **REMOVED**: NuiModule module. From now on you should import each component separately
 - **REMOVED**: NuiEvent interface
 - **REMOVED**: *getEventStream()* method of **EventBusService**. It was deprecated a while ago, the native *getStream()* method must be used instead.
 - **REMOVED**: *@Input()* **required** of **TextboxNumberComponent**
 - **REMOVED**: *@Output()* **rowsSelected** of **TableComponent**. Use selectionChange instead.
 - **REMOVED**: deprecated entries of the IconStatus enum. Use Pascal case entries instead
 - **REMOVED**: *@Input()* **required** of **TextboxNumberComponent** (the input does not have any impact on the component)
 - **REMOVED**: *@Input()* **suffix** of **TextboxNumberComponent**  (the input does not have any impact on the component)

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

</details>