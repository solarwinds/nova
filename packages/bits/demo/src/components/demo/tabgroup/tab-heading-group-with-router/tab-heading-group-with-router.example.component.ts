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
    public tabsetContent = [
        {
            id: "tab-settings",
            title: $localize`Settings`,
            icon: {
                name: "gear",
                inactiveColor: "gray",
                activeColor: "black",
            },
        },
        {
            id: "tab-statistics",
            title: $localize`Statistics`,
            icon: {
                name: "check",
                inactiveColor: "gray",
                activeColor: "black",
            },
        },
        {
            id: "tab-about",
            title: $localize`About`,
            icon: {
                name: "add",
                inactiveColor: "gray",
                activeColor: "black",
            },
        },
    ];
    private routeSubscription = this._router?.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
            const path: string[] = event.urlAfterRedirects.split("/");
            this.currentTabRoute = path[path.length - 1];
        }
    });

    constructor(private _router: Router) {}

    public ngOnDestroy(): void {
        this.routeSubscription?.unsubscribe();
    }
}
