import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { LoggerService, SearchService } from "@solarwinds/nova-bits";
import { DashboardComponent, DATA_SOURCE, IDashboard, IWidget, ProviderRegistryService, WidgetTypesService } from "@solarwinds/nova-dashboards";
import keyBy from "lodash/keyBy";

import { AcmeKpiDataSource, AcmeKpiDataSource2 } from "../data/kpi-datasources";
import { AcmeProportionalDataSource, AcmeProportionalDataSource2 } from "../data/proportional-datasources";
import { AcmeTableDataSource } from "../data/table/acme-table-data-source.service";
import { AcmeTableDataSource2 } from "../data/table/acme-table-data-source2.service";
import { AcmeTableDataSource3 } from "../data/table/acme-table-data-source3.service";
import { AcmeTableMockDataSource } from "../data/table/acme-table-mock-data-source.service";
import {
    AcmeTimeseriesDataSource,
    AcmeTimeseriesDataSource2,
    AcmeTimeseriesStatusDataSource
} from "../data/timeseries-data-sources";

import { AcmeFormSubmitHandler } from "./acme-form-submit-handler";
import { positions, widgetConfigs } from "./widget-configs";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "acme-dashboard",
    templateUrl: "./timeseries-widget-prototype.component.html",
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [AcmeFormSubmitHandler],
})
export class AcmeDashboardComponent implements OnInit {
    @ViewChild(DashboardComponent, { static: true }) dashboardComponent: DashboardComponent;

    public dashboard: IDashboard;
    public gridsterConfig = {};

    public editMode = false;

    constructor(public submitHandler: AcmeFormSubmitHandler,
                private providerRegistry: ProviderRegistryService,
                private widgetTypesService: WidgetTypesService) {
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
            [AcmeTableDataSource3.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTableDataSource3,
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
        });
    }

    public ngOnInit(): void {
        const widgetsWithStructure = widgetConfigs.map(w => this.widgetTypesService.mergeWithWidgetType(w));
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        this.dashboard = {
            positions: positions,
            widgets: widgetsIndex,
        };
    }

}
