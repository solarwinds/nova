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

import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import keyBy from "lodash/keyBy";

import { LoggerService, SearchService } from "@nova-ui/bits";
import {
    DashboardComponent,
    DATA_SOURCE,
    IDashboard,
    IWidget,
    ProviderRegistryService,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { AcmeFormSubmitHandler } from "./acme-form-submit-handler";
import { positions, widgetConfigs } from "./widget-configs";
import { AcmeKpiDataSource, AcmeKpiDataSource2 } from "../data/kpi-datasources";
import {
    AcmeProportionalDataSource,
    AcmeProportionalDataSource2,
} from "../data/proportional-datasources";
import { AcmeTableDataSource } from "../data/table/acme-table-data-source.service";
import { AcmeTableDataSource2 } from "../data/table/acme-table-data-source2.service";
import { AcmeTableDataSourceNoColumnGeneration } from "../data/table/acme-table-data-source3.service";
import { AcmeTableMockDataSource } from "../data/table/acme-table-mock-data-source.service";
import {
    AcmeTimeseriesDataSource,
    AcmeTimeseriesDataSource2,
    AcmeTimeseriesStatusDataSource,
    AcmeTimeseriesStatusIntervalDataSource,
} from "../data/timeseries-data-sources";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "acme-dashboard",
    templateUrl: "./timeseries-widget-prototype.component.html",
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [AcmeFormSubmitHandler],
    standalone: false
})
export class AcmeDashboardComponent implements OnInit {
    @ViewChild(DashboardComponent, { static: true })
    dashboardComponent: DashboardComponent;

    public dashboard: IDashboard;
    public gridsterConfig = {};

    public editMode = false;

    constructor(
        public submitHandler: AcmeFormSubmitHandler,
        private providerRegistry: ProviderRegistryService,
        private widgetTypesService: WidgetTypesService
    ) {
        this.providerRegistry.setProviders({
            [AcmeKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeKpiDataSource,
                deps: [],
            },
            [AcmeKpiDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeKpiDataSource2,
                deps: [],
            },
            [AcmeProportionalDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeProportionalDataSource,
                deps: [],
            },
            [AcmeProportionalDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeProportionalDataSource2,
                deps: [],
            },
            [AcmeTableDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTableDataSource,
                deps: [LoggerService],
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
                deps: [],
            },
            [AcmeTimeseriesDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTimeseriesDataSource2,
                deps: [],
            },
            [AcmeTimeseriesStatusDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTimeseriesStatusDataSource,
                deps: [],
            },
            [AcmeTimeseriesStatusIntervalDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTimeseriesStatusIntervalDataSource,
                deps: [],
            },
        });
    }

    public ngOnInit(): void {
        const widgetsWithStructure = widgetConfigs.map((w) =>
            this.widgetTypesService.mergeWithWidgetType(w)
        );
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        this.dashboard = {
            positions: positions,
            widgets: widgetsIndex,
        };
    }
}
