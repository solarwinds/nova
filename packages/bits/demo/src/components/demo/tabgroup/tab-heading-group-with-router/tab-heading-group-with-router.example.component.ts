import { Component, Input, OnDestroy } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";


@Component({
    selector: "nui-tab-heading-group-with-router-example",
    templateUrl: "./tab-heading-group-with-router.example.component.html",
    styleUrls: ["./tab-heading-group-with-router.example.component.less"],
})
export class TabHeadingGroupWithRouterExampleComponent implements OnDestroy {
    public currentTabRoute: string;

    @Input() public icon: boolean = false;

    constructor(private _router: Router) {}

    private routeSubscription = this._router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
            const path: string[] = event.urlAfterRedirects.split("/");
            this.currentTabRoute = path[path.length - 1];
        }
    });

    public tabsetContent = [
        {
            id: "tab-settings",
            title: $localize `Settings`,
            icon: {
                name: "gear",
                inactiveColor: "gray",
                activeColor: "black",
            },
        },
        {
            id: "tab-statistics",
            title: $localize `Statistics`,
            icon: {
                name: "check",
                inactiveColor: "gray",
                activeColor: "black",
            },
        },
        {
            id: "tab-about",
            title: $localize `About`,
            icon: {
                name: "add",
                inactiveColor: "gray",
                activeColor: "black",
            },
        }];

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }
}


