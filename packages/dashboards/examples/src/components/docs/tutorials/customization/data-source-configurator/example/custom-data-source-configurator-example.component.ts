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

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {
    ChangeDetectorRef,
    Component,
    Inject,
    Injectable,
    Injector,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

import {
    DataSourceService,
    EventBus,
    IEvent,
    IFilteringOutputs,
    LoggerService,
} from "@nova-ui/bits";
import {
    ComponentRegistryService,
    ConfiguratorHeadingService,
    DataSourceConfigurationV2Component,
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IConfigurable,
    IDashboard,
    IKpiData,
    IProperties,
    IProviderConfiguration,
    IRefresherProperties,
    IWidget,
    IWidgets,
    KpiComponent,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";

/**
 * This component will serve as the data source accordion in the configurator.
 */
@Component({
    selector: "harry-potter-data-source-configurator",
    styleUrls: ["./custom-data-source-configurator-example.component.less"],
    template: `
        <nui-widget-editor-accordion
            [formGroup]="form"
            [state]="form | nuiWidgetEditorAccordionFormState | async"
        >
            <div accordionHeader class="d-flex align-items-center pl-4 py-2">
                <nui-icon
                    class="align-self-start pt-2"
                    [icon]="form | nuiFormHeaderIconPipe : 'database' | async"
                ></nui-icon>
                <div class="d-flex flex-column ml-4 pt1">
                    <span class="nui-text-label" i18n>Data Source</span>
                    <div
                        class="nui-text-secondary"
                        title="Harry Potter Books"
                        i18n-title
                        i18n
                    >
                        Harry Potter Books
                    </div>
                </div>
            </div>
            <div
                class="datasource-configuration__accordion-content"
                formGroupName="properties"
            >
                <nui-form-field
                    caption="Books"
                    [control]="form.get('properties')?.get('bookId')"
                >
                    <nui-select-v2
                        placeholder="Select book"
                        i18n-placeholder
                        [popupViewportMargin]="
                            configuratorHeading.height$ | async
                        "
                        formControlName="bookId"
                    >
                        <nui-select-v2-option
                            *ngFor="let book of books"
                            [value]="book.id"
                            [displayValueContext]="book"
                        >
                            {{ book.title }}
                        </nui-select-v2-option>
                    </nui-select-v2>
                </nui-form-field>
            </div>
            <div
                class="datasource-configuration__accordion-content"
                formGroupName="properties"
            >
                <nui-form-field
                    caption="Metrics"
                    [control]="form.get('properties')?.get('metric')"
                >
                    <nui-select-v2
                        placeholder="Select metric"
                        [popupViewportMargin]="
                            configuratorHeading.height$ | async
                        "
                        i18n-placeholder
                        formControlName="metric"
                    >
                        <nui-select-v2-option
                            *ngFor="let metric of metrics"
                            [value]="metric.id"
                        >
                            {{ metric.label }}
                        </nui-select-v2-option>
                    </nui-select-v2>
                </nui-form-field>
            </div>
        </nui-widget-editor-accordion>
    `,
})
@Injectable()
export class HarryPotterDataSourceConfiguratorComponent
    extends DataSourceConfigurationV2Component
    implements OnInit
{
    // This lateLoadKey allows the component to be able to be registered by the componentRegistry
    public static lateLoadKey = "HarryPotterDataSourceConfiguratorComponent";

    // Array of books that will populate the book select
    public books = [
        {
            id: "5MQFrgEACAAJ",
            title: $localize`Harry Potter and the Sorcerer's Stone`,
        },
        {
            id: "5iTebBW-w7QC",
            title: $localize`Harry Potter and the Chamber of Secrets`,
        },
    ];

    // Array of metrics that will populate the metric select
    public metrics = [
        {
            id: "averageRating",
            label: $localize`Average Rating`,
        },
        {
            id: "ratingsCount",
            label: $localize`Ratings Count`,
        },
    ];

    // These need to be injected because DataSourceConfigurationV2Component uses them
    constructor(
        changeDetector: ChangeDetectorRef,
        configuratorHeading: ConfiguratorHeadingService,
        formBuilder: FormBuilder,
        providerRegistryService: ProviderRegistryService,
        @Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
        injector: Injector,
        logger: LoggerService
    ) {
        super(
            changeDetector,
            configuratorHeading,
            formBuilder,
            providerRegistryService,
            eventBus,
            injector,
            logger
        );
    }

    // Overriding 'ngOnInit' to add custom controls to the 'properties' form group
    public ngOnInit(): void {
        super.ngOnInit();

        // Overriding the 'properties' control on the form to create a form group that accommodates our custom properties
        this.form.setControl(
            "properties",
            this.formBuilder.group({
                bookId: [this.properties?.bookId ?? "", Validators.required],
                metric: [this.properties?.metric ?? "", Validators.required],
            })
        );
        // The default data source control has a required validator we're removing that validator here since we aren't using it.
        this.form.setControl("dataSource", this.formBuilder.control(null));
        // Here we set the providerId to our only data source so when a new tile gets created it will default to it.
        this.form.get("providerId")?.setValue(AcmeKpiDataSource.providerId);
        // Here we subscribe to the form and if there are any changes we invoke the data source
        this.form.valueChanges.subscribe((value) => {
            if (!value.providerId) {
                return;
            }
            this.invokeDataSource(value);
        });
    }
}

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class AcmeKpiDataSource
    extends DataSourceService<IKpiData>
    implements OnDestroy, IConfigurable
{
    // This is the ID we'll use to identify the provider
    public static providerId = "AcmeKpiDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    public properties: IProperties;

    constructor(private http: HttpClient) {
        super();
    }

    // This function MUST be implemented in order to receive property updates from our configurator
    public updateConfiguration(properties: IProperties): void {
        // Saving the properties because we will need it for this data source.
        this.properties = properties;
    }

    // In this example, getFilteredData is invoked every 10 minutes (Take a look at the refresher
    // provider definition in the widget configuration below to see how the interval is set)
    public async getFilteredData(): Promise<IFilteringOutputs> {
        // For loading indicator to show
        this.busy.next(true);
        return new Promise((resolve) => {
            // *** Make a resource request to an external API (if needed)
            this.http
                .get(
                    `https://www.googleapis.com/books/v1/volumes/${this.properties?.bookId}`
                )
                // For loading indicator to be hidden
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.volumeInfo[this.properties?.metric],
                            },
                        });
                    },
                    error: (error: HttpErrorResponse) => {
                        resolve({
                            result: null,
                            error: {
                                type: error.status,
                            },
                        });
                    },
                });
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "custom-data-source-configurator-example",
    templateUrl: "./custom-data-source-configurator-example.component.html",
    styleUrls: ["./custom-data-source-configurator-example.component.less"],
})
export class CustomDataSourceConfiguratorExampleComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    // Boolean which dashboard takes in as an input if its true it allows you to move widgets around.
    public editMode: boolean = false;

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,

        // In general, the ProviderRegistryService is used for making entities available for injection into dynamically loaded components.
        private providerRegistry: ProviderRegistryService,

        // Inject the ComponentRegistryService to make our custom component available for late loading by the dashboards framework
        private componentRegistry: ComponentRegistryService
    ) {}

    public ngOnInit(): void {
        // Registering the new data source configurator so it can be used.
        this.componentRegistry.registerByLateLoadKey(
            HarryPotterDataSourceConfiguratorComponent
        );
        // Registering the data source for injection into the KPI tile.
        // Note: Each tile of a KPI widget is assigned its own instance of the data source
        this.providerRegistry.setProviders({
            [AcmeKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeKpiDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [HttpClient],
            },
        });

        const kpiWidgetTemplate = this.widgetTypesService.getWidgetType(
            "kpi",
            1
        );

        this.widgetTypesService.setNode(
            // This is the template we grabbed above with getWidgetType
            kpiWidgetTemplate,
            // We are setting the editor/configurator part of the widget template
            "configurator",
            // This is the path to go to the data source config component type.
            WellKnownPathKey.DataSourceConfigComponentType,
            // We are changing it to use the component we just created above instead of the default.
            HarryPotterDataSourceConfiguratorComponent.lateLoadKey
        );

        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const kpiWidget = widgetConfig;
        const widgetIndex: IWidgets = {
            // Complete the KPI widget with information coming from its type definition
            [kpiWidget.id]:
                this.widgetTypesService.mergeWithWidgetType(kpiWidget),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [kpiWidget.id]: {
                cols: 4,
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
    id: "widget1",
    type: "kpi",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                providers: {
                    [WellKnownProviders.Refresher]: {
                        properties: {
                            // Configuring the refresher interval so that our data source is invoked every ten minutes
                            interval: 60 * 10,
                            enabled: true,
                        } as IRefresherProperties,
                    } as Partial<IProviderConfiguration>,
                },
            },
            header: {
                properties: {
                    title: "Harry Potter and the Sorcerer's Stone",
                    subtitle: "By J. K. Rowling",
                },
            },
            tiles: {
                properties: {
                    nodes: ["kpi1"],
                },
            },
            kpi1: {
                id: "kpi1",
                componentType: KpiComponent.lateLoadKey,
                properties: {
                    widgetData: {
                        units: "out of 5 Stars",
                        label: "Average Rating",
                    },
                },
                providers: {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        providerId: AcmeKpiDataSource.providerId,
                        properties: {
                            bookId: "5MQFrgEACAAJ",
                            metric: "averageRating",
                        },
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        providerId: NOVA_KPI_DATASOURCE_ADAPTER,
                        properties: {
                            componentId: "kpi1",
                            propertyPath: "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
        },
    },
};
