import {
    ChangeDetectorRef,
    Component,
    Injectable,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { BehaviorSubject } from "rxjs";

import {
    DataSourceService,
    IDataField,
    IDataFieldsConfig,
    IDataSource,
    IFilteringOutputs,
} from "@nova-ui/bits";
import {
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IDashboard,
    IProviderConfiguration,
    IWidget,
    IWidgets,
    LegendPlacement,
    PizzagnaLayer,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import {
    CartesianChartPreset,
    CartesianScaleType,
    CartesianWidgetConfig,
    CartesianWidgetData,
} from "../../../../../../../../src/lib/components/cartesian-widget/types";

/**
 * A simple proportional data source to retrieve beer review counts by city
 */
@Injectable()
export class BeerReviewCountsByCityMockDataSource
    extends DataSourceService<any>
    implements IDataSource<any>, OnDestroy
{
    // This is the ID we'll use to identify the provider
    public static providerId = "BeerReviewCountsByCityMockDataSource";
    public busy = new BehaviorSubject(false);
    private dataType: IDataField[] = [
        {
            id: "likes",
            label: "Likes",
            dataType: "number",
            sortable: false,
        },
        {
            id: "dislikes",
            label: "Dislikes",
            dataType: "number",
            sortable: false,
        },
    ];
    dataFieldsConfig: IDataFieldsConfig = {
        dataFields$: new BehaviorSubject(this.dataType),
    };

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                this.outputsSubject.next({
                    result: {
                        series: getMockBeerReviewCountsByCity(),
                    },
                });
                this.busy.next(false);
            }, 300);
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

@Component({
    selector: "nui-cartesian-widget-example",
    templateUrl: "./cartesian-widget-example.component.html",
    styleUrls: ["./cartesian-widget-example.component.less"],
})
export class CartesianWidgetExampleComponent implements OnInit {
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
    ) {}

    public ngOnInit(): void {
        // Grabbing the widget's default template which will be needed as a parameter for setNode
        const widgetTemplate = this.widgetTypesService.getWidgetType(
            "proportional",
            1
        );

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
            [BeerReviewCountsByCityMockDataSource.providerId]
        );

        // Registering the data source for injection into the Proportional widget.
        this.providerRegistry.setProviders({
            [BeerReviewCountsByCityMockDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: BeerReviewCountsByCityMockDataSource,
                deps: [],
            },
        });

        this.initializeDashboard();
    }

    /** Used for restoring widgets state */
    public reInitializeDashboard(): void {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const widgetIndex: IWidgets = {
            // Complete the proportional widget with information coming from its type definition
            [widgetConfig.id]:
                this.widgetTypesService.mergeWithWidgetType(widgetConfig),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [widgetConfig.id]: {
                cols: 5,
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

const widgetConfig: IWidget = {
    id: "cartesianWidgetId",
    type: "cartesian",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the chart
                        providerId:
                            BeerReviewCountsByCityMockDataSource.providerId,
                    } as IProviderConfiguration,
                },
            },
            header: {
                properties: {
                    title: "Data x, y",
                    subtitle: "Widget data",
                },
            },
            chart: {
                providers: {
                    [WellKnownProviders.Adapter]: {
                        properties: {
                            // Setting the series and corresponding labels to initially display on the chart
                            series: [
                                {
                                    id: "critical",
                                    label: "Critical",
                                    selectedSeriesId: "critical",
                                },
                                {
                                    id: "warning",
                                    label: "Warning",
                                    selectedSeriesId: "warning",
                                },
                            ] as any[],
                        },
                    } as Partial<IProviderConfiguration>,
                },
                properties: {
                    configuration: {
                        legendPlacement: LegendPlacement.None,
                        enableZoom: false,
                        leftAxisLabel: "Count",
                        preset: CartesianChartPreset.Bar,
                        scales: {
                            x: { type: CartesianScaleType.Band },
                            y: { type: CartesianScaleType.Linear },
                        },
                        allowLegendMenu: true,
                        chartColors: {
                            critical: "var(--nui-color-chart-one)",
                            warning: "var(--nui-color-chart-five)",
                        } as any,
                    } as CartesianWidgetConfig,
                },
            },
        },
    },
};

