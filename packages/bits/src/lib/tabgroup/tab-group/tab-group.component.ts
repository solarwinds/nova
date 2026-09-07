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

import {
    AfterViewInit,
    AfterContentInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    ViewEncapsulation,
} from "@angular/core";

import { KEYBOARD_CODE } from "../../../constants/keycode.constants";
import { TabComponent } from "../tab/tab.component";

// <example-url>./../examples/index.html#/tabgroup</example-url>
/** @ignore */
@Component({
    selector: "nui-tab-group",
    templateUrl: "./tab-group.component.html",
    host: {
        "(window:resize)": "checkTraverse()",
    },
    styleUrls: ["./tab-group.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class TabGroupComponent
    implements OnDestroy, AfterViewInit, AfterContentInit
{
    /** If true tabs will be placed vertically */
    @Input()
    get vertical(): boolean {
        return Boolean(this._vertical);
    }

    set vertical(value: boolean) {
        this._vertical = value;
    }

    public tabs: TabComponent[] = [];
    public leftTraverseEnabled = true;
    public rightTraverseEnabled = false;
    public hasTraverse = false;

    private traverseButtonsWidth = 60;
    private traverseStepSize = 50;

    protected isDestroyed: boolean;
    protected _vertical: boolean;

    constructor(
        private el: ElementRef,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    public ngAfterViewInit(): void {
        this.checkTraverse();
    }

    public ngAfterContentInit(): void {
        this.setInitialActiveTab();
    }

    private setInitialActiveTab(): void {
        const activeTab = this.tabs.find((tab) => tab.active);
        const firstEnabledTab = this.tabs.find((tab) => !tab.disabled);

        if (activeTab && !activeTab.disabled) {
            return;
        }

        this.tabs.forEach((tab) => {
            if (tab.active && tab !== firstEnabledTab) {
                tab.active = false;
            }
        });

        if (firstEnabledTab) {
            this.selectTab(firstEnabledTab);
        }
    }

    public checkTraverse(): void {
        this.hasTraverse = this.allowTraverse();
        this.changeDetectorRef.detectChanges();
        if (!this.hasTraverse) {
            this.setNewShift("0px");
        }
    }

    public addTab(tab: TabComponent): void {
        this.tabs.push(tab);
        tab.active =
            this.tabs.length === 1 && typeof tab.active === "undefined";
    }

    public selectTab(selectedTab: TabComponent): void {
        if (!selectedTab.disabled) {
            selectedTab.active = true;
            this.tabs.forEach((tab: TabComponent) => {
                if (tab !== selectedTab) {
                    tab.active = false;
                }
            });
        }
    }

    public onKeyDown(event: KeyboardEvent): void {
        const tabElement = (event.target as HTMLElement)?.closest?.(
            "[role='tab']"
        ) as HTMLElement;
        const tabElements = Array.from(
            this.el.nativeElement.querySelectorAll("[role='tab']")
        ) as HTMLElement[];
        const currentIndex = tabElements.indexOf(tabElement);

        if (currentIndex < 0) {
            return;
        }

        const isForwardKey =
            (!this.vertical && event.code === KEYBOARD_CODE.ARROW_RIGHT) ||
            (this.vertical && event.code === KEYBOARD_CODE.ARROW_DOWN);
        const isBackwardKey =
            (!this.vertical && event.code === KEYBOARD_CODE.ARROW_LEFT) ||
            (this.vertical && event.code === KEYBOARD_CODE.ARROW_UP);
        let nextIndex = -1;

        if (isForwardKey) {
            nextIndex = this.findEnabledTabIndex(currentIndex, 1);
        } else if (isBackwardKey) {
            nextIndex = this.findEnabledTabIndex(currentIndex, -1);
        } else if (event.code === KEYBOARD_CODE.HOME) {
            nextIndex = this.findEnabledTabIndex(-1, 1);
        } else if (event.code === KEYBOARD_CODE.END) {
            nextIndex = this.findEnabledTabIndex(tabElements.length, -1);
        }

        if (nextIndex >= 0) {
            event.preventDefault();
            tabElements[nextIndex].focus();
        }
    }

    public allowTraverse(): boolean {
        const holderSize = this.getElementSize("nui-tabs__holder");
        const contentSize = this.getElementSize("nui-tabs__container");
        if (this.vertical) {
            return false;
        }
        return holderSize + this.traverseButtonsWidth <= contentSize;
    }

    public traverseRight(): void {
        const margin = this.getCurrentShift();
        if (this.isTraverseRightAllowed(margin)) {
            const traverseStep =
                Math.abs(this.getNumberFromPixels(margin)) <
                this.traverseStepSize
                    ? Math.abs(this.getNumberFromPixels(margin))
                    : this.traverseStepSize;
            this.setNewShift(this.addPixels(margin, traverseStep));
            this.rightTraverseEnabled = this.isTraverseRightAllowed(
                this.addPixels(margin, traverseStep)
            );
            this.leftTraverseEnabled = this.isTraverseLeftAllowed(
                this.addPixels(margin, traverseStep)
            );
        }
    }

    public traverseLeft(): void {
        const margin = this.getCurrentShift();
        if (this.isTraverseLeftAllowed(margin)) {
            const tabsSize = this.getElementSize("nui-tabs__container");
            const tabHolderSize = this.getElementSize("nui-tabs__holder");
            const maxAllowedMargin = Math.abs(
                tabsSize - tabHolderSize + this.traverseButtonsWidth
            );
            const leftMarginValue = Math.abs(this.getNumberFromPixels(margin));
            const traverseStep = Math.min(
                maxAllowedMargin - leftMarginValue,
                this.traverseStepSize
            );
            this.setNewShift(this.addPixels(margin, -traverseStep));
            this.rightTraverseEnabled = this.isTraverseRightAllowed(
                this.addPixels(margin, -traverseStep)
            );
            this.leftTraverseEnabled = this.isTraverseLeftAllowed(
                this.addPixels(margin, -traverseStep)
            );
        }
    }

    private isTraverseLeftAllowed(leftMargin: string): boolean {
        const tabsSize = this.getElementSize("nui-tabs__container");
        const tabHolderSize = this.getElementSize("nui-tabs__holder");
        const maxAllowedMargin = Math.abs(
            tabsSize - tabHolderSize + this.traverseButtonsWidth
        );

        const margin = Math.abs(this.getNumberFromPixels(leftMargin));
        return margin < maxAllowedMargin;
    }

    private findEnabledTabIndex(startIndex: number, direction: 1 | -1): number {
        const tabCount = this.tabs.length;
        let index = startIndex;

        for (let offset = 0; offset < tabCount; offset++) {
            index = (index + direction + tabCount) % tabCount;
            if (!this.tabs[index].disabled) {
                return index;
            }
        }

        return -1;
    }

    private isTraverseRightAllowed(margin: string): boolean {
        return this.getNumberFromPixels(margin) < 0;
    }

    private getElementSize(selector: string): number {
        return this.el.nativeElement.querySelector("." + selector).offsetWidth;
    }

    private getNumberFromPixels(pixels: string): number {
        return pixels.indexOf("px")
            ? Number(pixels.substring(0, pixels.indexOf("px")))
            : 0;
    }

    private getCurrentShift(): string {
        return this.el.nativeElement.querySelector(".nui-tabs__container").style
            .marginLeft;
    }

    private setNewShift(newShift: string): void {
        this.el.nativeElement.querySelector(
            ".nui-tabs__container"
        ).style.marginTop = "0px";
        this.el.nativeElement.querySelector(
            ".nui-tabs__container"
        ).style.marginLeft = newShift;
    }

    private addPixels(currentValue: string, increment: number): string {
        const value = this.getNumberFromPixels(currentValue);
        return value + increment + "px";
    }

    public ngOnDestroy(): void {
        this.isDestroyed = true;
    }
}
