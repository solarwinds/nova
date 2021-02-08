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
    - *This affected*:
        - RadioComponent
        - PopupComponent (popup-adapter.component.ts)
        - PopupDeprecatedComponent (popup.component.ts)
        - OverlayComponent
        - CheckboxComponent
        - ResizerDirective
        - ClickInterceptorDirective
 - **REMOVED**: *@Input()* **required** of **TextboxNumberComponent**
 - **REMOVED**: *@Output()* **rowsSelected** of **TableComponent**. Use selectionChange instead.
 - **REMOVED**: deprecated entries of the IconStatus enum. Use Pascal case entries instead

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
    - ComboboxV2Component - set to be renamed in v12 ('V2' will be removed from the name)
    - ComboboxV2OptionHighlightDirective - set to be renamed in v12 ('V2' will be removed from the name)
    - NuiSelectV2Module - set to be renamed in v12 ('V2' will be removed from the name)
    - BaseSelectV2 - set to be renamed in v12 ('V2' will be removed from the name)
    - SelectV2OptionComponent - set to be renamed in v12 ('V2' will be removed from the name)
    - SelectV2OptionGroupComponent - set to be renamed in v12 ('V2' will be removed from the name)
    - SelectV2Component - set to be renamed in v12 ('V2' will be removed from the name)
 - Inputs, Methods, etc.
    - *@Input()* **itemsSource** of **SorterComponent**. Set to be removed in v12.
 - Constants, Variable etc.
    - **NUI_SELECT_V2_OPTION_PARENT_COMPONENT** - Set to be renamed in v12 ('V2' will be removed from the name).
 - Other
    - **REMOVED**: visual tests for the deprecated **nui-select** component
    - **REMOVED**: visual tests for the deprecated **nui-combobox** component
    - **REMOVED**: *@Input()* **required** of **TextboxNumberComponent** (the input does not have any impact on the component)
    - **REMOVED**: *@Input()* **suffix** of **TextboxNumberComponent**  (the input does not have any impact on the component)
 - Styles
    - All styles marked **// deprecated** are now deprecated and will be removed in v12
    - All styles marked **// unofficial** are now deprecated and will be removed in v12
</details>
<details>
    <summary>Charts</summary>

</details>
<details>
    <summary>Dashboards</summary>

</details>