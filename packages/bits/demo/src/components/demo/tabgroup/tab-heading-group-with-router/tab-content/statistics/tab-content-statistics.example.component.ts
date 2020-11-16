import { Component, Input } from "@angular/core";

@Component({
    selector: "nui-content-statistics-example",
    templateUrl: "./tab-content-statistics.example.component.html",
})
export class TabContentStatisticsExampleComponent {
    public tabTitle: string = "Statistics Options";

    public content: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed erat eget
    velit elementum ultricies vitae vel mauris. Nam egestas fermentum ex id interdum.
    In in dignissim libero. Suspendisse commodo pellentesque purus, sit amet tempor enim`;

    @Input() public isFirstOn: boolean = false;
    @Input() public isSecondOn: boolean = true;
    @Input() public isThirdOn: boolean = false;
}
