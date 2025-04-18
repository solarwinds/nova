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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    NgZone,
    OnDestroy,
    Output,
    QueryList,
    ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";

import { TabHeadingComponent } from "../tab-heading/tab-heading.component";

// <example-url>./../examples/index.html#/tabgroup</example-url>
@Component({
    selector: "nui-tab-heading-group",
    templateUrl: "./tab-heading-group.component.html",
    styleUrls: ["./tab-heading-group.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { role: "tablist" },
    standalone: false
})
export class TabHeadingGroupComponent implements OnDestroy, AfterViewInit {
    @ContentChildren(TabHeadingComponent) _tabs: QueryList<TabHeadingComponent>;

    @ViewChild("resizableArea") resizableArea: ElementRef;

    /** If true tabs will be placed vertically */
    @Input() public vertical: boolean;

    /**
     * Emits id of selected tab
     */
    @Output() selected: EventEmitter<string> = new EventEmitter();

    @HostBinding("class.vertical") get isVertical(): boolean {
        return this.vertical;
    }

    public leftTraverseEnabled = true;
    public rightTraverseEnabled = false;
    public hasTraverse = false;

    private _traverseButtonsWidth = 60;
    private _traverseStepSize = 50;
    private _ro: ResizeObserver;
    private _tabSelectedSubscriptions: Subscription[] = [];
    private _changesSubscription: Subscription;

    constructor(
        private el: ElementRef,
        private changeDetectorRef: ChangeDetectorRef,
        private ngZone: NgZone
    ) {}

    public ngAfterViewInit(): void {
        // Observing the size of the component to check traverse
        this._ro = new ResizeObserver((entries) =>
            entries.forEach(() => this.checkTraverse())
        );
        this.ngZone.runOutsideAngular(() => {
            this._ro.observe(this.resizableArea.nativeElement);
            this._ro.observe(this.el.nativeElement);
        });

        // Making the first tab in group active by default
        this.setActiveTab();
        this.subscribeToSelection();

        this._changesSubscription = this._tabs.changes.subscribe(
            (changedTabs: any) => {
                this.setActiveTab();
                this._tabSelectedSubscriptions.forEach((sub) =>
                    sub.unsubscribe()
                );
                this._tabSelectedSubscriptions = [];
                this.subscribeToSelection();
            }
        );
    }

    public setActiveTab(): void {
        if (this._tabs.length && !this.getActiveTab()) {
            this._tabs.first.active = true;
            this.selected.emit(this._tabs.first.tabId);
        }
    }

    public getActiveTab(): TabHeadingComponent {
        return this._tabs.filter((tab: TabHeadingComponent) => tab.active)[0];
    }

    public checkTraverse(): void {
        this.hasTraverse = this.allowTraverse();
        this.changeDetectorRef.detectChanges();
        if (!this.hasTraverse) {
            this.setNewShift("0px");
        }
    }

    public allowTraverse(): boolean {
        const holderSize = this.getElementSize("nui-tab-headings__holder");
        const contentSize = this.getElementSize("nui-tab-headings__container");
        if (this.vertical) {
            return false;
        }
        return holderSize + this._traverseButtonsWidth <= contentSize;
    }

    public traverseRight(): void {
        const margin = this.getCurrentShift();
        if (this.isTraverseRightAllowed(margin)) {
            const traverseStep =
                Math.abs(this.getNumberFromPixels(margin)) <
                this._traverseStepSize
                    ? Math.abs(this.getNumberFromPixels(margin))
                    : this._traverseStepSize;
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
            const tabsSize = this.getElementSize("nui-tab-headings__container");
            const tabHolderSize = this.getElementSize(
                "nui-tab-headings__holder"
            );
            const maxAllowedMargin = Math.abs(
                tabsSize - tabHolderSize + this._traverseButtonsWidth
            );
            const leftMarginValue = Math.abs(this.getNumberFromPixels(margin));
            const traverseStep = Math.min(
                maxAllowedMargin - leftMarginValue,
                this._traverseStepSize
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

    // Subscribing to all tabs and their 'selected' event. Once the event has been fired the origin tab becomes active.
    private subscribeToSelection() {
        this._tabs.forEach((tab: TabHeadingComponent) => {
            this._tabSelectedSubscriptions.push(
                tab.selected.subscribe((currentTab: TabHeadingComponent) => {
                    if (!currentTab.active && !currentTab.disabled) {
                        // Making all elements in array inactive to make than current one active
                        this._tabs.forEach(
                            (tabHeading: TabHeadingComponent) => {
                                tabHeading.active = false;
                            }
                        );
                        currentTab.active = true;
                        this.changeDetectorRef.markForCheck();
                        this.changeDetectorRef.detectChanges();
                        this.selected.emit(currentTab.tabId);
                    }
                })
            );
        });
    }

    private isTraverseLeftAllowed(leftMargin: string): boolean {
        const tabsSize = this.getElementSize("nui-tab-headings__container");
        const tabHolderSize = this.getElementSize("nui-tab-headings__holder");
        const maxAllowedMargin = Math.abs(
            tabsSize - tabHolderSize + this._traverseButtonsWidth
        );

        const margin = Math.abs(this.getNumberFromPixels(leftMargin));
        return margin < maxAllowedMargin;
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
        return this.el.nativeElement.querySelector(
            ".nui-tab-headings__container"
        ).style.marginLeft;
    }

    private setNewShift(newShift: string): void {
        this.el.nativeElement.querySelector(
            ".nui-tab-headings__container"
        ).style.marginTop = "0px";
        this.el.nativeElement.querySelector(
            ".nui-tab-headings__container"
        ).style.marginLeft = newShift;
    }

    private addPixels(currentValue: string, increment: number): string {
        const value = this.getNumberFromPixels(currentValue);
        return value + increment + "px";
    }

    public ngOnDestroy(): void {
        this._changesSubscription.unsubscribe();
        this._tabSelectedSubscriptions.forEach((sub) => sub.unsubscribe());
        this._ro.disconnect();
    }
}
