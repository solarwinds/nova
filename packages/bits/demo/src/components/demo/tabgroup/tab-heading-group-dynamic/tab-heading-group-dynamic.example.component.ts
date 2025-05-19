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
    selector: "nui-tab-heading-group-dynamic-example",
    templateUrl: "./tab-heading-group-dynamic.example.component.html",
    styleUrls: ["./tab-heading-group-dynamic.example.component.less"],
})
export class TabHeadingGroupDynamicExampleComponent {
    public currentTabId: string;

    public tabsetContent: any[] = [];

    constructor(private changeDetector: ChangeDetectorRef) {
        // "Dynamically" build first 2 tabs
        this.addTab();
        this.addTab();
    }

    public updateContent(tabId: string): void {
        this.currentTabId = tabId;
        this.changeDetector.detectChanges();
    }

    public addTab(): void {
        const nextIndex = this.tabsetContent.length + 1;
        this.tabsetContent.push({
            id: `${nextIndex}`,
            title: $localize`Tab ` + nextIndex,
            content: "Lorem ipsum #" + nextIndex,
        });
    }

    public popTab(): void {
        const lastIndex = this.tabsetContent.length - 1;
        if (lastIndex < 1) {
            // no sense to remove last tab
            return;
        }
        if (this.tabsetContent[lastIndex].id === this.currentTabId) {
            this.currentTabId = this.tabsetContent[lastIndex - 1].id;
        }
        this.tabsetContent.pop();
    }
}
