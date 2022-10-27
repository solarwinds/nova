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

import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { BreadcrumbItem, BreadcrumbStateService } from "@nova-ui/bits";

@Component({
    selector: "nui-breadcrumb-visual-test",
    templateUrl: "./breadcrumb-visual-test.component.html",
})
export class BreadcrumbVisualTestComponent implements OnInit, OnDestroy {
    public breadcrumbSource: Array<BreadcrumbItem>;
    private routerSubscription: Subscription;

    constructor(
        private router: Router,
        private routerState: ActivatedRoute,
        private breadcrumbStateService: BreadcrumbStateService
    ) {}

    ngOnInit() {
        this.breadcrumbSource = this.breadcrumbStateService.getBreadcrumbState(
            this.routerState
        );
        this.routerSubscription = this.breadcrumbStateService
            .getNavigationSubscription(this.router)
            .subscribe(
                () =>
                    (this.breadcrumbSource =
                        this.breadcrumbStateService.getBreadcrumbState(
                            this.routerState
                        ))
            );
    }

    public onNavigation(routerState: string): void {
        this.router.navigate([routerState]);
    }

    public relativeNavigation(routerState: string): void {
        this.router.navigate([routerState], { relativeTo: this.routerState });
    }

    ngOnDestroy() {
        this.routerSubscription.unsubscribe();
    }
}

@Component({
    selector: "nui-breadcrumb-first-level",
    template: ` <div class="container">
        <div>
            Et harum quidem rerum facilis est et expedita distinctio. Nam libero
            tempore, cum soluta nobis est eligendi optio, cumque nihil impedit,
            quo minus id, quod maxime placeat, facere possimus, omnis voluptas
            assumenda est, omnis dolor repellendus. Temporibus autem quibusdam
            et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut
            et voluptates repudiandae sint et molestiae non recusandae. Itaque
            earum rerum hic tenetur a sapiente delectus, ut aut reiciendis
            voluptatibus maiores alias consequatur aut perferendis doloribus
            asperiores repellat.
        </div>
        <button id="nui-demo-breadcrumb-show-third-view" (click)="goNext()">
            Show second level
        </button>
        <router-outlet></router-outlet>
    </div>`,
})
export class BreadcrumbFirstSubviewLevelComponent {
    constructor(private router: Router, private routerState: ActivatedRoute) {}

    goNext() {
        this.router.navigate(["second-subroute"], {
            relativeTo: this.routerState,
        });
    }
}

@Component({
    selector: "nui-breadcrumb-second-level",
    template: ` <div>
        <p>Some data here</p>
    </div>`,
})
export class BreadcrumbSecondSubviewLevelComponent {}
