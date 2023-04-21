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
import { FormBuilder, Validators } from "@angular/forms";

@Component({
    selector: "nui-popup-with-custom-content-example",
    templateUrl: "./popup-with-custom-content.example.component.html",
    styleUrls: ["./popup-with-custom-content.example.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class PopupWithCustomContentComponent {
    public icon = "caret-down";
    public width = "200px";
    public itemsSource: string[] = [
        $localize`Item 1`,
        $localize`Item 2`,
        $localize`Item 3`,
        $localize`Item 4`,
    ];
    public demoFormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.demoFormGroup = this.formBuilder.group({
            checkboxGroup: this.formBuilder.control(
                [this.itemsSource[0], this.itemsSource[1], this.itemsSource[2]],
                [Validators.required, Validators.minLength(3)]
            ),
        });
    }

    public handleClick(event: MouseEvent): void {
        event.stopPropagation();
    }
}
