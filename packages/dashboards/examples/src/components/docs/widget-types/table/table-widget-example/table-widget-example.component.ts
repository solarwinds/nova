import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { DataSourceService, INovaFilteringOutputs, INovaFilters, nameof } from "@nova-ui/bits";
import {
    DATA_SOURCE,
    IDashboard,
    IDataField,
    ITableWidgetColumnConfig,
    IWidget,
    IWidgets,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import orderBy from "lodash/orderBy";
import { BehaviorSubject, from } from "rxjs";
import { map, tap } from "rxjs/operators";


export const BREW_API_URL = "https://api.punkapi.com/v2/beers";

export interface IBrewInfo {
    id: string;
    name: string;
    tagline: string;
    first_brewed: string;
    description: string;
    brewers_tips: string;
}

export interface IBrewDatasourceResponse {
    brewInfo: IBrewInfo[];
    total: number;
}

export class BeerDataSource extends DataSourceService<IBrewInfo> {
    public static providerId = "BeerDataSource";

    private cache: IBrewInfo[] = [];

    public busy = new BehaviorSubject(false);

    public dataFields: Array<IDataField> = [
        { id: nameof<IBrewInfo>("id"), label: "No", dataType: "number", sortable: true },
        // To indicate that a column should not be sortable, set the optional IDataField 'sortable' property to false
        { id: nameof<IBrewInfo>("name"), label: "Name", dataType: "string", sortable: true },
        { id: nameof<IBrewInfo>("tagline"), label: "Tagline", dataType: "string", sortable: true },
        { id: nameof<IBrewInfo>("first_brewed"), label: "First Brewed", dataType: "string", sortable: true },
        { id: nameof<IBrewInfo>("description"), label: "Description", dataType: "string", sortable: false },
        { id: nameof<IBrewInfo>("brewers_tips"), label: "Brewer's Tips", dataType: "string", sortable: false },
    ];

    public async getFilteredData(filters: INovaFilters): Promise<INovaFilteringOutputs> {
        const start = filters.virtualScroll?.value?.start ?? 0;
        const end = filters.virtualScroll?.value?.end ?? 0;

        // Resetting cache on first page request
        if (start === 0) {
            this.cache = [];
        }

        // extract sorter settings to send to the backend
        // filters.sorterValue.sortBy; filters.sorterValue.direction
        return from(this.fetch(start, end)).pipe(
            tap((response: IBrewDatasourceResponse | undefined) => {
                if (!response) {
                    return;
                }
                this.cache = this.sortData(this.cache.concat(response.brewInfo), filters);
                this.dataSubject.next(this.cache);
            }),
            map(() => ({
                repeat: { itemsSource: this.cache },
                dataFields: this.dataFields,
            }))).toPromise();
    }

    public async fetch(start: number, end: number): Promise<IBrewDatasourceResponse | undefined> {
        const delta: number = end - start;
        const currentPage: number = (end / delta) || 0;
        const response: Object | Array<IBrewInfo> = await (await fetch(`${ BREW_API_URL }/?page=${ currentPage }&per_page=${ delta }`)).json();

        // Note: In case request fails we should not proceed with mapping
        if (!Array.isArray(response)) {
            return undefined;
        }

        return {
            brewInfo: response.map((result: IBrewInfo) => ({
                id: result.id,
                name: result.name,
                tagline: result.tagline,
                first_brewed: result.first_brewed,
                description: result.description,
                brewers_tips: result.brewers_tips,
            })),
            total: response.length,
        };
    }

    private sortData(data: IBrewInfo[], filters: INovaFilters): IBrewInfo[] {
        return orderBy(data, filters.sorter?.value?.sortBy, filters.sorter?.value?.direction as "desc" | "asc");
    }
}


/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "table-widget-example",
    templateUrl: "./table-widget-example.component.html",
    styleUrls: ["./table-widget-example.component.less"],
})
export class TableWidgetExampleComponent implements OnInit {
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
        // In general, the ProviderRegistryService is used for making entities available for injection into dynamically loaded components.
        private providerRegistry: ProviderRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
    }

    public ngOnInit(): void {
        // Grabbing the widget's default template which will be needed as a parameter for setNode
        const widgetTemplate = this.widgetTypesService.getWidgetType("table", 1);

        // Registering our data sources as dropdown options in the widget editor/configurator
        // Note: This could also be done in the parent module's constructor so that
        // multiple dashboards could have access to the same widget template modification.
        this.widgetTypesService.setNode(
            // This is the template we grabbed above with getWidgetType
            widgetTemplate,
            // We are setting the editor/configurator part of the widget template
            "configurator",
            // This indicates which node you are changing and we want to change
            // the data source providers available for selection in the editor.
            WellKnownPathKey.DataSourceProviders,
            // We are setting the data sources available for selection in the editor
            [BeerDataSource.providerId]
        );

        // Registering the data source for injection into the widget.
        this.providerRegistry.setProviders({
            [BeerDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: BeerDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [],
            },
        });

        this.initializeDashboard();
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
        const tableWidget = widgetConfig;
        const widgetIndex: IWidgets = {
            // Enhance the widget with information coming from it's type definition
            [tableWidget.id]: this.widgetTypesService.mergeWithWidgetType(tableWidget),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [tableWidget.id]: {
                cols: 12,
                rows: 6,
                y: 0,
                x: 0,
            },
        };

        // Finally, assigning the variables we created above to the dashboard
        this.dashboard = {
            positions,
            widgets: widgetIndex,
        };
    }

}

const TABLE_COLUMNS: ITableWidgetColumnConfig[] = [
    {
        id: "column1",
        label: $localize`Beer Name`,
        isActive: true,
        width: 185,
        formatter: {
            componentType: "RawFormatterComponent",
            properties: {
                dataFieldIds: {
                    value: "name",
                },
            },
        },
    },
    {
        id: "column2",
        label: $localize`Tagline`,
        isActive: true,
        width: 250,
        formatter: {
            componentType: "RawFormatterComponent",
            properties: {
                dataFieldIds: {
                    value: "tagline",
                },
            },
        },
    },
    {
        id: "column3",
        label: $localize`First Brewed`,
        isActive: true,
        width: 100,
        formatter: {
            componentType: "RawFormatterComponent",
            properties: {
                dataFieldIds: {
                    value: "first_brewed",
                },
            },
        },
    },
    {
        id: "column4",
        label: $localize`Description`,
        isActive: true,
        formatter: {
            componentType: "RawFormatterComponent",
            properties: {
                dataFieldIds: {
                    value: "description",
                },
            },
        },
    },
];

export const widgetConfig: IWidget = {
    id: "tableWidgetId",
    type: "table",
    pizzagna: {
        configuration: {
            "header": {
                properties: {
                    title: "Stupendous Suds",
                    subtitle: "Try These Brilliant Brews",
                },
            },
            "table": {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        providerId: BeerDataSource.providerId,
                    },
                },
                properties: {
                    configuration: {
                        columns: TABLE_COLUMNS,
                        sortable: true,
                        sorterConfiguration: {
                            descendantSorting: false,
                            sortBy: "",
                        },
                        hasVirtualScroll: true,
                    },
                },
            },
        },
    },
};
