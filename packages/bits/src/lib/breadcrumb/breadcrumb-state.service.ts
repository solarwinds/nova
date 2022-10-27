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

import { Injectable } from "@angular/core";
import { ActivatedRoute, Event, NavigationEnd, Router } from "@angular/router";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { BreadcrumbItem } from "./public-api";

/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class BreadcrumbStateService {
    // Recursively fill the state for breadcrumb component using data from routes
    public getBreadcrumbState(
        routerState: ActivatedRoute,
        url: string = "",
        breadcrumbs: BreadcrumbItem[] = []
    ): BreadcrumbItem[] {
        const breadcrumb: string = routerState.snapshot.data["breadcrumb"];
        const newUrl = `${url}${routerState.routeConfig?.path}/`;
        const externalUrl = routerState.snapshot.data["url"];
        const newBreadcrumbs = [
            ...breadcrumbs,
            {
                title: breadcrumb,
                routerState: newUrl,
                url: externalUrl,
            },
        ];

        return routerState.firstChild
            ? this.getBreadcrumbState(
                  routerState.firstChild,
                  newUrl,
                  newBreadcrumbs
              )
            : newBreadcrumbs;
    }

    public getNavigationSubscription(router: Router): Observable<Event> {
        return router.events.pipe(
            filter((event) => event instanceof NavigationEnd)
        );
    }
}
