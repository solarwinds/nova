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
import { NuiBusyModule } from "../../../../../../src/lib/busy/busy.module";
import { NuiCheckboxModule } from "../../../../../../src/lib/checkbox/checkbox.module";
import { NuiProgressModule } from "../../../../../../src/lib/progress/progress.module";
import { NuiButtonModule } from "../../../../../../src/lib/button/button.module";

@Component({
    selector: "nui-busy-progress-example",
    templateUrl: "./busy-progress.example.component.html",
    styleUrls: ["./busy-progress.example.component.less"],
    imports: [NuiBusyModule, NuiCheckboxModule, NuiProgressModule, NuiButtonModule]
})
export class BusyProgressExampleComponent {
    public busy: boolean;

    public switchBusy(): void {
        this.busy = !this.busy;
    }
}
