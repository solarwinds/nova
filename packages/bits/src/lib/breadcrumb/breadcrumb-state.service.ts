import { Injectable } from "@angular/core";
import { ActivatedRoute, Event, NavigationEnd, Router } from "@angular/router";
import { Observable } from "rxjs";
import { filter } from "rxjs/operators";

import { BreadcrumbItem } from "./public-api";

/**
 * @ignore
 */
@Injectable({providedIn: "root"})
export class BreadcrumbStateService {
    // Recursively fill the state for breadcrumb component using data from routes
    public getBreadcrumbState(router: Router, routerState: ActivatedRoute, url: string = "",
                              breadcrumbs: BreadcrumbItem[] = []): BreadcrumbItem[] {
        const breadcrumb: string = routerState.snapshot.data["breadcrumb"];
        const newUrl = router?.url.replace(router?.url.split("/").pop() || "", "");
        const externalUrl = routerState.snapshot.data["url"];
        const newBreadcrumbs = [...breadcrumbs, {
            title: breadcrumb,
            routerState: newUrl,
            url: externalUrl,
        }];

        return routerState.firstChild ? this.getBreadcrumbState(router, routerState.firstChild, newUrl, newBreadcrumbs) :
            newBreadcrumbs;
    }

    public getNavigationSubscription(router: Router): Observable<Event> {
        return router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        );
    }
}
