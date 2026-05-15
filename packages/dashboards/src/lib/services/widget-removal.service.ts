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
import isFunction from "lodash/isFunction";
import { EMPTY, Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { LoggerService } from "@nova-ui/bits";

import { DashboardComponent } from "../components/dashboard/dashboard.component";
import { IConfiguratorSource } from "../configurator/services/types";
import { WidgetRemovalOperation } from "../configurator/services/types";

@Injectable({ providedIn: "root" })
export class WidgetRemovalService {
    constructor(private logger: LoggerService) {}

    public handleRemove(
        dashboardComponent: DashboardComponent,
        widgetId: string,
        configuratorSource: IConfiguratorSource,
        tryRemove?: WidgetRemovalOperation
    ): Observable<void> {
        // TODO: Handle the case when tryRemove is undefined
        // @ts-ignore
        return this.tryRemove(tryRemove, widgetId, configuratorSource).pipe(
            this.updateDashboard(dashboardComponent)
        );
    }

    private tryRemove(
        tryRemove: WidgetRemovalOperation,
        widgetId: string,
        configuratorSource: IConfiguratorSource
    ) {
        if (isFunction(tryRemove)) {
            return tryRemove(widgetId, configuratorSource).pipe(
                catchError((err: any) => {
                    this.logger.error(err);
                    return EMPTY;
                })
            );
        } else {
            return of(widgetId);
        }
    }

    private updateDashboard =
        (dashboardComponent: DashboardComponent) =>
        (source: Observable<string>) =>
            new Observable<void>((observer) =>
                source.subscribe((widgetId: string) => {
                    if (widgetId) {
                        dashboardComponent.removeWidget(widgetId);
                    }
                    observer.next();
                })
            );
}
