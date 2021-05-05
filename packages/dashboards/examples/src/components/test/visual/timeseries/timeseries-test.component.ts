import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ThemeSwitchService } from "@nova-ui/bits";
import {
    DashboardComponent,
    DATA_SOURCE,
    IDashboard,
    IWidget,
    ProviderRegistryService,
    WidgetTypesService
} from "@nova-ui/dashboards";
import keyBy from "lodash/keyBy";

import {
    TestTimeseriesDataSource,
    TestTimeseriesDataSource2,
    TestTimeseriesEventsDataSource,
    TestTimeseriesStatusDataSource,
    TestTimeseriesStatusIntervalDataSource
} from "../../data/timeseries-data-sources";

import { AcmeFormSubmitHandler } from "./acme-form-submit-handler";
import { positions, widgetConfigs } from "./widgets";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "acme-dashboard",
    templateUrl: "./timeseries-test.component.html",
    styleUrls: ["./timeseries-test.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [AcmeFormSubmitHandler],
})
export class AcmeDashboardComponent implements OnInit {
    @ViewChild(DashboardComponent, {static: true}) dashboardComponent: DashboardComponent;

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
    public dsError = false;

    constructor(private providerRegistry: ProviderRegistryService,
                public submitHandler: AcmeFormSubmitHandler,
                public themeSwitcherService: ThemeSwitchService,
                private widgetTypesService: WidgetTypesService) {
        this.providerRegistry.setProviders({
            [TestTimeseriesDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTimeseriesDataSource,
                deps: [],
            },
            [TestTimeseriesDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTimeseriesDataSource2,
                deps: [],
            },
            [TestTimeseriesEventsDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTimeseriesEventsDataSource,
                deps: [],
            },
            [TestTimeseriesStatusDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTimeseriesStatusDataSource,
                deps: [],
            },
            [TestTimeseriesStatusIntervalDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTimeseriesStatusIntervalDataSource,
                deps: [],
            },
        });
    }

    public ngOnInit(): void {
        const widgetsWithStructure = widgetConfigs.map(w => this.widgetTypesService.mergeWithWidgetType(w));
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        this.dashboard = {
            positions,
            widgets: widgetsIndex,
        };
    }

    public onDsErrorChange(error: boolean) {
        TestTimeseriesDataSource.mockError = error;
    }
}
