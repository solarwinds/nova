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
import { ComboboxBasicExampleComponent } from "../combobox-basic/combobox-basic.example.component";
import { ComboboxDisabledExampleComponent } from "../combobox-disabled/combobox-disabled.example.component";
import { ComboboxRequiredExampleComponent } from "../combobox-required/combobox-required.example.component";
import { ComboboxInlineExampleComponent } from "../combobox-inline/combobox-inline.example.component";
import { ComboboxClearExampleComponent } from "../combobox-clear/combobox-clear.example.component";
import { ComboboxIconExampleComponent } from "../combobox-icon/combobox-icon.example.component";
import { ComboboxJustifiedExampleComponent } from "../combobox-justified/combobox-justified.example.component";
import { ComboboxDisplayValueExampleComponent } from "../combobox-display-value/combobox-display-value.example.component";
import { ComboboxReactiveFormExampleComponent } from "../combobox-reactive-form/combobox-reactive-form.example.component";
import { ComboboxTypeaheadExampleComponent } from "../combobox-typeahead/combobox-typeahead.example.component";
import { ComboboxSeparatorsExampleComponent } from "../combobox-separators/combobox-separators.example.component";
import { ComboboxCustomTemplateExampleComponent } from "../combobox-custom-template/combobox-custom-template.example.component";
import { ComboboxAppendToBodyExampleComponent } from "../combobox-append-to-body/combobox-append-to-body.example.component";
import { ComboboxWithRemoveValueExampleComponent } from "../combobox-with-remove-value/combobox-with-remove-value.example.component";

@Component({
    selector: "nui-combobox-docs-example",
    templateUrl: "./combobox-docs.example.component.html",
    imports: [NuiDocsModule, ComboboxBasicExampleComponent, ComboboxDisabledExampleComponent, ComboboxRequiredExampleComponent, ComboboxInlineExampleComponent, ComboboxClearExampleComponent, ComboboxIconExampleComponent, ComboboxJustifiedExampleComponent, ComboboxDisplayValueExampleComponent, ComboboxReactiveFormExampleComponent, ComboboxTypeaheadExampleComponent, ComboboxSeparatorsExampleComponent, ComboboxCustomTemplateExampleComponent, ComboboxAppendToBodyExampleComponent, ComboboxWithRemoveValueExampleComponent]
})
export class ComboboxDocsComponent {}
