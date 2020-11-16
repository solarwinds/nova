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
            title: $localize `Tab with really long content`,
            isDisabled: false,
        },
        {
            id: "2",
            title: $localize `Tab 2`,
            isDisabled: false,
        },
        {
            id: "3",
            title: $localize `Tab 3`,
            isDisabled: true,
        },
        {
            id: "4",
            title: $localize `Tab 4`,
            isDisabled: false,
        }];

        constructor(private changeDetector: ChangeDetectorRef) {}

        public updateContent(tabId: string) {
            this.currentTabId = tabId;
            this.changeDetector.detectChanges();
        }
}
