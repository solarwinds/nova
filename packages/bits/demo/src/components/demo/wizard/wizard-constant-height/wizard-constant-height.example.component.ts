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
import { NuiTextboxModule } from "../../../../../../src/lib/textbox/textbox.module";
import { NuiButtonModule } from "../../../../../../src/lib/button/button.module";
import { NuiCheckboxModule } from "../../../../../../src/lib/checkbox/checkbox.module";
import { NuiRadioModule } from "../../../../../../src/lib/radio/radio.module";
import { NuiWizardModule } from "../../../../../../src/lib/wizard/wizard.module";

@Component({
    selector: "nui-wizard-constant-height-example",
    templateUrl: "./wizard-constant-height.example.component.html",
    imports: [NuiTextboxModule, NuiButtonModule, NuiCheckboxModule, NuiRadioModule, NuiWizardModule]
})
export class WizardConstantHeightExampleComponent {
    public wizardBodyHeight: string = "200px";

    public increaseHeight(): void {
        this.wizardBodyHeight = `${parseInt(this.wizardBodyHeight, 10) + 20}px`;
    }

    public decreaseHeight(): void {
        this.wizardBodyHeight = `${parseInt(this.wizardBodyHeight, 10) - 20}px`;
    }
}
