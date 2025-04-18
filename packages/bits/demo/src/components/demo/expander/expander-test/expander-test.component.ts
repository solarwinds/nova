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

import { IMenuGroup } from "@nova-ui/bits";
import { ExpanderBasicExampleComponent } from "../expander-basic/expander-basic.example.component";
import { ExpanderTextAndIconExampleComponent } from "../expander-text-and-icon/expander-text-and-icon.example.component";
import { ExpanderCustomHeaderExampleComponent } from "../expander-custom-header/expander-custom-header.example.component";
import { ExpanderInitiallyExpandedExampleComponent } from "../expander-initially-expanded/expander-initially-expanded.example.component";
import { ExpanderOpenChangeExampleComponent } from "../expander-open-change/expander-open-change.example.component";

@Component({
    selector: "expander-test",
    templateUrl: "./expander-test.component.html",
    imports: [ExpanderBasicExampleComponent, ExpanderTextAndIconExampleComponent, ExpanderCustomHeaderExampleComponent, ExpanderInitiallyExpandedExampleComponent, ExpanderOpenChangeExampleComponent]
})
export class ExpanderTestComponent {
    public itemsSource: IMenuGroup[] = [
        {
            header: "Group 1",
            itemsSource: [
                {
                    title: $localize`Item 1`,
                    itemType: "action",
                    action: this.actionDone,
                },
                {
                    title: $localize`Item 2`,
                    itemType: "action",
                    action: (): void => alert($localize`hello`),
                },
            ],
        },
        {
            itemsSource: [{ title: "Item 3" }],
        },
    ];
    constructor() {}

    public actionDone(): void {
        console.log("Action Done");
    }
}
