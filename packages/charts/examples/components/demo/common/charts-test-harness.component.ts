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

import { Component, OnDestroy } from "@angular/core";

import { ThemeSwitchService } from "@nova-ui/bits";

@Component({
    selector: "charts-test-harness",
    templateUrl: "./charts-test-harness.component.html",
    host: { class: "charts-test-harness" },
})
export class ChartsTestHarnessComponent implements OnDestroy {
    public originalWithRefreshRoute: boolean;

    constructor(public themeSwitcher: ThemeSwitchService) {
        // disable route refreshing because the theme service currently always reverts to
        // the light theme on route refresh unless route.data.showThemeSwitcher is 'true'
        this.originalWithRefreshRoute = this.themeSwitcher.withRefreshRoute;
        this.themeSwitcher.withRefreshRoute = false;
    }

    public ngOnDestroy(): void {
        this.themeSwitcher.withRefreshRoute = this.originalWithRefreshRoute;
    }
}
