import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    ViewEncapsulation,
} from "@angular/core";

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
})
export class TabGroupComponent implements OnDestroy, AfterViewInit {
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

    ngAfterViewInit() {
        this.checkTraverse();
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

    ngOnDestroy(): void {
        this.isDestroyed = true;
    }
}
