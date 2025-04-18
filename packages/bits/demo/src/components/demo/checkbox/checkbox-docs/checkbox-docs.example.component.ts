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
import { CheckboxBasicExampleComponent } from "../checkbox-basic/checkbox-basic.example.component";
import { CheckboxHelpHintExampleComponent } from "../checkbox-helphint/checkbox-helphint.example.component";
import { CheckboxDisabledExampleComponent } from "../checkbox-disabled/checkbox-disabled.example.component";
import { CheckboxIndeterminateExampleComponent } from "../checkbox-indeterminate/checkbox-indeterminate.example.component";
import { CheckboxOutputExampleComponent } from "../checkbox-output/checkbox-output.example.component";
import { NuiMessageModule } from "../../../../../../src/lib/message/message.module";
import { CheckboxInFormExampleComponent } from "../checkbox-in-form/checkbox-in-form.example.component";

@Component({
    selector: "nui-checkbox-docs-example",
    templateUrl: "./checkbox-docs.example.component.html",
    imports: [NuiDocsModule, CheckboxBasicExampleComponent, CheckboxHelpHintExampleComponent, CheckboxDisabledExampleComponent, CheckboxIndeterminateExampleComponent, CheckboxOutputExampleComponent, NuiMessageModule, CheckboxInFormExampleComponent]
})
export class CheckboxExampleComponent {}
