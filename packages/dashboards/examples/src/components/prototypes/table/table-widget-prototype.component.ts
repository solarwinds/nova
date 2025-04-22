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
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import keyBy from "lodash/keyBy";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

import {
    EventBus,
    IEvent,
    immutableSet,
    LoggerService,
    SearchService,
} from "@nova-ui/bits";
import {
    DashboardComponent,
    DATA_SOURCE,
    IDashboard,
    IWidget,
    IWidgetSelector,
    PizzagnaLayer,
    ProviderRegistryService,
    WidgetClonerService,
    WidgetTypesService,
    WIDGET_CREATE,
    PIZZAGNA_EVENT_BUS,
} from "@nova-ui/dashboards";

import {
    AcmeKpiDataSource,
    AcmeKpiDataSource2,
    AcmeKpiDataSource3,
} from "../data/kpi-datasources";
import {
    AcmeProportionalDataSource,
    AcmeProportionalDataSource2,
} from "../data/proportional-datasources";
import { AcmeTableDataSource } from "../data/table/acme-table-data-source.service";
import { AcmeTableDataSource2 } from "../data/table/acme-table-data-source2.service";
import { AcmeTableDataSourceNoColumnGeneration } from "../data/table/acme-table-data-source3.service";
import { AcmeTableGBooksDataSource } from "../data/table/acme-table-gbooks-data-source.service";
import { AcmeTableMockDataSource } from "../data/table/acme-table-mock-data-source.service";
import {
    AcmeTimeseriesDataSource,
    AcmeTimeseriesDataSource2,
} from "../data/timeseries-data-sources";
import { AcmeCloneSelectionComponent } from "./acme-clone-selection/acme-clone-selection.component";
import { AcmeEditWithClonerComponent } from "./acme-clone-selection/acme-edit-with-cloner.component";
import { AcmeFormSubmitHandler } from "./acme-form-submit-handler";
import { positions, widgets } from "./widgets";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "acme-dashboard",
    templateUrl: "./table-widget-prototype.component.html",
    styleUrls: ["./table-widget-prototype.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [AcmeFormSubmitHandler],
    standalone: false
})
export class AcmeDashboardComponent
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

    private readonly destroy$ = new Subject<void>();

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) public eventBus: EventBus<IEvent>,
        private providerRegistry: ProviderRegistryService,
        public submitHandler: AcmeFormSubmitHandler,
        private widgetTypesService: WidgetTypesService,
        private widgetClonerService: WidgetClonerService
    ) {
        this.providerRegistry.setProviders({
            [AcmeKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeKpiDataSource,
                deps: [HttpClient],
            },
            [AcmeKpiDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeKpiDataSource2,
                deps: [HttpClient],
            },
            [AcmeKpiDataSource3.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeKpiDataSource3,
                deps: [],
            },
            [AcmeProportionalDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeProportionalDataSource,
                deps: [HttpClient],
            },
            [AcmeProportionalDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeProportionalDataSource2,
                deps: [],
            },
            [AcmeTableDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTableDataSource,
                deps: [LoggerService, HttpClient],
            },
            [AcmeTableDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTableDataSource2,
                deps: [LoggerService],
            },
            [AcmeTableDataSourceNoColumnGeneration.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTableDataSourceNoColumnGeneration,
                deps: [LoggerService],
            },
            [AcmeTableMockDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTableMockDataSource,
                deps: [SearchService],
            },
            [AcmeTimeseriesDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTimeseriesDataSource,
                deps: [HttpClient],
            },
            [AcmeTimeseriesDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTimeseriesDataSource2,
                deps: [],
            },
            [AcmeTableGBooksDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTableGBooksDataSource,
                deps: [LoggerService, HttpClient],
            },
        });
    }

    public ngOnInit(): void {
        this.widgetTypesService
            .getWidgetType("table")
            .configurator?.[
                PizzagnaLayer.Structure
            ].presentation.properties?.nodes.push("refresher");

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
        AcmeProportionalDataSource.mockError = value;
        AcmeKpiDataSource.mockError = value;
        AcmeKpiDataSource2.mockError = value;
        AcmeTableDataSource.mockError = value;
        AcmeTimeseriesDataSource.mockError = value;
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
}
