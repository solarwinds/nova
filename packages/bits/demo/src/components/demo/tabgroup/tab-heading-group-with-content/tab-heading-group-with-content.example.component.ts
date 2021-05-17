import { ChangeDetectorRef, Component, Input } from "@angular/core";


@Component({
    selector: "nui-tab-heading-group-with-content-example",
    templateUrl: "./tab-heading-group-with-content.example.component.html",
    styleUrls: ["./tab-heading-group-with-content.example.component.less"],
})
export class TabHeadingGroupWithContentExampleComponent {

    @Input() public icon: boolean = false;

    public currentTabId: string;

    public tabsetContent = [
        {
            id: "1",
            title: $localize `Tab with really long content`,
            icon: {
                name: "gear",
                disabledColor: "disabled-gray",
                inactiveColor: "gray",
                activeColor: "black",
            },
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu.",
            isDisabled: false,
        },
        {
            id: "2",
            title: $localize `Tab 2`,
            icon: {
                name: "check",
                disabledColor: "disabled-gray",
                inactiveColor: "gray",
                activeColor: "black",
            },
            content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed erat eget
                     velit elementum ultricies vitae vel mauris. Nam egestas fermentum ex id interdum.
                     In in dignissim libero. Suspendisse commodo pellentesque purus, sit amet tempor enim
                     viverra at. Nam cursus sed lectus imperdiet imperdiet. Pellentesque vel tincidunt dolor.
                     Aliquam bibendum ac lectus id consectetur. Sed eget purus id dolor ultricies rhoncus.
                     Vivamus ac magna nulla. Nam vel pellentesque ex. Nunc eu metus euismod, dignissim lorem id,
                     pulvinar tellus. Vestibulum sed nisi quis sapien varius vehicula. Proin dictum eu mauris quis aliquet.
                     Vestibulum accumsan eros ac mollis hendrerit. Aenean aliquet sem eros, sit amet ornare tellus tincidunt vitae.`,
            isDisabled: false,
        },
        {
            id: "3",
            title: $localize `Tab 3`,
            icon: {
                name: "acknowledge",
                disabledColor: "disabled-gray",
                inactiveColor: "gray",
                activeColor: "black",
            },
            content: "Should not be visible because the tab is disabled",
            isDisabled: true,
        },
        {
            id: "4",
            title: $localize `Tab 4`,
            icon: {
                name: "add",
                disabledColor: "disabled-gray",
                inactiveColor: "gray",
                activeColor: "black",
            },
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu.",
            isDisabled: false,
        }];

    constructor(private changeDetector: ChangeDetectorRef) {}

    public updateContent(tabId: string) {
        this.currentTabId = tabId;
        this.changeDetector.detectChanges();
    }
}
