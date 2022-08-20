import { OverlayModule } from "@angular/cdk/overlay";
import { PortalModule } from "@angular/cdk/portal";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NuiButtonModule } from "../button/button.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiOverlayModule } from "../overlay/overlay.module";
import { NuiTooltipModule } from "../tooltip/tooltip.module";

import { ComboboxV2OptionHighlightDirective } from "./combobox-v2-option-highlight/combobox-v2-option-highlight.directive";
import { ComboboxV2Component } from "./combobox-v2/combobox-v2.component";
import { MarkAsSelectedItemDirective } from "./mark-as-selected-item.directive";
import { SelectV2OptionGroupComponent } from "./option-group/select-v2-option-group.component";
import { SelectV2OptionComponent } from "./option/select-v2-option.component";
import { SelectV2Component } from "./select/select-v2.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        FormsModule,
        OverlayModule,
        PortalModule,
        NuiButtonModule,
        NuiIconModule,
        NuiTooltipModule,
        CommonModule,
        NuiOverlayModule,
    ],
    declarations: [
        SelectV2Component,
        SelectV2OptionComponent,
        SelectV2OptionGroupComponent,
        ComboboxV2Component,
        MarkAsSelectedItemDirective,
        ComboboxV2OptionHighlightDirective,
    ],
    exports: [
        SelectV2Component,
        SelectV2OptionComponent,
        SelectV2OptionGroupComponent,
        ComboboxV2Component,
        MarkAsSelectedItemDirective,
        ComboboxV2OptionHighlightDirective,
    ],
    providers: [],
})
// Will be renamed in scope of the NUI-5797
export class NuiSelectV2Module {}
