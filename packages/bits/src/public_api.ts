// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

export * from "./nui-api";

// Every component should be exported from here directly to avoid strange metadata aliasing
export { BreadcrumbComponent } from "./lib/breadcrumb/breadcrumb.component";
export { ContentComponent } from "./lib/content/content.component";
export { ExpanderComponent } from "./lib/expander/expander.component";
export { MessageComponent } from "./lib/message/message.component";
export { DividerComponent } from "./lib/divider/divider.component";
export { RadioComponent } from "./lib/radio/radio-group.component";
export { RadioGroupComponent } from "./lib/radio/radio-group.component";
export { CheckboxComponent } from "./lib/checkbox/checkbox.component";
export { CheckboxGroupComponent } from "./lib/checkbox/checkbox-group.component";
export { ChipComponent } from "./lib/chips/chip/chip.component";
export { ChipsComponent } from "./lib/chips/chips.component";
export { ChipsOverflowComponent } from "./lib/chips/chips-overflow/chips-overflow.component";
export { DraggableComponent } from "./lib/dragdrop/draggable.component";
export { DroppableComponent } from "./lib/dragdrop/droppable.component";
export { IconComponent } from "./lib/icon/icon.component";
export { SpinnerComponent } from "./lib/spinner/spinner.component";
export { SwitchComponent } from "./lib/switch/switch.component";
export { PaginatorComponent } from "./lib/paginator/paginator.component";
export { ProgressComponent } from "./lib/progress/progress.component";
export { PanelComponent } from "./lib/panel/panel.component";
export { ButtonComponent } from "./lib/button/button.component";
export { BusyComponent } from "./lib/busy/busy.component";
export { ImageComponent } from "./lib/image/image.component";
export { SearchComponent } from "./lib/search/search.component";
export { TextboxComponent } from "./lib/textbox/textbox.component";
export { RepeatItemComponent } from "./lib/repeat/repeat-item/repeat-item.component";
export { RepeatComponent } from "./lib/repeat/repeat.component";
export { MenuActionComponent } from "./lib/menu/menu-item/menu-action/menu-action.component";
export { MenuComponent } from "./lib/menu/menu/menu.component";
export { MenuGroupComponent } from "./lib/menu/menu-item/menu-group/menu-group.component";
export { MenuItemBaseComponent } from "./lib/menu/menu-item/menu-item/menu-item-base";
export { MenuLinkComponent } from "./lib/menu/menu-item/menu-link/menu-link.component";
export { MenuOptionComponent } from "./lib/menu/menu-item/menu-option/menu-option.component";
export { MenuPopupComponent } from "./lib/menu/menu-popup/menu-popup.component";
export { MenuSwitchComponent } from "./lib/menu/menu-item/menu-switch/menu-switch.component";
export { WizardStepComponent } from "./lib/wizard/wizard-step.component";
export { WizardComponent } from "./lib/wizard/wizard.component";
export { ToastComponent } from "./lib/toast/toast.component";
export { PopupDeprecatedComponent } from "./lib/popup/popup.component";
export { PopupToggleDirective } from "./lib/popup/popup-toggle.directive";
export { SelectorComponent } from "./lib/selector/selector.component";
export { PopoverComponent } from "./lib/popover/popover.component";
export { PopupComponent } from "./lib/popup-adapter/popup-adapter.component";
export { PopoverModalComponent } from "./lib/popover/popover-modal.component";
export { SelectComponent } from "./lib/select/select.component";
export { SelectV2OptionComponent } from "./lib/select-v2/option/select-v2-option.component";
export { SelectV2OptionGroupComponent } from "./lib/select-v2/option-group/select-v2-option-group.component";
export { ComboboxV2OptionHighlightDirective } from "./lib/select-v2/combobox-v2-option-highlight/combobox-v2-option-highlight.directive";
export { OverlayItemComponent } from "./lib/overlay/overlay-item/overlay-item.component";
export { OverlayComponent } from "./lib/overlay/overlay-component/overlay.component";
export { OverlayArrowComponent as ArrowComponent } from "./lib/overlay/arrow-component/overlay-arrow.component";
export { SelectV2Component } from "./lib/select-v2/select/select-v2.component";
export { ComboboxV2Component } from "./lib/select-v2/combobox-v2/combobox-v2.component";
export { MarkAsSelectedItemDirective } from "./lib/select-v2/mark-as-selected-item.directive";
export { ComboboxComponent } from "./lib/select/combobox/combobox.component";
export { BaseSelect } from "./lib/select/base-select";
export { DatePickerComponent } from "./lib/date-picker/date-picker.component";
export { TimePickerComponent } from "./lib/time-picker/time-picker.component";
export { TimeFramePickerComponent } from "./lib/time-frame-picker/time-frame-picker.component";
export { DateTimePickerComponent } from "./lib/date-time-picker/date-time-picker.component";
export { SorterComponent } from "./lib/sorter/sorter.component";
export { DialogComponent } from "./lib/dialog/dialog.component";
export { NuiDialogRef } from "./lib/dialog/dialog-ref";
export { DialogHeaderComponent } from "./lib/dialog/dialog-header.component";
export { DialogFooterComponent } from "./lib/dialog/dialog-footer.component";
export { DialogBackdropComponent } from "./lib/dialog/dialog-backdrop.component";
export { ConfirmationDialogComponent } from "./lib/dialog/confirmation-dialog.component";
export { TableComponent } from "./lib/table/table.component";
export {
    TableFooterRowComponent,
    TableHeaderRowComponent,
    TableRowComponent,
    TableFooterRowDefDirective,
    TableRowDefDirective,
    TableHeaderRowDefDirective,
} from "./lib/table/table-row/table-row.component";
export { CardComponent } from "./lib/layout/card/card.component";
export { CardGroupComponent } from "./lib/layout/card-group/card-group.component";
export { SheetComponent } from "./lib/layout/sheet/sheet.component";
export { SheetGroupComponent } from "./lib/layout/sheet-group/sheet-group.component";
export { TableHeaderCellComponent } from "./lib/table/table-cell/table-header-cell.component";
export { TableFooterCellDefDirective } from "./lib/table/table-cell/table-footer-cell-def.directive";
export { TableFooterCellDirective } from "./lib/table/table-cell/table-footer-cell.directive";
export { TableHeaderCellDefDirective } from "./lib/table/table-cell/table-header-cell-def.directive";
export { TableColumnDefDirective } from "./lib/table/table-cell/table-column-def.directive";
export { TableCellDirective } from "./lib/table/table-cell/table-cell.directive";
export { TableCellDefDirective } from "./lib/table/table-cell/table-cell-def.directive";
export { TableResizerDirective } from "./lib/table/table-resizer/table-resizer.directive";
export { ToolbarComponent } from "./lib/toolbar/toolbar.component";
export { ToolbarGroupComponent } from "./lib/toolbar/toolbar-group.component";
export { ToolbarItemComponent } from "./lib/toolbar/toolbar-item.component";
export { ToolbarMessageComponent } from "./lib/toolbar/toolbar-message.component";
export { ToolbarSplitterComponent } from "./lib/toolbar/toolbar-splitter.component";
export { ValidationMessageComponent } from "./lib/validation-message/validation-message.component";
export { TextboxNumberComponent } from "./lib/textbox/textbox-number/textbox-number.component";
export { FormFieldComponent } from "./lib/form-field/form-field.component";
export { TabGroupComponent } from "./lib/tabgroup/tab-group/tab-group.component";
export { TabHeadingCustomTemplateRefDirective } from "./lib/tabgroup/tab/tab-heading-custom-template-ref.directive";
export { TabHeadingDirective } from "./lib/tabgroup/tab/tab-heading.directive";
export { TabComponent } from "./lib/tabgroup/tab/tab.component";
export { ClickFilterDirective } from "./common/directives/click-filter/click-filter.directive";
export { ClipboardDirective } from "./common/directives/clipboard/clipboard.directive";
export { DraggableDirective } from "./common/directives/dragdrop/draggable.directive";
export { DroppableDirective } from "./common/directives/dragdrop/droppable.directive";
export { ResizeObserverDirective } from "./common/directives/resize-observer/resize-observer.directive";
export { ResizerDirective } from "./common/directives/resizer/resizer.directive";
export { ResizeDirective } from "./common/directives/resize/resize.directive";
export { SetFocusDirective } from "./common/directives/set-focus/set-focus.directive";
export { TooltipDirective } from "./lib/tooltip/tooltip.directive";
export { ZoomContentDirective } from "./common/directives/zoom-content/zoom-content.directive";
export { FreetypeQueryComponent } from "./lib/freetype-query-builder/freetype-query-builder.component";
export { TextHighlightOverlayComponent } from "./lib/freetype-query-builder/text-highlight-overlay/text-highlight-overlay-component";

