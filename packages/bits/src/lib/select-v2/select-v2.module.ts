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
