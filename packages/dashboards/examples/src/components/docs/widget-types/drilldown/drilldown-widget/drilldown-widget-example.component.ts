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
    ChangeDetectorRef,
    Component,
    Injectable,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { Apollo, gql } from "apollo-angular";
import groupBy from "lodash/groupBy";
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, delay, filter, map } from "rxjs/operators";

import {
    DataSourceFeatures,
    IconStatus,
    IDataField,
    IDataSource,
    IDataSourceFeatures,
    IDataSourceFeaturesConfiguration,
    INovaFilters,
    LoggerService,
    ServerSideDataSource,
    IFilters,
} from "@nova-ui/bits";
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
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { APOLLO_API_NAMESPACE } from "../../../types";
import { DrilldownDataSource } from "./mock-data-source";

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class DrilldownDataSourceRealApi<T = any>
    extends ServerSideDataSource<T>
    implements OnDestroy, IDataSource
{
    // This is the ID we'll use to identify the provider
    public static providerId = "DrilldownDataSourceRealApi";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);
    public dataFields: Partial<IDataField>[] = [
        { id: "regionName", label: "Region name" },
        { id: "subregionName", label: "Subregion name" },
    ];

    public features: IDataSourceFeaturesConfiguration;
    private supportedFeatures: IDataSourceFeatures = {
        search: { enabled: true },
    };

    private drillState: string[] = [];
    private groupBy: string[];

    constructor(
        private logger: LoggerService,
        private http: HttpClient,
        private apollo: Apollo
    ) {
        super();
        this.features = new DataSourceFeatures(this.supportedFeatures);
        // TODO: remove Partial in vNext after marking dataType field as optional - NUI-5838
        (
            this.dataFieldsConfig.dataFields$ as BehaviorSubject<
                Partial<IDataField>[]
            >
        ).next(this.dataFields);
    }

    private groupedDataHistory: Array<Record<string, T[]>> = [];

    // In this example, getFilteredData is invoked every 10 minutes (Take a look at the refresher
    // provider definition in the widget configuration below to see how the interval is set)
    public async getFilteredData(data: IFilters): Promise<any> {
        return of(data)
            .pipe(
                filter(() => !!this.drillState),
                map((countries) => {
                    const lastHistory = () => getLast(this.groupedDataHistory);

                    if (!this.drillState.length && !this.groupBy.length) {
                        return countries;
                    }

                    // adding "ROOT" as a root level for drilling
                    const fullDrillState = ["ROOT", ...this.drillState];
                    const activeDrillLvl = fullDrillState.length;
                    const historyLvl = this.groupedDataHistory.length;

                    // checking how many lvls we have to group for drilling, in case some are missed
                    const drillLvlDiff = activeDrillLvl - historyLvl;

                    if (!drillLvlDiff) {
                        return lastHistory() || countries;
                    }

                    const drillToGroup = fullDrillState.slice(
                        fullDrillState.length - drillLvlDiff
                    );

                    for (const drill of drillToGroup) {
                        const drillIdx = fullDrillState.findIndex(
                            (v) => v === drill
                        );
                        const group = this.groupBy[drillIdx];

                        if (group) {
                            const dataToGroup = lastHistory()
                                ? lastHistory()[drill]
                                : countries;
                            const lastGroupedValue = groupBy(
                                dataToGroup,
                                group
                            );

                            this.groupedDataHistory.push(lastGroupedValue);
                        }
                    }

                    // take last if we have all data grouped
                    if (this.groupBy.length === this.drillState.length) {
                        return lastHistory()[getLast(this.drillState)];
                    }

                    // get groping and transform to raw data format
                    return this.getGroupsWidgetData(lastHistory());
                })
            )
            .toPromise();
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }

    // This method is expected to return all data needed for repeat/paginator/filterGroups in order to work.
    // In case of custom filtering participants feel free to extend INovaFilteringOutputs.
    protected getBackendData(filters: INovaFilters): Observable<any> {
        const mainRequest = this.apollo
            .use(APOLLO_API_NAMESPACE.COUNTRIES)
            .query<any>({ query: this.generateQuery(filters) });

        return mainRequest.pipe(
            // mock delay
            delay(300),
            // data mapping, !DS specific!
            map((res) => res.data.Country),
            // adds mock icons to be displayed on leaf nodes !DS specific!
            map((res: any[]) =>
                res.map((v) => ({
                    ...v,
                    icon: "virtual-host",
                    icon_status: IconStatus.Up,
                    subregionName:
                        v.subregion?.name || "No Subregion Specified",
                    regionName:
                        v.subregion?.region?.name || "No Region Specified",
                }))
            ),
            catchError((e) => {
                this.logger.error(e);
                return of({} as any);
            })
        );
    }

    private generateQuery(filters: INovaFilters) {
        const { search } = filters;
        const searchValue = search?.value ?? "";

        const queryString = `
            query {
                Country(filter: {
                    OR: [
                      { name_contains: "${searchValue}" },
                      { capital_contains: "${searchValue}" }
                    ],
                }) {
                    name
                    capital
                    population
                    officialLanguages {
                        name
                    }
                    currencies {
                        name
                    }
                    subregion {
                        name
                        region {
                            name
                        }
                    }
                }
            }
        `;

        return gql`
            ${queryString}
        `;
    }

    // Overrides default ServerSideDataSource.beforeApplyFilters implementation
    // to save some filters that are used internally
    // -- !DS specific
    protected beforeApplyFilters(filters: INovaFilters): void {
        this.busy.next(true);

        this.drillState = filters.drillstate?.value;
        this.groupBy = filters.group?.value;

        if (this.isHome()) {
            this.groupedDataHistory.length = 0;
        }

        if (this.isBack()) {
            this.groupedDataHistory.length = this.groupedDataHistory.length - 1;
        }

        if (this.getFilters()["search"] && this.filterChanged("search")) {
            this.groupedDataHistory.length = 0;
        }
    }

    private getGroupsWidgetData(groupByObj: Record<string, T[]>) {
        return Object.keys(groupByObj).map((property) => ({
            id: property,
            label: property,
            // statuses that will be displayed on group item
            statuses: [
                { key: "virtual-host", value: groupByObj[property].length },
                {
                    key: "acknowledge",
                    value: this.getPopulation(groupByObj[property]),
                },
            ],
        }));
    }

    private isHome(): boolean {
        return this.drillState?.length === 0;
    }

    private isBack(): boolean {
        return (
            this.groupedDataHistory?.length > this.drillState?.length &&
            !this.isHome()
        );
    }

    /**
     * Gets population for the country(ies)
     */
    private getPopulation(countries: any[]) {
        const totalPopulation = countries.reduce(
            (acc, next) => (acc += next.population),
            0
        );
        return `${totalPopulation * Math.pow(10, -3)} k`;
    }
}

