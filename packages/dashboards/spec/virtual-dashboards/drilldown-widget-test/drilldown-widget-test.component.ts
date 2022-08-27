import { HttpClient } from "@angular/common/http";
import {
    ChangeDetectorRef,
    Component,
    Injectable,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import _cloneDeep from "lodash/cloneDeep";
import groupBy from "lodash/groupBy";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { catchError, finalize, map, switchMap, tap } from "rxjs/operators";

import { DataSourceService, IFilters, INovaFilters } from "@nova-ui/bits";
import {
    DashboardComponent,
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
    NOVA_TEST_REGISTRY,
    PizzagnaLayer,
    ProviderRegistryService,
    TEST_REGISTRY,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { UnitTestRegistryService } from "../../../src/lib/services/unit-test-registry.service";
import { GRAPH_DATA_MOCK } from "./data-mock";

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class DrilldownDataSource
    extends DataSourceService<any>
    implements OnDestroy
{
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
        this.applyFilters$
            .pipe(switchMap((filters) => this.getData(filters)))
            .subscribe(async (res) => {
                this.outputsSubject.next(await this.getFilteredData(res));
            });
    }

    private groupedDataHistory: any[] = [];

    // In this example, getFilteredData is invoked every 10 minutes (Take a look at the refresher
    // provider definition in the widget configuration below to see how the interval is set)
    public async getFilteredData(data: any): Promise<any> {
        return of(data)
            .pipe(
                map((countries) => {
                    const widgetInput = this.getOutput(countries);

                    if (this.isDrillDown()) {
                        const activeDrillLvl = this.drillState.length;
                        const group = this.groupBy[activeDrillLvl];
                        const [lastGroupedValue, groupedData] =
                            this.getTransformedDataForGroup(widgetInput, group);

                        this.groupedDataHistory.push(lastGroupedValue);

                        return groupedData;
                    }

                    return widgetInput;
                })
            )
            .toPromise();
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

        return of(this.cache || GRAPH_DATA_MOCK).pipe(
            // delay(1000),
            tap((data) => (this.cache = data)),
            map((data) => data.data.countries),
            catchError((e) => of([])),
            finalize(() => this.busy.next(false))
        );
    }

    private getTransformedDataForGroup(data: any, groupName: string) {
        const groupedDict = groupBy(data, groupName);
        const dataArr = Object.keys(groupedDict).map((property) => ({
            id: property,
            label: property,
            // TODO: apply groups mapping here
            statuses: [
                { key: "state_ok", value: groupedDict[property].length },
                {
                    key: "status_unreachable",
                    value: generateNumberUpTo(100000),
                },
                { key: "status_warning", value: generateNumberUpTo(10000) },
                { key: "status_unknown", value: generateNumberUpTo(1000) },
            ],
        }));

        return [groupedDict, dataArr];
    }

    private isHome(): boolean {
        return this.drillState.length === 0;
    }

    private isBack(): boolean {
        return (
            this.groupedDataHistory.length > this.drillState.length &&
            !this.isHome()
        );
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
})
export class DrilldownWidgetTestComponent implements OnInit {
    public dashboard: IDashboard | undefined;
    public gridsterConfig: GridsterConfig = {};
    public editMode: boolean = false;

    @ViewChild(DashboardComponent)
    public dashboardComponent: DashboardComponent;

    constructor(
        private drilldownRegistry: UnitTestRegistryService,
        private widgetTypesService: WidgetTypesService,
        private providerRegistry: ProviderRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        const drilldownWidget = _cloneDeep(
            this.widgetTypesService.getWidgetType("drilldown")
        );
        drilldownWidget.widget[
            PizzagnaLayer.Structure
        ].navigationBar.providers = {
            DrilldownRegistry: {
                providerId: NOVA_TEST_REGISTRY,
                properties: {},
            },
        };
        this.widgetTypesService.registerWidgetType(
            "drilldown",
            2,
            drilldownWidget
        );
    }

    /** Used for restoring widgets state */
    public reInitializeDashboard() {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }

    public ngOnInit(): void {
        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        this.providerRegistry.setProviders({
            [DrilldownDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: DrilldownDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [HttpClient],
            },
            [NOVA_TEST_REGISTRY]: {
                provide: TEST_REGISTRY,
                useExisting: UnitTestRegistryService,
                deps: [],
            },
        });

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
}

const widgetConfig: IWidget = {
    id: "drilldown",
    type: "drilldown",
    version: 2,
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        providerId: DrilldownDataSource.providerId,
                        properties: {},
                    } as IProviderConfiguration,
                },
            },
            header: {
                properties: {
                    title: "Drilldown Widget",
                    subtitle: "Countries BY continent THEN currency",
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
                            groupBy: ["continent.name", "currency"],

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

                    DrilldownRegistry: {
                        providerId: NOVA_TEST_REGISTRY,
                        properties: {},
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

const generateNumberUpTo = (upperLimit: number): number =>
    Math.floor(Math.random() * upperLimit + 1);
