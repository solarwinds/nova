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

import { ChangeDetectorRef, Component } from "@angular/core";

@Component({
    selector: "nui-tab-heading-group-horizontal-example",
    templateUrl: "./tab-heading-group-horizontal.example.component.html",
    styleUrls: ["./tab-heading-group-horizontal.example.component.less"],
})
export class TabHeadingGroupHorizontalExampleComponent {
    public currentTabId: string;

    public tabsetContent = [
        {
            id: "1",
            title: $localize`Tab with really long content`,
            isDisabled: false,
        },
        {
            id: "2",
            title: $localize`Tab 2`,
            isDisabled: false,
        },
        {
            id: "3",
            title: $localize`Tab 3`,
            isDisabled: true,
        },
        {
            id: "4",
            title: $localize`Tab 4`,
            isDisabled: false,
        },
    ];

    constructor(private changeDetector: ChangeDetectorRef) {}

    public updateContent(tabId: string) {
        this.currentTabId = tabId;
        this.changeDetector.detectChanges();
    }
}
