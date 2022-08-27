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

    public updateContent(tabId: string) {
        this.currentTabId = tabId;
        this.changeDetector.detectChanges();
    }

    public addTab() {
        const nextIndex = this.tabsetContent.length + 1;
        this.tabsetContent.push({
            id: `${nextIndex}`,
            title: $localize`Tab ` + nextIndex,
            content: "Lorem ipsum #" + nextIndex,
        });
    }

    public popTab() {
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
