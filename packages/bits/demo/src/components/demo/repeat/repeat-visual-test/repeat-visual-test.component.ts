import { Component } from "@angular/core";

@Component({
    selector: "nui-repeat-visual-test",
    templateUrl: "./repeat-visual-test.component.html",
})
export class RepeatVisualTestComponent {
    public colors = [
        { color: $localize`blue` },
        { color: $localize`green` },
        { color: $localize`yellow` },
        { color: $localize`cyan` },
        { color: $localize`magenta` },
        { color: $localize`black` },
    ];

    public tabs = [
        {
            id: "tab1",
            title: "No Content",
        },
        {
            id: "tab2",
            title: "Repeat VScroll",
        },
    ];
    public currentTabId = this.tabs[0].id;

    private colorIndex: number = 1;

    public addNewColor(): void {
        this.colors.push(
            { color: `new color ${this.colorIndex++}` }
        );
    }

    // using css display rule instead of *ngIf to test RepeatComponent's IntersectionObserver
    // (*ngIf would instantiate the test component only when the tab is selected instead of immediately on page load)
    public getTabDisplayMode = (tabId: string) => this.currentTabId === tabId ? "block" : "none";
}
