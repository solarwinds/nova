import {
    ChangeDetectorRef,
    Component,
    Injectable,
    Input,
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
    DataSourceConfigurationV2Component,
    DEFAULT_PIZZAGNA_ROOT,
    IConfigurable,
    IDashboard,
    IProperties,
    IProviderConfiguration,
    IProviderConfigurationForDisplay,
    IWidget,
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
import keyBy from "lodash/keyBy";
import cloneDeep from "lodash/cloneDeep";

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
    public editMode: boolean = true;

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
            "cartesian",
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
            [
                {
                    providerId: ProductByLineDataSource.providerId,
                    label: ProductByLineDataSource.providerId,
                } as IProviderConfigurationForDisplay,
                {
                    providerId: RevenuePerYearDataSource.providerId,
                    label: RevenuePerYearDataSource.providerId,
                } as IProviderConfigurationForDisplay,
                {
                    providerId: RevenueSeveralPerYearDataSource.providerId,
                    label: RevenueSeveralPerYearDataSource.providerId,
                } as IProviderConfigurationForDisplay,
                {
                    providerId: SeveralProductByLineDataSource.providerId,
                    label: SeveralProductByLineDataSource.providerId,
                } as IProviderConfigurationForDisplay,
            ]
        );

        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceConfigComponentType,
            DataSourceConfigurationV2Component.lateLoadKey
        );
        // Registering the data source for injection into the Proportional widget.
        this.providerRegistry.setProviders({
            [RevenuePerYearDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: RevenuePerYearDataSource,
                deps: [],
            },
            [ProductByLineDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: ProductByLineDataSource,
                deps: [],
            },
            [RevenueSeveralPerYearDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: RevenueSeveralPerYearDataSource,
                deps: [],
            },
            [SeveralProductByLineDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: SeveralProductByLineDataSource,
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
        const widgetsWithStructure = widgetConfigs.map((w) =>
            this.widgetTypesService.mergeWithWidgetType(w)
        );
        const widgetsIndex = keyBy(widgetsWithStructure, (w: IWidget) => w.id);

        // Finally, assigning the variables we created above to the dashboard
        this.dashboard = {
            positions: cloneDeep(positions),
            widgets: widgetsIndex,
        };
    }
}

const createCartesianWidget = (
    id: string,
    providerId: string,
    chartConfiguration: CartesianWidgetConfig,
    adapterProperties = {
        // Setting the series and corresponding labels to initially display on the chart
        series: [
            {
                id: "serie-1",
                label: "Data sample",
                selectedSeriesId: "serie-1",
            },
        ] as any[],
    }
): IWidget => ({
    id,
    type: "cartesian",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the chart
                        providerId: providerId,
                    } as IProviderConfiguration,
                },
            },
            header: {
                properties: {
                    title: "CartesianChart",
                    subtitle: "",
                },
            },
            chart: {
                providers: {
                    [WellKnownProviders.Adapter]: {
                        properties: adapterProperties,
                    } as Partial<IProviderConfiguration>,
                },
                properties: {
                    configuration: chartConfiguration,
                },
            },
        },
    },
});

const enum DataSample {
    productByLine = "productByLine",
    revenuePerYear = "revenuePerYear",
    companiesRevenuePerYear = "companiesRevenuePerYear",
    companiesProductByLine="companiesProductByLine",
}

/**
 * A simple proportional data source to retrieve beer review counts by city
 */
