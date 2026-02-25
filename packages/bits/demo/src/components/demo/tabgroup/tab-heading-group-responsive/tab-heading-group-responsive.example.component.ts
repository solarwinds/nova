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

import { ChangeDetectorRef, Component, Input, inject } from "@angular/core";

@Component({
    selector: "nui-tab-heading-group-responsive-example",
    styles: [
        `
            .set-container-max-width {
                max-width: 1000px;
            }
        `,
    ],
    templateUrl: "./tab-heading-group-responsive.example.component.html",
    standalone: false,
})
export class TabHeadingGroupResponsiveExampleComponent {
    private changeDetector = inject(ChangeDetectorRef);

    @Input() public icon: boolean = false;

    public currentTabId: string;
    public tabsetContent: object[] = [];

    constructor() {
        this.setTabs();
    }

    public updateContent(tabId: string): void {
        this.currentTabId = tabId;
        this.changeDetector.detectChanges();
    }

    public setTabs(tabsAmount: number = 20): void {
        for (let i = 1; i < tabsAmount; i++) {
            this.tabsetContent.push({
                id: i.toString(),
                title: $localize`Tab ${i.toString()}`,
            });
        }
    }
}