@Component({
    selector: "drilldown-widget-example",
    templateUrl: "./drilldown-widget-example.component.html",
    styleUrls: ["./drilldown-widget-example.component.less"],
})
export class DrilldownWidgetExampleComponent implements OnInit {
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
    ) {}

    public ngOnInit(): void {
        // Registering the data source for injection into the KPI tile.
        // Note: Each tile of a KPI widget is assigned its own instance of the data source
        this.providerRegistry.setProviders({
            [DrilldownDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: DrilldownDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [HttpClient],
            },
            [DrilldownDataSourceRealApi.providerId]: {
                provide: DATA_SOURCE,
                useClass: DrilldownDataSourceRealApi,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [LoggerService, HttpClient, Apollo],
            },
        });

        this.initializeDashboard();
        const widgetTemplate = this.widgetTypesService.getWidgetType(
            "drilldown",
            1
        );
        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceProviders,
            [
                DrilldownDataSourceRealApi.providerId,
                DrilldownDataSource.providerId,
            ]
        );
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const drilldownWidget = widgetConfig;
        const widgets: IWidgets = {
            // Complete the widget with information coming from its type definition
            [drilldownWidget.id]:
                this.widgetTypesService.mergeWithWidgetType(drilldownWidget),
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

    public reInitializeDashboard(): void {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        const adapterProperties =
            widgetConfig.pizzagna[PizzagnaLayer.Configuration].listWidget
                .providers?.adapter?.properties;

        if (adapterProperties) {
            adapterProperties.drillstate = [];
        }

        this.initializeDashboard();
    }
}

const widgetConfig: IWidget = {
    id: "drilldown",
    type: "drilldown",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        providerId: DrilldownDataSourceRealApi.providerId,
                        properties: {},
                    } as IProviderConfiguration,
                },
            },
            header: {
                properties: {
                    title: "Drilldown Widget",
                    subtitle: "Search is case sensitive!",
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
                            groupBy: ["regionName", "subregionName"],
                            groups: ["regionName", "subregionName"],

                            // components
                            componentsConfig: {
                                group: {
                                    componentType:
                                        ListGroupItemComponent.lateLoadKey,
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
                                    componentType:
                                        ListLeafItemComponent.lateLoadKey,
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
