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

import { Component, ViewEncapsulation } from "@angular/core";
import { PopupAdapterModule } from "../../../../../../src/lib/popup-adapter/popup-adapter.module";
import { NuiButtonModule } from "../../../../../../src/lib/button/button.module";
import { NuiPopupModule } from "../../../../../../src/lib/popup/popup.module";
import { NgFor } from "@angular/common";
import { NuiMenuModule } from "../../../../../../src/lib/menu/menu.module";

@Component({
    selector: "nui-popup-different-directions-example",
    templateUrl: "./popup-different-directions.example.component.html",
    encapsulation: ViewEncapsulation.None,
    imports: [PopupAdapterModule, NuiButtonModule, NuiPopupModule, NgFor, NuiMenuModule]
})
export class PopupDifferentDirectionsExampleComponent {
    public icon = "caret-down";
    public itemsSource: string[] = [
        $localize`Item 1`,
        $localize`Item 2`,
        $localize`Item 3`,
        $localize`Item 4`,
    ];

    constructor() {}
}
