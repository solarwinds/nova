import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NuiCommonModule } from "./common/common.module";
import { NuiBreadcrumbModule } from "./lib/breadcrumb/breadcrumb.module";
import { NuiBusyModule } from "./lib/busy/busy.module";
import { NuiButtonModule } from "./lib/button/button.module";
import { NuiCheckboxModule } from "./lib/checkbox/checkbox.module";
import { NuiChipsModule } from "./lib/chips/chips.module";
import { NuiContentModule } from "./lib/content/content.module";
import { NuiTimeFrameBarModule } from "./lib/convenience/time-frame-bar/time-frame-bar.module";
import { NuiDatePickerModule } from "./lib/date-picker/date-picker.module";
import { NuiDateTimerPickerModule } from "./lib/date-time-picker/date-time-picker.module";
import { NuiDialogModule } from "./lib/dialog/dialog.module";
import { NuiDividerModule } from "./lib/divider/divider.module";
import { NuiDndModule } from "./lib/dnd/dnd.module";
import { NuiExpanderModule } from "./lib/expander/expander.module";
import { NuiFormFieldModule } from "./lib/form-field/form-field.module";
import { NuiIconModule } from "./lib/icon/icon.module";
import { NuiImageModule } from "./lib/image/image.module";
import { NuiLayoutModule } from "./lib/layout/layout.module";
import { NuiMenuModule } from "./lib/menu/menu.module";
import { NuiMessageModule } from "./lib/message/message.module";
import { NuiOverlayModule } from "./lib/overlay/overlay.module";
import { NuiPaginatorModule } from "./lib/paginator/paginator.module";
import { NuiPanelModule } from "./lib/panel/panel.module";
import { NuiPopoverModule } from "./lib/popover/popover.module";
import { NuiPopupModule } from "./lib/popup/popup.module";
import { NuiProgressModule } from "./lib/progress/progress.module";
import { NuiRadioModule } from "./lib/radio/radio.module";
import { NuiRepeatModule } from "./lib/repeat/repeat.module";
import { NuiSearchModule } from "./lib/search/search.module";
import { NuiSelectV2Module } from "./lib/select-v2/select-v2.module";
import { NuiSelectModule } from "./lib/select/select.module";
import { NuiSelectorModule } from "./lib/selector/selector.module";
import { NuiSorterModule } from "./lib/sorter/sorter.module";
import { NuiSpinnerModule } from "./lib/spinner/spinner.module";
import { NuiSwitchModule } from "./lib/switch/switch.module";
import { NuiTabsModule } from "./lib/tabgroup/tabs.module";
import { NuiTableModule } from "./lib/table/table.module";
import { NuiTextboxModule } from "./lib/textbox/textbox.module";
import { NuiTimeFramePickerModule } from "./lib/time-frame-picker/time-frame-picker.module";
import { NuiTimePickerModule } from "./lib/time-picker/time-picker.module";
import { NuiToastModule } from "./lib/toast/toast.module";
import { NuiToolbarModule } from "./lib/toolbar/toolbar.module";
import { NuiTooltipModule } from "./lib/tooltip/tooltip.module";
import { NuiValidationMessageModule } from "./lib/validation-message/validation-message.module";
import { NuiWizardV2Module } from "./lib/wizard-v2/wizard.module";
import { NuiWizardModule } from "./lib/wizard/wizard.module";

// for when you ask: https://github.com/dherges/ng-packagr/issues/734

/** @ignore */
export const nuiModulesList = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NuiCommonModule,
    NuiButtonModule,
    NuiIconModule,
    NuiMessageModule,
    NuiTabsModule,
    NuiImageModule,
    NuiCheckboxModule,
    NuiPopupModule,
    NuiDividerModule,
    NuiMenuModule,
    NuiLayoutModule,
    NuiSwitchModule,
    NuiSpinnerModule,
    NuiTextboxModule,
    NuiTooltipModule,
    NuiSelectModule,
    NuiBreadcrumbModule,
    NuiBusyModule,
    NuiChipsModule,
    NuiContentModule,
    NuiDatePickerModule,
    NuiDateTimerPickerModule,
    NuiDialogModule,
    NuiExpanderModule,
    NuiFormFieldModule,
    NuiPaginatorModule,
    NuiPanelModule,
    NuiPopoverModule,
    NuiProgressModule,
    NuiRadioModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSelectorModule,
    NuiSelectV2Module,
    NuiOverlayModule,
    NuiSorterModule,
    NuiTableModule,
    NuiTimeFrameBarModule,
    NuiTimeFramePickerModule,
    NuiTimePickerModule,
    NuiToastModule,
    NuiToolbarModule,
    NuiValidationMessageModule,
    NuiWizardModule,
    NuiWizardV2Module,
    NuiDndModule,
];

/**
 * @ignore
 * @deprecated Please import the individual Nova component modules you are using instead of
 * the monolith 'NuiModule'. For example, import 'NuiButtonModule' if you are using the
 * 'ButtonComponent'.
 */
@NgModule({
    imports: nuiModulesList,
    declarations: [

    ],
    exports: nuiModulesList,
    entryComponents: [

    ],
    providers: [

    ],
})
export class NuiModule {

}
