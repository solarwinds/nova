import { HttpClient } from "@angular/common/http";
import { Component, Injectable, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { DataSourceService, IFilters, INovaFilters } from "@nova-ui/bits";
import {
    DashboardComponent,
    DATA_SOURCE,
    IDashboard,
    IDrilldownComponentsConfiguration,
    IListWidgetConfiguration,
    IProviderConfiguration,
    IWidget,
    IWidgets,
    ListGroupItemComponent,
    ListLeafItemComponent,
    NOVA_DRILLDOWN_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    ProviderRegistryService,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import groupBy from "lodash/groupBy";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";

import { UnitTestRegistryService } from "../../../../../../src/lib/services/unit-test-registry.service";

import { GRAPH_DATA_MOCK } from "./data-mock";

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class DrilldownDataSource extends DataSourceService<any> implements OnDestroy {
    // This is the ID we'll use to identify the provider
    public static providerId = "DrilldownDataSource";

    public random = Math.random();

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    private drillState: string[];
    private groupBy: string[];
    private cache: any;
    private applyFilters$ = new Subject<IFilters>();

    constructor() {
        super();
        this.applyFilters$.pipe(
            switchMap(filters => this.getData(filters))
        ).subscribe(async (res) => {
            this.outputsSubject.next(await this.getFilteredData(res));
        });
    }

    private groupedDataHistory: any[] = [];

    // In this example, getFilteredData is invoked every 10 minutes (Take a look at the refresher
    // provider definition in the widget configuration below to see how the interval is set)
    public async getFilteredData(data: any): Promise<any> {
        return of(data).pipe(
            map(countries => {
                const widgetInput = this.getOutput(countries);

                if (this.isDrillDown()) {
                    const activeDrillLvl = this.drillState.length;
                    const group = this.groupBy[activeDrillLvl];
                    const [lastGroupedValue, groupedData] = this.getTransformedDataForGroup(widgetInput, group);

                    this.groupedDataHistory.push(lastGroupedValue);

                    return groupedData;
                }

                return widgetInput;
            })
        ).toPromise();
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }

    // redefine parent method
    public async applyFilters(): Promise<void> {
        this.applyFilters$.next(this.getFilters());
    }

    private getData(filters: INovaFilters): Observable<any> {
        this.drillState = filters.drillstate?.value;
        this.groupBy = filters.group?.value;

        this.busy.next(true);

        return of(this.cache || GRAPH_DATA_MOCK)
            .pipe(
                // delay(1000),
                tap(data => this.cache = data),
                map(data => data.data.countries),
                catchError(e => of([])),
                finalize(() => this.busy.next(false))
            );
    }

    private getTransformedDataForGroup(data: any, groupName: string) {
        const groupedDict = groupBy(data, groupName);
        const dataArr = Object.keys(groupedDict).map(property => ({
            id: property,
            label: property,
            // TODO: apply groups mapping here
            statuses: [
                { key: "state_ok", value: groupedDict[property].length },
                { key: "status_unreachable", value: groupedDict[property].length + 98255 },
                { key: "status_warning", value: groupedDict[property].length + 8345 },
                { key: "status_unknown", value: groupedDict[property].length + 517 },
            ],
        }));

        return [groupedDict, dataArr];
    }

    private isHome(): boolean {
        return this.drillState.length === 0;
    }

    private isBack(): boolean {
        return (this.groupedDataHistory.length > this.drillState.length) && !this.isHome();
    }

    private isDrillDown(): boolean {
        return this.drillState.length !== this.groupBy.length;
    }

    private getOutput(data: any) {
        if (this.isHome()) {
            this.groupedDataHistory.length = 0;
        }

        if (this.isBack()) {
            this.groupedDataHistory.length = this.groupedDataHistory.length - 1;
        }

        const lastHistoryValue = getLast(this.groupedDataHistory);

        if (!lastHistoryValue) {
            return data;
        }

        return lastHistoryValue[getLast(this.drillState)] || lastHistoryValue;
    }
}

@Component({
    selector: "drilldown-widget-test",
    templateUrl: "./drilldown-widget-test.component.html",
    styleUrls: ["./drilldown-widget-test.component.less"],
    host: { class: "drilldown-widget", id: "drilldown-widget" },
})
export class DrilldownWidgetTestComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    // Boolean passed as an input to the dashboard. When true, widgets can be moved, resized, removed, or edited
    public editMode: boolean = false;

    @ViewChild(DashboardComponent) public dashboardComponent: DashboardComponent;

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private drilldownRegistry: UnitTestRegistryService,
        private widgetTypesService: WidgetTypesService,
        private providerRegistry: ProviderRegistryService
    ) { }

    public ngOnInit(): void {
        // this.prepareNovaDashboards();
        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // Registering the data source for injection into the KPI tile.
        // Note: Each tile of a KPI widget is assigned its own instance of the data source
        this.providerRegistry.setProviders({
            [DrilldownDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: DrilldownDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [HttpClient],
            },
        });

        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const drilldownWidget = widgetConfig;
        const widgets: IWidgets = {
            // Complete the widget with information coming from its type definition
            [drilldownWidget.id]: this.widgetTypesService.mergeWithWidgetType(drilldownWidget),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [drilldownWidget.id]: {
                cols: 10,
                rows: 10,
                y: 0,
                x: 0,
            },
        };

        // Finally, assigning the variables we created above to the dashboard
        this.dashboard = { positions, widgets };
    }

}

const widgetConfig: IWidget = {
    id: "drilldown",
    type: "drilldown",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            "header": {
                "properties": {
                    "title": "Drilldown Widget",
                    "subtitle": "Countries BY continent THEN currency",
                },
            },
            listWidget: {
                providers: {
                    [WellKnownProviders.Adapter]: {
                        providerId: NOVA_DRILLDOWN_DATASOURCE_ADAPTER,
                        properties: {
                            // widget
                            navigationBarId: "navigationBar",
                            componentId: "listWidget",
                            dataPath: "data",

                            // adapter props
                            // drillstate: [""],
                            groupBy: [
                                "continent.name",
                            ],

                            // components
                            componentsConfig: {
                                group: {
                                    componentType: ListGroupItemComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            id: "id",
                                            label: "label",
                                            statuses: "statuses",
                                        },
                                    },
                                    itemProperties: {
                                        canNavigate: true,
                                    },
                                },
                                leaf: {
                                    componentType: ListLeafItemComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            icon: "icon",
                                            status: "icon_status",
                                            detailedUrl: "capital",
                                            label: "name",
                                        },
                                    },
                                    itemProperties: {
                                        canNavigate: false,
                                    },
                                },
                            } as IDrilldownComponentsConfiguration,
                        },
                    },

                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        providerId: DrilldownDataSource.providerId,
                        properties: {

                        },
                    } as IProviderConfiguration,
                },
                properties: {
                    configuration: {
                        // FORMAT:
                        // componentType: ListLeafItemComponent.lateLoadKey,
                        // properties: {
                        //   dataFieldIds: {
                        //     icon: "",
                        //     status: "code",
                        //     detailedUrl: "capital",
                        //     label: "name",
                        //   },
                        // },
                        //
                    } as IListWidgetConfiguration,

                },
            },
        },
    },
};

const getLast = (arr: any[]) => arr[arr.length - 1];