export function getMockBeerReviewCountsByCity(): CartesianWidgetData[] {
    return [
        {
            id: "critical",
            name: "Beet",
            description: "",
            data: [
                {
                    id: "Windows 7",
                    x: "Windows 7",
                    y: 2,
                    icon: "status_down",
                    link: "https://en.wikipedia.org/wiki/Windows 7",
                    name: "Windows 7",
                    value: 2,
                    color: "var(--nui-color-chart-one)",
                },
                {
                    id: "linux",
                    x: "Linux",
                    y: 2,
                    icon: "status_critical",
                    link: "https://en.wikipedia.org/wiki/Linux",
                    name: "Linux",
                    value: 2,
                    color: "var(--nui-color-chart-two)",
                },
                {
                    id: "vmWare",
                    x: "VmWare",
                    y: 1,
                    icon: "status_warning",
                    link: "https://en.wikipedia.org/wiki/VmWare",
                    name: "VmWare",
                    value: 2,
                    color: "var(--nui-color-chart-three)",
                },
                {
                    id: "lInus",
                    x: "LInus",
                    y: 3,
                    icon: "status_unknown",
                    link: "https://en.wikipedia.org/wiki/LInus",
                    name: "LInus",
                    value: 2,
                    color: "var(--nui-color-chart-four)",
                },
                {
                    id: "oracle",
                    x: "Oracle",
                    y: 5,
                    icon: "status_up",
                    link: "https://en.wikipedia.org/wiki/Oracle",
                    name: "Oracle",
                    value: 2,
                    color: "var(--nui-color-chart-five)",
                },
                {
                    id: "macOS",
                    x: "MacOS",
                    y: 4,
                    icon: "status_unmanaged",
                    link: "https://en.wikipedia.org/wiki/MacOS",
                    name: "MacOS",
                    value: 2,
                    color: "var(--nui-color-chart-six)",
                },
            ],
        },
        {
            id: "warning",
            name: "Beet",
            description: "",
            data: [
                {
                    id: "Windows 7",
                    x: "Windows 7",
                    y: 1,
                    icon: "status_down",
                    link: "https://en.wikipedia.org/wiki/Windows 7",
                    name: "Windows 7",
                    value: 2,
                    color: "var(--nui-color-chart-one)",
                },
                {
                    id: "linux",
                    x: "Linux",
                    y: 2,
                    icon: "status_critical",
                    link: "https://en.wikipedia.org/wiki/Linux",
                    name: "Linux",
                    value: 2,
                    color: "var(--nui-color-chart-two)",
                },
                {
                    id: "vmWare",
                    x: "VmWare",
                    y: 2,
                    icon: "status_warning",
                    link: "https://en.wikipedia.org/wiki/VmWare",
                    name: "VmWare",
                    value: 2,
                    color: "var(--nui-color-chart-three)",
                },
                {
                    id: "lInus",
                    x: "LInus",
                    y: 5,
                    icon: "status_unknown",
                    link: "https://en.wikipedia.org/wiki/LInus",
                    name: "LInus",
                    value: 2,
                    color: "var(--nui-color-chart-four)",
                },
                {
                    id: "oracle",
                    x: "Oracle",
                    y: 5,
                    icon: "status_up",
                    link: "https://en.wikipedia.org/wiki/Oracle",
                    name: "Oracle",
                    value: 2,
                    color: "var(--nui-color-chart-five)",
                },
                {
                    id: "macOS",
                    x: "MacOS",
                    y: 2,
                    icon: "status_unmanaged",
                    link: "https://en.wikipedia.org/wiki/MacOS",
                    name: "MacOS",
                    value: 2,
                    color: "var(--nui-color-chart-six)",
                },
            ],
        },
    ];
}
