import { Injectable } from "@angular/core";
import { LoggerService } from "@nova-ui/bits";
import isFunction from "lodash/isFunction";
import { EMPTY, Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { DashboardComponent } from "../components/dashboard/dashboard.component";
import { IConfiguratorSource } from "../configurator/services/types";
import { WidgetRemovalOperation } from "../types";

@Injectable({ providedIn: "root" })
export class WidgetRemovalService {

    constructor(private logger: LoggerService) {
    }

    public handleRemove(dashboardComponent: DashboardComponent,
                        widgetId: string,
                        configuratorSource: IConfiguratorSource,
                        tryRemove?: WidgetRemovalOperation) {
        // TODO: Handle the case when tryRemove is undefined
        // @ts-ignore
        return this.tryRemove(tryRemove, widgetId, configuratorSource).pipe(
            this.updateDashboard(dashboardComponent)
        );
    }

    private tryRemove(tryRemove: WidgetRemovalOperation, widgetId: string, configuratorSource: IConfiguratorSource) {
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

    private updateDashboard = (dashboardComponent: DashboardComponent) =>
        (source: Observable<string>) =>
            new Observable<void>(observer =>
                source.subscribe((widgetId: string) => {
                    if (widgetId) {
                        dashboardComponent.removeWidget(widgetId);
                    }
                    observer.next();
                }))
}
