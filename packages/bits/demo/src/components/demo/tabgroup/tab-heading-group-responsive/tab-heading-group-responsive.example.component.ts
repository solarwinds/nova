import { ChangeDetectorRef, Component, Input } from "@angular/core";

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
})
export class TabHeadingGroupResponsiveExampleComponent {
    @Input() public icon: boolean = false;

    public currentTabId: string;
    public tabsetContent: object[] = [];

    constructor(private changeDetector: ChangeDetectorRef) {
        this.setTabs();
    }

    public updateContent(tabId: string) {
        this.currentTabId = tabId;
        this.changeDetector.detectChanges();
    }

    public setTabs(tabsAmount: number = 20) {
        for (let i = 1; i < tabsAmount; i++) {
            this.tabsetContent.push({
                id: i.toString(),
                title: $localize`Tab ${i.toString()}`,
            });
        }
    }
}
