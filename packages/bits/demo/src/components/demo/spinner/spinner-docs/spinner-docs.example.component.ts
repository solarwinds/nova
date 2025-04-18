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
import { SpinnerBasicExampleComponent } from "../spinner-basic/spinner-basic.example.component";
import { SpinnerSizesExampleComponent } from "../spinner-sizes/spinner-sizes.example.component";
import { SpinnerWithTextExampleComponent } from "../spinner-with-text/spinner-with-text.example.component";
import { SpinnerDeterminateExampleComponent } from "../spinner-determinate/spinner-determinate.example.component";
import { SpinnerWithCancelExampleComponent } from "../spinner-with-cancel/spinner-with-cancel.example.component";
import { SpinnerWithDelayToggleExampleComponent } from "../spinner-with-delay-toggle/spinner-with-delay-toggle.example.component";

@Component({
    selector: "nui-spinner-docs-example",
    templateUrl: "./spinner-docs.example.component.html",
    imports: [NuiDocsModule, SpinnerBasicExampleComponent, SpinnerSizesExampleComponent, SpinnerWithTextExampleComponent, SpinnerDeterminateExampleComponent, SpinnerWithCancelExampleComponent, SpinnerWithDelayToggleExampleComponent]
})
export class SpinnerExampleComponent {}
