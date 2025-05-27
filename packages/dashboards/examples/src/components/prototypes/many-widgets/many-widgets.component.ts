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

import { HttpClient } from "@angular/common/http";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import keyBy from "lodash/keyBy";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

import { immutableSet } from "@nova-ui/bits";
import {
    DashboardComponent,
    DATA_SOURCE,
    IDashboard,
    IDashboardBelowFoldLazyLoadingConfig,
    IWidget,
    IWidgetSelector,
    PizzagnaLayer,
    ProviderRegistryService,
    RefresherSettingsService,
    WidgetClonerService,
    WidgetTypesService,
    WIDGET_CREATE,
} from "@nova-ui/dashboards";

import { AcmeCloneSelectionComponent } from "./acme-clone-selection/acme-clone-selection.component";
import { AcmeEditWithClonerComponent } from "./acme-clone-selection/acme-edit-with-cloner.component";
import { AcmeFormSubmitHandler } from "./acme-form-submit-handler";
import { AcmeKpiDataSource } from "./datasources";
import { positions, widgets } from "./widgets";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "many-widgets-dashboard-dashboard",
    templateUrl: "./many-widgets.component.html",
    styleUrls: ["./many-widgets.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [AcmeFormSubmitHandler],
})
export class ManyWidgetsDashboardComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(DashboardComponent, { static: true })
    dashboardComponent: DashboardComponent;

    public dashboard: IDashboard = {
        positions: {},
        widgets: {},
    };

    public gridsterConfig = {
        minCols: 12,
        maxCols: 12,
        minRows: 12,
    };

    public editMode = false;
    public systemRefreshInterval: number = 60;

    public belowFoldLazyLoadingConfig: IDashboardBelowFoldLazyLoadingConfig = {
        enabled: true,
    };

    private readonly destroy$ = new Subject<void>();

    constructor(
        private providerRegistry: ProviderRegistryService,
        public submitHandler: AcmeFormSubmitHandler,
        private widgetTypesService: WidgetTypesService,
        private widgetClonerService: WidgetClonerService,
        private refreshSettings: RefresherSettingsService
    ) {
        this.providerRegistry.setProviders({
            [AcmeKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeKpiDataSource,
                deps: [HttpClient],
            },
        });
    }

    public ngOnInit(): void {
        this.widgetTypesService
            .getWidgetType("table")
            .configurator?.[
                PizzagnaLayer.Structure
            ].presentation.properties?.nodes.push("refresher");

        this.refreshSettings.refreshRateSeconds = this.systemRefreshInterval;

        const widgetsWithStructure = widgets.map((w) =>
            this.widgetTypesService.mergeWithWidgetType(w)
        );
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        this.dashboard = {
            positions: positions,
            widgets: widgetsIndex,
        };
    }

    public onDsErrorSwitch(value: boolean): void {
        AcmeKpiDataSource.mockError = value;
    }

    public onShowButtonSwitch(value: boolean, property: string): void {
        for (const widget of Object.keys(this.dashboard.widgets)) {
            this.dashboard = immutableSet(
                this.dashboard,
                `widgets.${widget}.pizzagna.configuration.header.properties.${property}`,
                value
            );
        }
    }

    public ngAfterViewInit(): void {
        this.dashboardComponent.eventBus.subscribeUntil(
            WIDGET_CREATE,
            this.destroy$,
            (event) => {
                const cloner: IWidgetSelector = {
                    // @ts-ignore: Suppressing strict mode error, preserving old flow
                    widget: this.dashboard.widgets[event.widgetId],
                    dashboardComponent: this.dashboardComponent,
                    trySubmit: this.submitHandler.trySubmit,
                    widgetSelectionComponentType: AcmeEditWithClonerComponent,
                };
                this.widgetClonerService
                    .open(cloner)
                    .pipe(take(1), takeUntil(this.destroy$))
                    .subscribe();
            }
        );
    }

    public onCloneWidget(): void {
        const cloner: IWidgetSelector = {
            dashboardComponent: this.dashboardComponent,
            trySubmit: this.submitHandler.trySubmit,
            widgetSelectionComponentType: AcmeCloneSelectionComponent,
        };
        this.widgetClonerService
            .open(cloner)
            .pipe(take(1), takeUntil(this.destroy$))
            .subscribe();
    }

    public onEditWithCloner(): void {
        // this simulates invoking WIDGET_CREATE event from inside of the first widget
        this.dashboardComponent.eventBus.next(WIDGET_CREATE, {
            widgetId: widgets[0].id,
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onSystemRefreshIntervalClick(): void {
        this.refreshSettings.refreshRateSeconds = this.systemRefreshInterval;
    }
}
