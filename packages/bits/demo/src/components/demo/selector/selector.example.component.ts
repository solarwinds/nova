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

import { CheckboxStatus, IMenuGroup, SelectionType } from "@nova-ui/bits";

@Component({
    selector: "nui-selector-example",
    templateUrl: "./selector.example.component.html",
    standalone: false,
})
export class SelectorExampleComponent {
    public selection: SelectionType = SelectionType.None;
    public availableStatuses: IMenuGroup[] = this.getMenuItems([
        SelectionType.All,
        SelectionType.AllPages,
        SelectionType.None,
    ]);
    public checkBoxStatus: CheckboxStatus = CheckboxStatus.Unchecked;
    public appendToBody = false;

    public onSelectionChange(event: SelectionType): void {
        this.selection = event;

        switch (this.selection) {
            case SelectionType.All:
                this.checkBoxStatus = CheckboxStatus.Checked;
                this.availableStatuses = this.getMenuItems([
                    SelectionType.AllPages,
                    SelectionType.None,
                ]);
                break;
            case SelectionType.AllPages:
                this.checkBoxStatus = CheckboxStatus.Checked;
                this.availableStatuses = this.getMenuItems([
                    SelectionType.All,
                    SelectionType.None,
                ]);
                break;
            case SelectionType.None:
            case SelectionType.UnselectAll:
                this.checkBoxStatus = CheckboxStatus.Unchecked;
                this.availableStatuses = this.getMenuItems([
                    SelectionType.All,
                    SelectionType.AllPages,
                ]);
                break;
        }
    }

    public makeIndeterminate(): void {
        this.checkBoxStatus = CheckboxStatus.Indeterminate;
        this.selection = SelectionType.None;
    }

    public makeAppendedToBody(): void {
        this.appendToBody = true;
    }

    public getMenuItems(arr: SelectionType[]): IMenuGroup[] {
        const resultArr: IMenuGroup[] = [
            {
                itemsSource: [],
            },
        ];
        arr.map((element: SelectionType) => {
            resultArr[0].itemsSource.push({ value: element, title: element });
        });
        return resultArr;
    }
}
