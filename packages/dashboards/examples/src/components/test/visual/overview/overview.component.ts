import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import keyBy from "lodash/keyBy";

import { SearchService, ThemeSwitchService } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    IDashboard,
    IWidget,
    PIZZAGNA_EVENT_BUS,
    ProviderRegistryService,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import {
    TestKpiDataSource,
    TestKpiDataSource2,
} from "../../data/kpi-data-sources";
import {
    TestProportionalDataSource,
    TestProportionalDataSource2,
    TestProportionalDataSource3,
} from "../../data/proportional-data-sources";
import {
    TestTableDataSource,
    TestTableDataSource2,
} from "../../data/table-datasources";
import {
    TestTimeseriesDataSource,
    TestTimeseriesDataSource2,
} from "../../data/timeseries-data-sources";
import { AcmeFormSubmitHandler } from "./acme-form-submit-handler";
import { positions, widgets } from "./widgets";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "acme-dashboard",
    templateUrl: "./overview.component.html",
    styleUrls: ["./overview.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [AcmeFormSubmitHandler],
})
export class AcmeDashboardComponent implements OnInit {
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

    constructor(
        private providerRegistry: ProviderRegistryService,
        public submitHandler: AcmeFormSubmitHandler,
        public themeSwitcherService: ThemeSwitchService,
        private widgetTypesService: WidgetTypesService
    ) {
        this.providerRegistry.setProviders({
            [TestKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestKpiDataSource,
                deps: [],
            },
            [TestKpiDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestKpiDataSource2,
                deps: [],
            },
            [TestProportionalDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestProportionalDataSource,
                deps: [],
            },
            [TestProportionalDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestProportionalDataSource2,
                deps: [],
            },
            [TestProportionalDataSource3.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestProportionalDataSource3,
                deps: [],
            },
            [TestTableDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTableDataSource,
                deps: [SearchService, PIZZAGNA_EVENT_BUS],
            },
            [TestTableDataSource2.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestTableDataSource2,
                deps: [SearchService, PIZZAGNA_EVENT_BUS],
            },
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
        });
    }

    public ngOnInit(): void {
        const widgetsWithStructure = widgets.map((w) => ({
            ...w,
            pizzagna: {
                ...this.widgetTypesService.getWidgetType(w.type, w.version)
                    .widget,
                ...w.pizzagna,
            },
        }));
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        this.dashboard = {
            positions: positions,
            widgets: widgetsIndex,
        };
    }

    public onDsErrorChange(error: boolean) {
        TestKpiDataSource.mockError = error;
        TestTimeseriesDataSource.mockError = error;
        TestTableDataSource.mockError = error;
        TestProportionalDataSource2.mockError = error;
    }
}
