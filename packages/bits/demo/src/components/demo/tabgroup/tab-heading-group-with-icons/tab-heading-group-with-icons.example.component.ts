import { ChangeDetectorRef, Component } from "@angular/core";

@Component({
    selector: "nui-tab-heading-group-with-icons-example",
    templateUrl: "./tab-heading-group-with-icons.example.component.html",
})
export class TabHeadingGroupWithIconsExampleComponent {
    public currentTabId: string;

    public tabsetContent = [
        {
            id: "1",
            title: $localize`Tab 1`,
            icon: {
                name: "gear",
                disabledColor: "disabled-gray",
                inactiveColor: "gray",
                activeColor: "black",
            },
            isDisabled: false,
        },
        {
            id: "2",
            title: $localize`Tab 2`,
            icon: {
                name: "check",
                disabledColor: "disabled-gray",
                inactiveColor: "gray",
                activeColor: "black",
            },
            isDisabled: false,
        },
        {
            id: "3",
            title: $localize`Tab 3`,
            icon: {
                name: "acknowledge",
                disabledColor: "disabled-gray",
                inactiveColor: "gray",
                activeColor: "black",
            },
            isDisabled: true,
        },
        {
            id: "4",
            title: $localize`Tab 4`,
            icon: {
                name: "add",
                disabledColor: "disabled-gray",
                inactiveColor: "gray",
                activeColor: "black",
            },
            isDisabled: false,
        },
    ];

    constructor(private changeDetector: ChangeDetectorRef) {}

    public updateContent(tabId: string) {
        this.currentTabId = tabId;
        this.changeDetector.detectChanges();
    }
}