// these are not public, but v9 ng-packgr complains without them
export { ThemeSwitcherComponent } from "./lib/docs/theme-switcher/theme-switcher.component";
export { ClickInterceptorDirective } from "./common/directives/click-interceptor/click-interceptor.directive";
export { MenuItemComponent } from "./lib/menu/menu-item/menu-item/menu-item.component";
export { TabHeadingComponent } from "./lib/tabgroup/tab-heading/tab-heading.component";
export { TabHeadingGroupComponent } from "./lib/tabgroup/tab-heading-group/tab-heading-group.component";
export { TooltipComponent } from "./lib/tooltip/tooltip.component";

export { LayoutResizerComponent } from "./lib/layout/layout-resizer/layout-resizer.component";
export { TimeFrameBarComponent } from "./lib/convenience/time-frame-bar/time-frame-bar.component";
export { QuickPickerComponent } from "./lib/time-frame-picker/quick-picker/quick-picker.component";
export { CopyTextComponent } from "./lib/docs/copy-text/copy-text.component";
export { ExampleWrapperComponent } from "./lib/docs/example-wrapper/example-wrapper.component";
export { ExampleCodeComponent } from "./lib/docs/example-code/example-code.component";
export { SrlcIndicatorComponent } from "./lib/docs/srlc-indicator/srlc-indicator.component";

