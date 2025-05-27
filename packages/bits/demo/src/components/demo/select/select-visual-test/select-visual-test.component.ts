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
import { FormBuilder, Validators } from "@angular/forms";

import { ISelectChangedEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-select-visual",
    templateUrl: "./select-visual-test.component.html",
    styleUrls: [
        "../select-custom-template/select-custom-template.example.component.less",
    ],
})
export class SelectVisualTestComponent {
    public isRequired = true;
    public datasetBasic = {
        items: [
            "Item 1",
            "Item 2",
            "Item 3",
            "Item 4",
            "Item 5",
            "Item 6",
            "Item 7",
            "Item 8",
            "Item 9",
            "Item 10",
        ],
        selectedItem: "",
    };
    public myForm;
    public datasetDisabled = {
        items: ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
        selectedItem: "Item 1",
    };

    public datasetSeparator = {
        itemsInGroups: [
            {
                header: $localize`Group 1 header`,
                items: [
                    $localize`Item 1`,
                    $localize`Item 2`,
                    $localize`Item 3`,
                ],
            },
            {
                header: $localize`Group 2 header`,
                items: [
                    $localize`Item 4`,
                    $localize`Item 5`,
                    $localize`Item 6`,
                ],
            },
            {
                header: $localize`Group 3 header`,
                items: [
                    $localize`Item 7`,
                    $localize`Item 8`,
                    $localize`Item 9`,
                ],
            },
        ],
        selectedItem: $localize`Item 1`,
    };
    public datasetCustom = {
        displayValue: "value",
        selectedItem: "",
        items: [
            {
                name: "item_1",
                value: "Bonobo",
                icon: "severity_ok",
                progress: 78,
            },
            {
                name: "item_2",
                value: "Zelda",
                icon: "severity_ok",
                progress: 66,
            },
            {
                name: "item_3",
                value: "Max",
                icon: "severity_critical",
                progress: 7,
            },
            {
                name: "item_4",
                value: "Apple",
                icon: "severity_ok",
                progress: 24,
            },
            {
                name: "item_5",
                value: "Quartz",
                icon: "severity_warning",
                progress: 89,
            },
        ],
    };

    constructor(private formBuilder: FormBuilder) {
        this.myForm = this.formBuilder.group({
            item: this.formBuilder.control(this.datasetBasic.selectedItem, [
                Validators.required,
            ]),
        });
    }

    public onSubmit(): void {
        if (!this.myForm.valid) {
            // if form is invalid mark all controls as touched to trigger isInErrorState
            Object.keys(this.myForm.controls).forEach((field) => {
                const control = this.myForm.get(field);
                control?.markAsTouched({ onlySelf: true });
            });
        }
    }

    public valueChange(changedEvent: ISelectChangedEvent<string>): void {
        this.datasetBasic.selectedItem = changedEvent.newValue;
    }

    public isInErrorState(): boolean {
        return this.isRequired && !this.datasetBasic.selectedItem;
    }
}
