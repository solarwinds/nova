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

import { Component } from "@angular/core";
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { ComboboxV2BasicExampleComponent } from "../combobox-v2-basic/combobox-v2-basic.example.component";
import { ComboboxV2GettingValueExampleComponent } from "../combobox-v2-getting-value/combobox-v2-getting-value.example.component";
import { ComboboxV2SettingValueExampleComponent } from "../combobox-v2-setting-value/combobox-v2-setting-value.example.component";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { ComboboxV2TypeaheadExampleComponent } from "../combobox-v2-typeahead/combobox-v2-typeahead.example.component";
import { ComboboxV2CustomizeOptionsExampleComponent } from "../combobox-v2-customize-options/combobox-v2-customize-options.example.component";
import { ComboboxV2GroupedOptionsExampleComponent } from "../combobox-v2-grouped-options/combobox-v2-grouped-options.example.component";
import { ComboboxV2ReactiveFormFieldExampleComponent } from "../combobox-v2-reactive-form-field/combobox-v2-reactive-form-field.example.component";
import { ComboboxV2MultiselectExampleComponent } from "../combobox-v2-multiselect/combobox-v2-multiselect.example.component";
import { ComboboxV2CreateOptionExampleComponent } from "../combobox-v2-create-option/combobox-v2-create-option.example.component";
import { ComboboxV2CreateOptionMultiselectExampleComponent } from "../combobox-v2-create-option-multiselect/combobox-v2-create-option-multiselect.example.component";
import { ComboboxV2VirtualScrollExampleComponent } from "../combobox-v2-virtual-scroll/combobox-v2-virtual-scroll.example.component";
import { ComboboxV2DisabledExampleComponent } from "../combobox-v2-disabled/combobox-v2-disabled.example.component";
import { ComboboxV2ErrorExampleComponent } from "../combobox-v2-error/combobox-v2-error.example.component";
import { ComboboxV2StylingExampleComponent } from "../combobox-v2-styling/combobox-v2-styling.example.component";
import { ComboboxV2InlineExampleComponent } from "../combobox-v2-inline/combobox-v2-inline.example.component";
import { ComboboxV2RemoveValueExampleComponent } from "../combobox-v2-remove-value/combobox-v2-remove-value.example.component";
import { ComboboxV2OverlayConfigExampleComponent } from "../combobox-v2-overlay-config/combobox-v2-overlay-config.example.component";
import { ComboboxV2CustomTypeaheadExampleComponent } from "../combobox-v2-custom-typeahead/combobox-v2-custom-typeahead.example.component";
import { ComboboxV2CustomControlExampleComponent } from "../combobox-v2-custom-control/combobox-v2-custom-control.example.component";

@Component({
    selector: "nui-combobox-v2-docs-example",
    templateUrl: "./combobox-v2-docs.example.component.html",
    styleUrls: ["combobox-v2-docs.example.component.less"],
    imports: [NuiDocsModule, ComboboxV2BasicExampleComponent, ComboboxV2GettingValueExampleComponent, ComboboxV2SettingValueExampleComponent, NuiMessageModule, ComboboxV2TypeaheadExampleComponent, ComboboxV2CustomizeOptionsExampleComponent, ComboboxV2GroupedOptionsExampleComponent, ComboboxV2ReactiveFormFieldExampleComponent, ComboboxV2MultiselectExampleComponent, ComboboxV2CreateOptionExampleComponent, ComboboxV2CreateOptionMultiselectExampleComponent, ComboboxV2VirtualScrollExampleComponent, ComboboxV2DisabledExampleComponent, ComboboxV2ErrorExampleComponent, ComboboxV2StylingExampleComponent, ComboboxV2InlineExampleComponent, ComboboxV2RemoveValueExampleComponent, ComboboxV2OverlayConfigExampleComponent, ComboboxV2CustomTypeaheadExampleComponent, ComboboxV2CustomControlExampleComponent]
})
export class ComboboxV2DocsComponent {
    public scrollTo($element: HTMLElement): void {
        $element.scrollIntoView(true);
        const scrolledY = window.scrollY;

        if (scrolledY) {
            window.scroll(0, scrolledY - 40);
        }
    }
}
