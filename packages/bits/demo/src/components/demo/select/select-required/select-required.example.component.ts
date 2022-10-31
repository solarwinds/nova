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

import { ISelectChangedEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-select-required-example",
    templateUrl: "./select-required.example.component.html",
})
export class SelectRequiredExampleComponent {
    public isRequired = true;
    public dataset = {
        items: [
            $localize`Element 1`,
            $localize`Element 2`,
            $localize`Element 3`,
            $localize`Element 4`,
            $localize`Element 5`,
            $localize`Element 6`,
            $localize`Element 7`,
            $localize`Element 8`,
            $localize`Element 9`,
            $localize`Element 10`,
        ],
        selectedItem: "",
    };

    constructor() {}

    public valueChange(changedEvent: ISelectChangedEvent<string>) {
        this.dataset.selectedItem = changedEvent.newValue;
    }

    public isInErrorState() {
        return this.isRequired && !this.dataset.selectedItem;
    }
}
