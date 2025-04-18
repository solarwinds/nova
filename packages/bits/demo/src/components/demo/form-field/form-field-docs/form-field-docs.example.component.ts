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

import { FormFieldComponent } from "@nova-ui/bits";
import { NuiDocsModule } from "../../../../../../src/lib/docs/docs.module";
import { FormFieldBasicExampleComponent } from "../basic/basic-form-field.example.component";
import { FormFieldBasicReactiveExampleComponent } from "../basic-reactive/basic-reactive-form-field.example.component";
import { FormFieldBasicReactiveCustomValidationExampleComponent } from "../basic-reactive/basic-reactive-form-field-custom-validation.example.component";
import { FormFieldComplexExampleComponent } from "../complex/form-field-complex.example.component";
import { FormFieldWithHTMLExampleComponent } from "../html-as-info/html-as-info-in-form-field.example.component";
import { FormFieldBasicHintExampleComponent } from "../basic-hint/form-field-hint.example.component";
import { FormFieldDynamicDisablingExampleComponent } from "../dynamic-disabling/form-field-dynamic-disabling.example.component";
import { NestedFormsAsComponentExampleComponent } from "../nested-forms-as-component/nested-forms-as-component.example.component";
import { FormFieldInFormExampleComponent } from "../in-form/in-form-form-field.example.component";
import { FormFieldValidationTriggeringxampleComponent } from "../form-field-validation-triggering/form-field-validation-triggering.example.component";

@Component({
    selector: "nui-form-field-docs-example",
    templateUrl: "./form-field-docs.example.component.html",
    imports: [NuiDocsModule, FormFieldBasicExampleComponent, FormFieldBasicReactiveExampleComponent, FormFieldBasicReactiveCustomValidationExampleComponent, FormFieldComplexExampleComponent, FormFieldWithHTMLExampleComponent, FormFieldBasicHintExampleComponent, FormFieldDynamicDisablingExampleComponent, NestedFormsAsComponentExampleComponent, FormFieldInFormExampleComponent, FormFieldValidationTriggeringxampleComponent]
})
export class FormFieldExampleComponent {
    getItemConfigKey(key: keyof FormFieldComponent): string {
        return key;
    }
}