@Injectable()
export abstract class BaseMockDataSource<T extends IFilteringOutputs>
    extends DataSourceService<T>
    implements IDataSource<T>, IConfigurable, OnDestroy
{
    // This is the ID we'll use to identify the provider
    public static providerId = "BaseMockDataSource";
    @Input() properties: IProperties;
    public busy = new BehaviorSubject(false);
    private dataType: IDataField[] = [];
    dataFieldsConfig: IDataFieldsConfig = {
        dataFields$: new BehaviorSubject(this.dataType),
    };

    constructor() {
        super();
    }

    abstract getFilteredData(filters: T): Promise<IFilteringOutputs>;

    public updateConfiguration(properties: IProperties): void {
        this.properties = properties;
    }

    public async getMockData(dataSample: any): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            setTimeout(() => {
                const series = getCartesianDataBySample(dataSample);
                this.outputsSubject.next({
                    result: {
                        series,
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

@Injectable()
export class ProductByLineDataSource
    extends BaseMockDataSource<any>
    implements IDataSource<any>, IConfigurable, OnDestroy
{
    // This is the ID we'll use to identify the provider
    public static providerId = "ProductByLineDataSource";

    public async getFilteredData(filters: any): Promise<IFilteringOutputs> {
        return this.getMockData(DataSample.productByLine);
    }
}

@Injectable()
export class RevenuePerYearDataSource
    extends BaseMockDataSource<any>
    implements IDataSource<any>, IConfigurable, OnDestroy
{
    // This is the ID we'll use to identify the provider
    public static providerId = "RevenuePerYearDataSource";

    public async getFilteredData(filters: any): Promise<IFilteringOutputs> {
        return this.getMockData(DataSample.revenuePerYear);
    }
}

@Injectable()
export class RevenueSeveralPerYearDataSource
    extends BaseMockDataSource<any>
    implements IDataSource<any>, IConfigurable, OnDestroy
{
    // This is the ID we'll use to identify the provider
    public static providerId = "RevenueSeveralPerYearDataSource";

    public async getFilteredData(filters: any): Promise<IFilteringOutputs> {
        return this.getMockData(DataSample.companiesRevenuePerYear);
    }
}
@Injectable()
export class SeveralProductByLineDataSource
    extends BaseMockDataSource<any>
    implements IDataSource<any>, IConfigurable, OnDestroy
{
    // This is the ID we'll use to identify the provider
    public static providerId = "SeveralProductByLineDataSource";

    public async getFilteredData(filters: any): Promise<IFilteringOutputs> {
        return this.getMockData(DataSample.companiesProductByLine);
    }
}

const widgetConfigs: IWidget[] = [
    createCartesianWidget(
        "cartesianWidgetId_1",
        ProductByLineDataSource.providerId,
        {
            legendPlacement: LegendPlacement.None,
            enableZoom: false,
            preset: CartesianChartPreset.Bar,
            leftAxisLabel: "Products sold",
            scales: {
                x: { type: CartesianScaleType.Band },
                y: { type: CartesianScaleType.Linear },
            },
            chartColors: {
                ["serie-1"]: "var(--nui-color-chart-one)",
            } as any,
        } as CartesianWidgetConfig
    ),
    createCartesianWidget(
        "cartesianWidgetId_2",
        RevenuePerYearDataSource.providerId,
        {
            legendPlacement: LegendPlacement.None,
            enableZoom: false,
            leftAxisLabel: "Revenue $",
            preset: CartesianChartPreset.Line,
            scales: {
                x: { type: CartesianScaleType.Linear },
                y: { type: CartesianScaleType.Linear },
            },
        } as CartesianWidgetConfig
    ),
    createCartesianWidget(
        "cartesianWidgetId_3",
        SeveralProductByLineDataSource.providerId,
        {
            legendPlacement: LegendPlacement.None,
            enableZoom: false,
            leftAxisLabel: "Products companies sold",
            preset: CartesianChartPreset.Bar,
            scales: {
                x: { type: CartesianScaleType.Band },
                y: { type: CartesianScaleType.Linear },
            },
        } as CartesianWidgetConfig,
        {
            // Setting the series and corresponding labels to initially display on the chart
            series: [
                {
                    id: "apple-ltd",
                    label: "Apple",
                    selectedSeriesId: "apple-ltd",
                },
                {
                    id: "microsoft",
                    label: "Microsoft",
                    selectedSeriesId: "microsoft",
                },
            ],
        }
    ),
    createCartesianWidget(
        "cartesianWidgetId_4",
        RevenueSeveralPerYearDataSource.providerId,
        {
            legendPlacement: LegendPlacement.None,
            enableZoom: false,
            leftAxisLabel: "Revenue companies $",
            preset: CartesianChartPreset.Line,
            scales: {
                x: { type: CartesianScaleType.Linear },
                y: { type: CartesianScaleType.Linear },
            },
        } as CartesianWidgetConfig,
        {
            // Setting the series and corresponding labels to initially display on the chart
            series: [
                {
                    id: "apple-ltd",
                    label: "Apple",
                    selectedSeriesId: "apple-ltd",
                },
                {
                    id: "microsoft",
                    label: "Microsoft",
                    selectedSeriesId: "microsoft",
                },
            ],
        }
    ),
];

const positions: Record<string, GridsterItem> = {
    [widgetConfigs[0].id]: {
        cols: 6,
        rows: 6,
        y: 0,
        x: 0,
    },
    [widgetConfigs[1].id]: {
        cols: 6,
        rows: 6,
        y: 0,
        x: 6,
    },
    [widgetConfigs[2].id]: {
        cols: 6,
        rows: 6,
        y: 6,
        x: 0,
    },
    [widgetConfigs[3].id]: {
        cols: 6,
        rows: 6,
        y: 6,
        x: 6,
    },
};

export function getCartesianDataBySample(
    dataSample: DataSample
): CartesianWidgetData[] {
    switch (dataSample) {
        case DataSample.productByLine:
            return [
                {
                    id: "serie-1",
                    name: "data sample 1",
                    description: "data - product line",
                    data: productByLine.map((e) => ({
                        ...e,
                        id: e.productLine,
                        name: e.productLine,
                        value: e.unitsSold,
                        x: e.productLine,
                        y: e.unitsSold,
                    })),
                },
            ];
        case DataSample.companiesProductByLine:
            return [
                {
                    id: "apple-ltd",
                    name: "Apple products sold",
                    description: "Apple products sold",
                    data: productByLine.map((e) => ({
                        ...e,
                        id: e.productLine,
                        name: e.productLine,
                        value: e.unitsSold,
                        x: e.productLine,
                        y: e.unitsSold,
                    })),
                },
                {
                    id: "microsoft",
                    name: "Microsoft products sold",
                    description: "Microsoft products sold",
                    data: productByLine.map((e) => ({
                        ...e,
                        id: e.productLine,
                        name: e.productLine,
                        value: e.unitsSold*1.5,
                        x: e.productLine,
                        y: e.unitsSold*1.5,
                    })),
                },
            ];
        case DataSample.revenuePerYear:
            return [
                {
                    id: "serie-1",
                    name: "data sample 1",
                    description: "data - revenue per year",
                    data: revenuePerYear.map((e) => ({
                        ...e,
                        x: e.year,
                        y: e.revenue,
                    })),
                },
            ];
        case DataSample.companiesRevenuePerYear:
            return [
                {
                    id: "apple-ltd",
                    name: "Apple revenue",
                    description: "apple - revenue per year",
                    data: revenuePerYear.map((e) => ({
                        ...e,
                        x: e.year,
                        y: e.revenue * 2,
                    })),
                },
                {
                    id: "microsoft",
                    name: "Microsoft revenue",
                    description: "microsoft - revenue per year",
                    data: revenuePerYear.map((e) => ({
                        ...e,
                        x: e.year,
                        y: e.revenue,
                    })),
                },
            ];
    }
}

const productByLine = [
    { productLine: "Electronics", unitsSold: 15000 },
    { productLine: "Clothing", unitsSold: 20000 },
    { productLine: "Accessories", unitsSold: 18000 },
    { productLine: "Home Goods", unitsSold: 12000 },
];

const revenuePerYear = [
    { year: 20, revenue: 37000 },
    { year: 21, revenue: 60000 },
    { year: 22, revenue: 69000 },
    { year: 23, revenue: 53000 },
    { year: 24, revenue: 58000 },
];
//
// const now = moment().startOf("day");
//
// const visitorsPerYear = [
//     { date: now.clone().subtract(20, "day").toDate(), visitors: 30 },
//     { date: now.clone().subtract(19, "day").toDate(), visitors: 35 },
//     { date: now.clone().subtract(18, "day").toDate(), visitors: 33 },
//     { date: now.clone().subtract(17, "day").toDate(), visitors: 40 },
//     { date: now.clone().subtract(16, "day").toDate(), visitors: 35 },
//     { date: now.clone().subtract(15, "day").toDate(), visitors: 30 },
//     { date: now.clone().subtract(14, "day").toDate(), visitors: 35 },
//     { date: now.clone().subtract(13, "day").toDate(), visitors: 15 },
//     { date: now.clone().subtract(12, "day").toDate(), visitors: 30 },
//     { date: now.clone().subtract(11, "day").toDate(), visitors: 45 },
//     { date: now.clone().subtract(10, "day").toDate(), visitors: 60 },
//     { date: now.clone().subtract(9, "day").toDate(), visitors: 54 },
//     { date: now.clone().subtract(8, "day").toDate(), visitors: 42 },
//     { date: now.clone().subtract(7, "day").toDate(), visitors: 44 },
//     { date: now.clone().subtract(6, "day").toDate(), visitors: 54 },
//     { date: now.clone().subtract(5, "day").toDate(), visitors: 43 },
//     { date: now.clone().subtract(4, "day").toDate(), visitors: 76 },
//     { date: now.clone().subtract(3, "day").toDate(), visitors: 54 },
//     { date: now.clone().subtract(2, "day").toDate(), visitors: 42 },
//     { date: now.clone().subtract(1, "day").toDate(), visitors: 34 },
// ];

//
// lineChartData = [
//     { category: 'Electronics', revenue: 150000 },
//     { category: 'Clothing', revenue: 120000 },
//     { category: 'Home Appliances', revenue: 90000 },
//     { category: 'Books', revenue: 80000 },
//     { category: 'Toys', revenue: 110000 }
// ];
//
// lineChartData = [
//     { segment: 'Retail', revenue: 200000 },
//     { segment: 'Wholesale', revenue: 180000 },
//     { segment: 'Online', revenue: 250000 },
//     { segment: 'Corporate', revenue: 150000 }
// ];
// lineChartData = [
//     { region: 'North America', revenue: 350000 },
//     { region: 'Europe', revenue: 300000 },
//     { region: 'Asia-Pacific', revenue: 280000 },
//     { region: 'Latin America', revenue: 200000 }
// ];
// lineChartData = [
//     { productLine: 'Electronics', unitsSold: 15000 },
//     { productLine: 'Clothing', unitsSold: 20000 },
//     { productLine: 'Accessories', unitsSold: 18000 },
//     { productLine: 'Home Goods', unitsSold: 12000 }
// ];
// lineChartData = [
//     { department: 'Sales', revenue: 280000 },
//     { department: 'Marketing', revenue: 220000 },
//     { department: 'Finance', revenue: 180000 },
//     { department: 'Operations', revenue: 240000 }
// ];
