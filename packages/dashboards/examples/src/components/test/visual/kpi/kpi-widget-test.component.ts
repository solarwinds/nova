import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";
import keyBy from "lodash/keyBy";

import { ThemeSwitchService } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    IDashboard,
    IWidget,
    ProviderRegistryService,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import {
    TestKpiDataSource,
    TestKpiDataSource2,
    TestKpiDataSourceBigNumber,
    TestKpiDataSourceSmallNumber,
} from "../../data/kpi-data-sources";
import { positions, widgets } from "./widgets";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "acme-dashboard",
    templateUrl: "./kpi-widget-test.component.html",
    styleUrls: ["./kpi-widget-test.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
})
export class KpiDashboardComponent implements OnInit {
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

    constructor(
        private providerRegistry: ProviderRegistryService,
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
            [TestKpiDataSourceBigNumber.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestKpiDataSourceBigNumber,
                deps: [],
            },
            [TestKpiDataSourceSmallNumber.providerId]: {
                provide: DATA_SOURCE,
                useClass: TestKpiDataSourceSmallNumber,
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
}
