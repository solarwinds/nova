import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, Injectable, OnDestroy, OnInit } from "@angular/core";
import { DataSourceService, IconStatus, IDataField, IFilters, INovaFilters } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
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
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { finalize, map, switchMap, tap } from "rxjs/operators";

import { APOLLO_API_NAMESPACE } from "../../../types";

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class DrilldownDataSource extends DataSourceService<any> implements OnDestroy {
    // This is the ID we'll use to identify the provider
    public static providerId = "DrilldownDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    public dataFields: Partial<IDataField>[] = [
        { id: "Region", label: "Region name" },
        { id: "Subregion", label: "Subregion name" },
    ];

    private drillState: string[] = [];
    private groupBy: string[];
    private cache: any;
    private lastDrillState: string[] = [];
    private leafGroup: string = "Country";
    private applyFilters$ = new Subject<IFilters>();

    constructor(private http: HttpClient, private apollo: Apollo) {
        super();

        // TODO: remove Partial in vNext after marking dataType field as optional
        (this.dataFieldsConfig.dataFields$ as BehaviorSubject<Partial<IDataField>[]>).next(this.dataFields);

        this.applyFilters$.pipe(switchMap(filters => this.getData(filters)))
                          .subscribe(async res => { this.outputsSubject.next(await this.getFilteredData(res)); });
    }

    private groupedDataHistory: any[] = [];

    // In this example, getFilteredData is invoked every 10 minutes (Take a look at the refresher
    // provider definition in the widget configuration below to see how the interval is set)
    public async getFilteredData(data: any): Promise<any> {
        return of(data)
        .pipe(
            map(entries => {
                let widgetInput, mapIconsToEntries;

                if (this.isDrillDown()) {
                    const activeDrillLvl = this.drillState.length;
                    const group = this.groupBy[activeDrillLvl];
                    const lastGroupedValue = this.getTransformedDataForGroup(entries, group, getLast(this.drillState));

                    this.groupedDataHistory.push(lastGroupedValue);

                    return lastGroupedValue;
                }

                mapIconsToEntries = entries.map((item: any) => ({...item, icon: "virtual-host", icon_status: IconStatus.Up }));
                this.groupedDataHistory.push(mapIconsToEntries);
                widgetInput = this.getOutput(entries);

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

    private getQuery(key: string, value: string) {
        const groupToRequestMap: Record<string, string> = {
            "Region": `{ Region { name } }`,
            "Subregion": `{ Subregion(filter: { region: { name: "${value}" } } ) { name } }`,
            "Country": `{ Country(filter: { subregion: { name: "${value}" } } ) { name capital } }`,
        };

        return gql`${groupToRequestMap[key]}`;
    }

    private getData(filters: INovaFilters): Observable<any> {
        this.drillState = filters.drillstate?.value;
        this.groupBy = filters.group?.value;
        const group = this.groupBy[this.drillState.length];
        const isDrillUp = this.drillState.length < this.lastDrillState.length;

        this.lastDrillState = [...this.drillState];

        if (!this.drillState.length) {
            this.groupedDataHistory.length = 0;
        }

        this.busy.next(true);

        if (this.cache && (isDrillUp || this.isHome())) {
            return of(this.cache).pipe(map(data => data.data[group]), finalize(() => this.busy.next(false)));
        } else {
            return this.apollo.use(APOLLO_API_NAMESPACE.COUNTRIES).query<any>({query: this.getQuery(group || this.leafGroup, getLast(this.drillState))})
                    .pipe(
                        tap(data => this.cache = { data: {...this.cache?.data, ...data?.data} }),
                        map(data => data.data[group || this.leafGroup]),
                        finalize(() => this.busy.next(false))
                    );
        }
    }

    private getTransformedDataForGroup(data: any, group: string, drillStateValue: string) {
        const fallback: string = `No ${group} for ${drillStateValue}`;
        const dataArr = Object.values(data).map((val: any) => ({
            id: val.name || fallback,
            label: val.name || fallback,
            statuses: [
                { key: "state_ok", value: val.name?.length },
                { key: "status_unreachable", value: generateNumberUpTo(100000) },
                { key: "status_warning", value: generateNumberUpTo(10000) },
                { key: "status_unknown", value: generateNumberUpTo(1000) },
            ],
        }));

        return dataArr;
    }

    private isHome(): boolean {
        return this.drillState.length === 0;
    }

    private isDrillDown(): boolean {
        return this.drillState.length !== this.groupBy.length;
    }

    private getOutput(data: any) {
        if (this.isHome()) {
            this.groupedDataHistory.length = 0;
        }

        const lastHistoryValue = getLast(this.groupedDataHistory);

        if (!lastHistoryValue) {
            return data;
        }

        return lastHistoryValue[getLast(this.drillState)] || lastHistoryValue;
    }
}

@Component({
    selector: "drilldown-multi-request-widget-example",
    templateUrl: "./drilldown-multi-request-widget-example.component.html",
    styleUrls: ["./drilldown-multi-request-widget-example.component.less"],
})
export class DrilldownMultiRequestWidgetExampleComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard | undefined;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    // Boolean passed as an input to the dashboard. When true, widgets can be moved, resized, removed, or edited
    public editMode: boolean = false;

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,
        private providerRegistry: ProviderRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) { }

    public ngOnInit(): void {
        // this.prepareNovaDashboards();
        this.initializeDashboard();
        const widgetTemplate = this.widgetTypesService.getWidgetType("drilldown", 1);
        this.widgetTypesService.setNode(widgetTemplate, "configurator", WellKnownPathKey.DataSourceProviders, [
            DrilldownDataSource.providerId,
        ]);

        // Registering the data source for injection into the KPI tile.
        // Note: Each tile of a KPI widget is assigned its own instance of the data source
        this.providerRegistry.setProviders({
            [DrilldownDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: DrilldownDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [HttpClient, Apollo],
            },
        });
    }

    /** Used for restoring widgets state */
    public reInitializeDashboard() {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
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
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        providerId: DrilldownDataSource.providerId,
                        properties: {
                        },
                    } as IProviderConfiguration,
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
                            drillstate: [],
                            groups: ["Region", "Subregion"],
                            groupBy: ["Region", "Subregion"],

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

const generateNumberUpTo = (upperLimit: number): number => Math.floor((Math.random() * upperLimit) + 1);
