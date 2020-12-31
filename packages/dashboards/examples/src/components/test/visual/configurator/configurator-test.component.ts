import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { SearchService, ThemeSwitchService } from "@nova-ui/bits";
import {
    DashboardComponent,
    DATA_SOURCE,
    IDashboard,
    IWidget,
    IWidgetSelector,
    PIZZAGNA_EVENT_BUS,
    ProviderRegistryService,
    WidgetClonerService,
    WidgetTypesService,
} from "@nova-ui/dashboards";
import keyBy from "lodash/keyBy";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

import { TestKpiDataSource, TestKpiDataSource2 } from "../../data/kpi-data-sources";
import { TestProportionalDataSource, TestProportionalDataSource2, TestProportionalDataSource3 } from "../../data/proportional-data-sources";
import { TestTableDataSource, TestTableDataSource2 } from "../../data/table-datasources";
import { TestTimeseriesDataSource, TestTimeseriesDataSource2 } from "../../data/timeseries-data-sources";

import { AcmeCloneSelectionComponent } from "./acme-clone-selection/acme-clone-selection.component";
import { AcmeFormSubmitHandler } from "./acme-form-submit-handler";
import { positions, widgets } from "./widgets";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "acme-dashboard",
    templateUrl: "./configurator-test.component.html",
    styleUrls: ["./configurator-test.component.less"],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.Default,
    providers: [AcmeFormSubmitHandler],
})
export class AcmeDashboardComponent implements OnInit, OnDestroy {
    @ViewChild(DashboardComponent, { static: true }) dashboardComponent: DashboardComponent;
    private destroy$ = new Subject();

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
        private widgetTypesService: WidgetTypesService,
        private widgetClonerService: WidgetClonerService) {
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
        const widgetsWithStructure = widgets.map(w => ({
            ...w,
            pizzagna: {
                ...this.widgetTypesService.getWidgetType(w.type, w.version).widget,
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

    public onCloneWidget() {
        const cloner: IWidgetSelector = {
            dashboardComponent: this.dashboardComponent,
            trySubmit: this.submitHandler.trySubmit,
            widgetSelectionComponentType: AcmeCloneSelectionComponent,
        };
        this.widgetClonerService.open(cloner)
            .pipe(
                take(1),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
