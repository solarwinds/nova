import { ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IDashboard,
    IProviderConfiguration,
    IRefresherProperties,
    IWidget,
    IWidgets,
    KpiComponent,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { TestKpiDataSource, TestKpiDataSource2, TestKpiDataSourceBigNumber, TestKpiDataSourceSmallNumber } from "../../../data/kpi-data-sources";

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "kpi-error-test",
    templateUrl: "./kpi-error-test.component.html",
    styleUrls: ["./kpi-error-test.component.less"],
})
export class KpiErrorTestComponent implements OnInit {
    public dashboard: IDashboard | undefined;

    public gridsterConfig: GridsterConfig = {};

    public editMode: boolean = false;

    constructor(
        private widgetTypesService: WidgetTypesService,
        private providerRegistry: ProviderRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    public ngOnInit(): void {
        const widgetTemplate = this.widgetTypesService.getWidgetType("kpi", 1);

        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceProviders,
            [TestKpiDataSource.providerId, TestKpiDataSource2.providerId, TestKpiDataSourceBigNumber.providerId, TestKpiDataSourceSmallNumber.providerId]
        );
        [TestKpiDataSource, TestKpiDataSource2, TestKpiDataSourceBigNumber].forEach((dataSource) => {
            dataSource.mockError = true;
        })
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

        this.initializeDashboard();
    }

    public reInitializeDashboard() {
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        const kpiWidget = widgetConfig;
        const widgetIndex: IWidgets = {
            [kpiWidget.id]: this.widgetTypesService.mergeWithWidgetType(kpiWidget),
        };
        const positions: Record<string, GridsterItem> = {
            [kpiWidget.id]: {
                cols: 4,
                rows: 6,
                y: 0,
                x: 0,
            },
        };

        this.dashboard = {
            positions,
            widgets: widgetIndex,
        };
    }

}

const widgetConfig: IWidget = {
    id: "widget1",
    type: "kpi",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                "providers": {
                    [WellKnownProviders.Refresher]: {
                        "properties": {
                            // Configuring the refresher interval so that our data source is invoked every ten minutes
                            "interval": 60 * 10,
                            "enabled": true,
                        } as IRefresherProperties,
                    } as Partial<IProviderConfiguration>,
                },
            },
            "header": {
                "properties": {
                    "title": "Error Widget",
                },
            },
            "tiles": {
                "properties": {
                    "nodes": ["kpi1"],
                },
            },
            "kpi1": {
                "id": "kpi1",
                "componentType": KpiComponent.lateLoadKey,
                "properties": {
                    "widgetData": {
                        "units": "out of 5 Stars",
                        "label": "Average Rating",
                    },
                },
                "providers": {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        "providerId": TestKpiDataSource.providerId,
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                        "properties": {
                            "componentId": "kpi1",
                            "propertyPath": "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
        },
    },
};
