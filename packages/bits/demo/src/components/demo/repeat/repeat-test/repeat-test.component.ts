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
import { NuiTabsModule } from "../../../../../../src/lib/tabgroup/tabs.module";
import { NgFor } from "@angular/common";
import { RepeatVirtualScrollComponent } from "../repeat-virtual-scroll/repeat-virtual-scroll.component";
import { RepeatMultiSelectionExampleComponent } from "../repeat-multi-selection/repeat-multi-selection.example.component";
import { RepeatDisabledMultiSelectionExampleComponent } from "../repeat-disabled-multi-selection/repeat-disabled-multi-selection.example.component";
import { RepeatSingleSelectionModeExampleComponent } from "../repeat-single-selection-mode/repeat-single-selection-mode.example.component";
import { NuiButtonModule } from "../../../../../../src/lib/button/button.module";
import { RepeatRadioSelectionModeExampleComponent } from "../repeat-radio-selection-mode/repeat-radio-selection-mode.example.component";
import { RepeatRadioWithNonRequiredSelectionModeExampleComponent } from "../repeat-radio-with-non-required-selection-mode/repeat-radio-with-non-required-selection-mode.example.component";
import { RepeatSingleWithRequiredSelectionModeExampleComponent } from "../repeat-single-with-required-selection-mode/repeat-single-with-required-selection-mode.example.component";

@Component({
    selector: "nui-repeat-test",
    templateUrl: "./repeat-test.component.html",
    imports: [NuiTabsModule, NgFor, RepeatVirtualScrollComponent, RepeatMultiSelectionExampleComponent, RepeatDisabledMultiSelectionExampleComponent, RepeatSingleSelectionModeExampleComponent, NuiButtonModule, RepeatRadioSelectionModeExampleComponent, RepeatRadioWithNonRequiredSelectionModeExampleComponent, RepeatSingleWithRequiredSelectionModeExampleComponent]
})
export class RepeatTestComponent {
    public colors = [
        { color: $localize`blue` },
        { color: $localize`green` },
        { color: $localize`yellow` },
        { color: $localize`cyan` },
        { color: $localize`magenta` },
        { color: $localize`black` },
    ];

    public readonly tabs = [
        {
            id: "tab1",
            title: "No Content",
        },
        {
            id: "tab2",
            title: "Repeat VScroll",
        },
    ];

    public currentTabId: string = this.tabs[0].id;

    private colorIndex: number = 1;

    public addNewColor(): void {
        this.colors.push({ color: `new color ${this.colorIndex++}` });
    }

    // using css display rule instead of *ngIf to test RepeatComponent's IntersectionObserver
    // (*ngIf would instantiate the test component only when the tab is selected instead of immediately on page load)
    public getTabDisplayMode = (tabId: string): string =>
        this.currentTabId === tabId ? "block" : "none";
}
