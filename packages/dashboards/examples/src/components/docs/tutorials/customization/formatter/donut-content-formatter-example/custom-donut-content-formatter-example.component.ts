import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, Injectable, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataSourceService, IconService, IDataSource, IFilteringOutputs, LoggerService } from "@nova-ui/bits";
import { ChartAssist, IAccessors, IChartAssistEvent, IChartAssistSeries } from "@nova-ui/charts";
import {
    ComponentRegistryService,
    DATA_SOURCE,
    DonutChartFormatterConfiguratorComponent,
    DonutContentPercentageConfigurationComponent,
    DonutContentPercentageFormatterComponent,
    DonutContentSumFormatterComponent,
    IDashboard,
    IFormatterDefinition,
    IHasChangeDetector,
    IProperties,
    IProportionalWidgetChartOptions,
    IProportionalWidgetConfig,
    IProviderConfiguration,
    IWidget,
    IWidgets,
    LegendPlacement,
    PizzagnaLayer,
    ProportionalWidgetChartTypes,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

export enum Units {
    Days = "Day(s)",
    Weeks = "Week(s)",
    Hours = "Hour(s)",
}

@Component({
    selector: "custom-donut-content-formatter",
    host: { class: "d-flex flex-column align-items-center" },
    template: `<ng-container>
                    <div class="nui-text-panel">
                        <!-- First we look at the metric currently being hovered,
                             then, if not interaction occurs we take currently selected metric,
                             finally, we fall back to the very first element if none were selected so far -->
                        {{ chartMetric || properties?.currentMetric || data[0].id }}
                    </div>
                    <div class="nui-text-page">
                        {{ chartContent }}
                    </div>
                    <div class="nui-text-secondary">
                        {{ units }}
                    </div>
               </ng-container>`,
    styleUrls: ["./custom-donut-content-formatter-example.component.less"],
})
export class CustomDonutContentFormatterComponent implements IHasChangeDetector, OnInit, OnChanges {
    public static lateLoadKey = "CustomDonutContentFormatterComponent";

    // Used to emphasize the chart series when user interacts either with the chart legend, or chart segments.
    public emphasizedSeriesData: IChartAssistSeries<IAccessors> | undefined;

    // Current raw value of the metric to display
    public currentMetricData: number;

    // Metric value rendered inside the template, when user selects a metric, and gets automatically recalculated depending on selected units
    public chartContent: number;

    // Metric value rendered inside the template, when user interacts with either chart legend, or chart segments
    public chartMetric: number;

    // Units which user can select from the configuration
    public units: Units = Units.Days;

    private destroy$: Subject<any> = new Subject();

    constructor(public changeDetector: ChangeDetectorRef) { }

    // The data we receive from the chart, including metrics names and their values
    @Input() data: IChartAssistSeries<IAccessors>[];

    // We use this chart assist instance to subscribe to the events triggered when an interaction with the chart occurs
    @Input() chartAssist: ChartAssist;

    // These are the current properties from pizzagna. Used to use data set at the configuration layer
    @Input() properties: IProperties;

    ngOnChanges(changes: SimpleChanges) {

        if (changes.properties || !this.properties) {
            // If current metric is not in the list of metrics any more we fall back to the very first one from the list we get from the datasource
            this.currentMetricData = this.data.find(item => item.id === this.properties?.currentMetric)?.data[0] || this.data[0].data[0];

            // We either take the selected value, or fall back to the preselected default one
            this.units = this.properties?.units || this.units;
        }

        this.setProperContentValue();
    }

    ngOnInit() {
        // Here 'chartAssistSubject' is the entity that emits events every time user interacts with either chart legend, or chart segments.
        // Subscribing to properly react on these kind of events
        this.chartAssist
            .chartAssistSubject
            .pipe(
                tap((data: IChartAssistEvent) => this.emphasizedSeriesData = this.data.find(item => item.id === data.payload.seriesId)),
                tap(() => this.setProperContentValue()),
                tap(() => this.setProperMetricValue()),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public getProperCovertedData(emphData: number) {
        // Recalculating data depending on the units user selected from the configuration view
        switch (this.units) {

            case(Units.Weeks):
                return this.emphasizedSeriesData
                            ? this.convertoToWeeks(emphData)
                            : this.convertoToWeeks(this.currentMetricData);

            case(Units.Hours):
                return this.emphasizedSeriesData
                            ? this.convertoToHours(emphData)
                            : this.convertoToHours(this.currentMetricData);

            default:
                return this.emphasizedSeriesData
                            ? emphData
                            : this.currentMetricData;
        }
    }

    public setProperContentValue() {
        this.chartContent = this.getProperCovertedData(this.emphasizedSeriesData?.data[0]);
    }

    public setProperMetricValue() {
        return this.chartMetric =
                this.emphasizedSeriesData
                    ? this.data.find(item => this.getProperCovertedData(item.data[0]) === this.getProperCovertedData(this.emphasizedSeriesData?.data[0]))?.id
                    // if not metric was initially selected we fall back to the very first one
                    : (this.properties?.currentMetric || this.data[0].id);
    }

    private convertoToWeeks(days: number | undefined): number {
        return days
                ? Number((days / 7).toFixed(2))
                : 0;
    }

    private convertoToHours(days: number | undefined): number {
        return days
                ? Number((days * 24).toFixed(2))
                : 0;
    }
}

@Component({
    selector: "custom-donut-content-formatter-configurator",
    styleUrls: ["./custom-donut-content-formatter-example.component.less"],
    template: `
<div [formGroup]="form">
    <div class="mt-4">
        <nui-form-field caption="Metrics"
                        i18n-caption
                        class="mb-3"
                        [control]="currentMetric">
            <nui-select-v2 formControlName="currentMetric" [formControl]="currentMetric">
                <nui-select-v2-option *ngFor="let itemValue of dsOutput?.result"
                                      [value]="itemValue?.id">
                    {{itemValue?.name}}
                </nui-select-v2-option>
            </nui-select-v2>
            <nui-validation-message for="required" i18n>
                This field is required
            </nui-validation-message>
        </nui-form-field>
    </div>
    <div class="mt-4">
        <nui-form-field caption="Units"
                        i18n-caption
                        class="mb-3"
                        [control]="form.controls['units']">
            <nui-select-v2 formControlName="units" [formControl]="form.controls['units']">
                <nui-select-v2-option *ngFor="let itemValue of availableUnits"
                                      [value]="itemValue">
                    {{itemValue}}
                </nui-select-v2-option>
            </nui-select-v2>
            <nui-validation-message for="required" i18n>
                This field is required
            </nui-validation-message>
        </nui-form-field>
    </div>
</div>
`,
})

export class CustomDonutContentFormatterConfiguratorComponent extends DonutChartFormatterConfiguratorComponent
                                                              implements OnChanges, OnInit, IHasChangeDetector {
    public static lateLoadKey = "CustomFormatterConfiguratorComponent";

    constructor(changeDetector: ChangeDetectorRef, formBuilder: FormBuilder, logger: LoggerService, public iconService: IconService) {
        super(changeDetector, formBuilder, logger);
    }

    public availableUnits: Units[] = [Units.Days, Units.Hours, Units.Weeks];

    protected addCustomFormControls(form: FormGroup): void {
        form.addControl("units", this.formBuilder.control(Units.Days, Validators.required));
    }
}

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "custom-donut-content-formatter-example",
    templateUrl: "./custom-donut-content-formatter-example.component.html",
    styleUrls: ["./custom-donut-content-formatter-example.component.less"],
})
export class CustomDonutContentFormatterExampleComponent implements OnInit {
    public editMode: boolean = false;
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,
        // In general, the ProviderRegistryService is used for making entities available for injection into dynamically loaded components.
        private providerRegistry: ProviderRegistryService,
        // Inject the ComponentRegistryService to make our custom component available for late loading by the dashboards framework
        private componentRegistry: ComponentRegistryService
    ) {
        // Register the custom configurator component with the component registry to make it available
        // for late loading by the dashboard framework.
        this.componentRegistry.registerByLateLoadKey(CustomDonutContentFormatterConfiguratorComponent);
        // Register the custom formatter component with the component registry to make it available
        // for late loading by the dashboard framework.
        this.componentRegistry.registerByLateLoadKey(CustomDonutContentFormatterComponent);

        // Grab the widget's default template which will be needed as a parameter for setNode below.
        const proportional = this.widgetTypesService.getWidgetType("proportional", 1);

        const donutFormatters: IFormatterDefinition[] = [
            {
                componentType: DonutContentSumFormatterComponent.lateLoadKey,
                label: $localize`Sum`,
            } as IFormatterDefinition,
            {
                componentType: DonutContentPercentageFormatterComponent.lateLoadKey,
                label: $localize`Percentage`,
                configurationComponent: DonutContentPercentageConfigurationComponent.lateLoadKey,
            } as IFormatterDefinition,
            {
                componentType: CustomDonutContentFormatterComponent.lateLoadKey,
                label: $localize`Custom`,
                // This is a custom configurator that will pop up below the formatter once it gets selected
                configurationComponent: CustomDonutContentFormatterConfiguratorComponent.lateLoadKey,
            } as IFormatterDefinition,
        ];

        this.widgetTypesService.setNode(
            // This is the template we grabbed above with getWidgetType
            proportional,
            // We are setting the editor/configurator part of the widget template
            "configurator",
            // This indicates which node you are changing and we want to change the formatters available for selection in the editor.
            WellKnownPathKey.Formatters,
            // We are setting the available formatters with the array we created above.
            donutFormatters
        );

        // This sets the donut chart's datasource to have the StatusesExampleDatasource so the drop down is filled similar to the line above.
        this.widgetTypesService.setNode(proportional, "configurator", WellKnownPathKey.DataSourceProviders, [StatusesExampleDatasource.providerId]);

        // Registering the data source for injection into the widget.
        this.providerRegistry.setProviders({
            [StatusesExampleDatasource.providerId]: {
                provide: DATA_SOURCE,
                useClass: StatusesExampleDatasource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [],
            },
        });
    }

    public ngOnInit(): void {
        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const proportionalWidget = widgetConfig;
        const widgetIndex: IWidgets = {
            // Enhance the widget with information coming from it's type definition
            [proportionalWidget.id]: this.widgetTypesService.mergeWithWidgetType(proportionalWidget),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [proportionalWidget.id]: {
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

export interface IStatusesWidgetData {
    id: string;
    name: string;
    data: number[];
}

export const randomStatusesWidgetData: IStatusesWidgetData[] = [
        {
            id: "Down",
            name: "Down",
            data: [Math.round(Math.random() * 100)],
        },
        {
            id: "Critical",
            name: "Critical",
            data: [Math.round(Math.random() * 100)],
        },
        {
            id: "Warning",
            name: "Warning",
            data: [Math.round(Math.random() * 100)],
        },
        {
            id: "Unknown",
            name: "Unknown",
            data: [Math.round(Math.random() * 100)],
        },
        {
            id: "Up",
            name: "Up",
            data: [Math.round(Math.random() * 100)],
        },
        {
            id: "Unmanaged",
            name: "Unmanaged",
            data: [Math.round(Math.random() * 100)],
        },
];

@Injectable()
export class StatusesExampleDatasource extends DataSourceService<IStatusesWidgetData>
                                       implements IDataSource<IStatusesWidgetData>, OnDestroy {
    public static providerId = "StatusesExampleDatasource";

    public busy = new Subject<boolean>();

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    result: randomStatusesWidgetData,
                });
                this.busy.next(false);
            }, 1000);
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

export const widgetConfig: IWidget = {
    id: "proportionalWidgetId",
    type: "proportional",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            "header": {
                "properties": {
                    title: "Proportional Widget!",
                    subtitle: "Proportional widget with legend formatters",
                },
            },
            "chart": {
                "providers": {
                    [WellKnownProviders.DataSource]: {
                        providerId: StatusesExampleDatasource.providerId,
                    } as IProviderConfiguration,
                },
                properties: {
                    configuration: {
                        interactive: true,
                        chartOptions: {
                            type: ProportionalWidgetChartTypes.DonutChart,
                            legendPlacement: LegendPlacement.Right,
                            contentFormatter: {
                                componentType: CustomDonutContentFormatterComponent.lateLoadKey,
                                properties: {
                                    // here you can set the default value for the metric you receive. If not set the first one from the list will be taken
                                    currentMetric: "Down",
                                    // here you set the default value for your custom controls. If not set the first one from the list will be taken
                                    units: Units.Weeks,
                                },
                            },
                        } as IProportionalWidgetChartOptions,
                        chartColors: [
                            "var(--nui-color-chart-eight)",
                            "var(--nui-color-chart-nine)",
                            "var(--nui-color-chart-ten)",
                        ],
                    } as IProportionalWidgetConfig,
                },
            },
        },
    },
};
