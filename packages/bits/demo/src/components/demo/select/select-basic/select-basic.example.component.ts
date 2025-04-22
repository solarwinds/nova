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

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "nui-select-basic-example",
    templateUrl: "./select-basic.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false,
})
export class SelectBasicExampleComponent {
    public dataset = {
        items: [
            $localize`Item 1`,
            $localize`Item 2`,
            $localize`Item 3`,
            $localize`Item 4`,
            $localize`Item 5`,
            $localize`Item 6`,
            $localize`Item 7`,
            $localize`Item 8`,
            $localize`Item 9`,
            $localize`Item 10`,
            $localize`Item 11`,
            $localize`Item 12`,
            $localize`Item 13`,
            $localize`Item 14`,
            $localize`Item 15`,
            $localize`Item 16`,
            $localize`Item 17`,
            $localize`Item 18`,
            $localize`Item 19`,
            $localize`Item 20`,
        ],
    };

    constructor() {}
}