// Pipes
export { HighlightPipe } from "./pipes/highlight.pipe";
export { LimitToPipe } from "./pipes/limit-to.pipe";
export { MapKeyValuePipe } from "./pipes/map-key-value.pipe";
export { TimeFrameFormatPipe } from "./lib/time-frame-picker/time-frame-format.pipe";
export { UnitConversionPipe } from "./pipes/unit-conversion.pipe";

// Every Service should be exposed as well
export { IconService } from "./lib/icon/icon.service";
export { DragAndDropService } from "./common/directives/dragdrop/drag-and-drop.service";
export { BreadcrumbStateService } from "./lib/breadcrumb/breadcrumb-state.service";
export { NoopDataSourceService } from "./services/data-source/noop-data-source.service";
export { DataSourceService } from "./services/data-source/data-source.service";
export { DataSourceFeatures } from "./services/data-source/data-source-features";
export { DataFilterService } from "./services/data-filter.service";
export { DialogStackService } from "./lib/dialog/dialog-stack.service";
export { DialogService } from "./lib/dialog/dialog.service";
export { DomUtilService } from "./services/dom-util.service";
export { EdgeDetectionService } from "./services/edge-detection.service";
export { EventPropagationService } from "./services/event-propagation.service";
export { HistoryStorage } from "./services/history-storage";
export { ListService } from "./services/list.service";
export { LoggerService } from "./services/log-service";
export {
    NotificationHandler,
    NotificationService,
} from "./services/notification-service";
export { PositionService } from "./services/position.service";
export { SearchService } from "./services/search.service";
export { SelectorService } from "./lib/selector/selector.service";
export { UtilService } from "./services/util.service";
export { TimeframeService } from "./lib/time-frame-picker/services/timeframe.service";
export { ToastContainerService } from "./lib/toast/toast-container.service";
export { ToastService } from "./lib/toast/toast.service";
export { ToastDirective } from "./lib/toast/toast.directive";
export { ThemeSwitchService } from "./services/theme-switch.service";
export { TransientCacheService } from "./services/transient-cache.service";
export { TableStateHandlerService } from "./lib/table/table-state-handler.service";
export { UnitConversionService } from "./services/unit-conversion.service";
export { LocalFilteringDataSource } from "./services/data-source/local-filtering-data-source.service";
export { ClientSideDataSource } from "./services/data-source/client-side-data-source.service";
export { ServerSideDataSource } from "./services/data-source/server-side-source.service";
export { EventBusService } from "./services/event-bus.service";
export { EventBus } from "./services/event-bus";
export { MenuKeyControlService } from "./lib/menu/menu-key-control.service";
export { VirtualViewportManager } from "./services/virtual-viewport-manager.service";
export { OverlayContainerService } from "./lib/overlay/overlay-container.service";
export { OverlayPositionService } from "./lib/overlay/overlay-position.service";
export { OverlayService } from "./lib/overlay/overlay.service";

// External tokens also should be exposed here
export { DEMO_PATH_TOKEN } from "./constants/path.constants";

// Animations expose
export { expand } from "./animations/expand";
