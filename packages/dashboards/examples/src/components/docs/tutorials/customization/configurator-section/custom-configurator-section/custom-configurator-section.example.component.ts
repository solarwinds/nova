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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Injectable,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
// eslint-disable-next-line import/no-deprecated
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { finalize, map, startWith } from "rxjs/operators";

import { DataSourceService, IFilteringOutputs } from "@nova-ui/bits";
import {
    ComponentRegistryService,
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IDashboard,
    IHasChangeDetector,
    IHasForm,
    IKpiData,
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

/**
 * A custom version of the KpiDescriptionConfigurationComponent provided by the dashboards framework.
 * ---
 * For this example, the existing background color selection functionality has been replaced by custom
 * template content.
 */
@Component({
    selector: "custom-kpi-description-configuration",
    template: `
        <nui-widget-editor-accordion
            [formGroup]="form"
            [state]="form | nuiWidgetEditorAccordionFormState | async"
        >
            <div accordionHeader class="d-flex align-items-center px-4 py-2">
                <nui-icon
                    class="align-self-start pt-2"
                    [icon]="
                        form | nuiFormHeaderIconPipe : 'widget_list' | async
                    "
                ></nui-icon>
                <div class="d-flex flex-column ml-4 pt-1">
                    <span class="nui-text-label" i18n>Description</span>
                    <div class="nui-text-secondary" [title]="subtitle$ | async">
                        {{ subtitle$ | async }}
                    </div>
                </div>
            </div>
            <div class="kpi-description-configuration__accordion-content">
                <div class="mb-4">
                    <nui-form-field
                        caption="Label"
                        i18n-caption
                        [control]="form.get('label')"
                        class="form-group"
                    >
                        <nui-textbox
                            formControlName="label"
                            placeholder="Set label"
                            i18n-placeholder
                        ></nui-textbox>
                    </nui-form-field>
                </div>

                <!-- Begin custom layout content -->
                <div
                    class="my-4 pt-1 px-3 pb-3 kpi-description-configuration__custom-content-container"
                >
                    <h5
                        class="kpi-description-configuration__custom-content-header"
                        i18n
                    >
                        Custom Content
                    </h5>
                    <div
                        class="kpi-description-configuration__custom-content"
                        i18n
                    >
                        The default version of this configurator section
                        displays a background color selector here.
                    </div>
                </div>
                <!-- End custom layout content -->

                <div class="mt-4" *ngIf="configurableUnits">
                    <nui-form-field
                        caption="Units"
                        i18n-caption
                        [control]="form.get('units')"
                        class="form-group"
                    >
                        <nui-textbox
                            formControlName="units"
                            placeholder="Units"
                            i18n-placeholder
                        ></nui-textbox>
                    </nui-form-field>
                </div>
            </div>
        </nui-widget-editor-accordion>
    `,
    styleUrls: ["./custom-configurator-section.example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
// Remember to declare this class in the parent module
export class CustomKpiDescriptionConfigurationComponent
    implements OnInit, OnChanges, IHasChangeDetector, IHasForm
{
    // Ensure that the lateLoadKey value matches class name
    public static lateLoadKey = "CustomKpiDescriptionConfigurationComponent";

    @Input() componentId: string;
    @Input() configurableUnits: boolean;

    @Input() label: string = "";
    @Input() units: string = "";

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public subtitle$: Observable<string>;

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            label: [this.label, [Validators.required]],
        });

        if (this.configurableUnits) {
            this.form.addControl("units", this.formBuilder.control(this.units));
        }

        const label = this.form.get("label");
        // eslint-disable-next-line import/no-deprecated
        const labelValue = label?.valueChanges.pipe(startWith(label?.value));

        // eslint-disable-next-line import/no-deprecated
        this.subtitle$ = combineLatest([
            labelValue?.pipe(map((t) => t || $localize`no label`)),
        ]).pipe(map((labels) => labels.join(", ")));

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.label) {
            this.form.patchValue({ label: changes.label.currentValue });
        }
        if (changes.units) {
            this.form.patchValue({ units: changes.units.currentValue });
        }
    }
}

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class AverageRatingKpiDataSource
    extends DataSourceService<IKpiData>
    implements OnDestroy
{
    // This is the ID we'll use to identify the provider
    public static providerId = "AverageRatingKpiDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    // In this example, getFilteredData is invoked every 10 minutes (Take a look at the refresher
    // provider definition in the widget configuration below to see how the interval is set)
    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            // *** Make a resource request to an external API (if needed)
            this.http
                .get("https://www.googleapis.com/books/v1/volumes/5MQFrgEACAAJ")
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.volumeInfo.averageRating,
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
 * A simple KPI data source to retrieve the ratings count of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class RatingsCountKpiDataSource
    extends DataSourceService<IKpiData>
    implements OnDestroy
{
    public static providerId = "RatingsCountKpiDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            this.http
                .get("https://www.googleapis.com/books/v1/volumes/5MQFrgEACAAJ")
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.volumeInfo.ratingsCount,
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
    selector: "custom-configurator-section-example",
    templateUrl: "./custom-configurator-section.example.component.html",
    styleUrls: ["./custom-configurator-section.example.component.less"],
})
export class CustomConfiguratorSectionExampleComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard | undefined;

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
        private componentRegistry: ComponentRegistryService,

        private changeDetectorRef: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        // Grab the widget's default template which will be needed as a parameter for setNode.
        const widgetTemplate = this.widgetTypesService.getWidgetType("kpi", 1);

        // Replace the default KPI description configuration component with our custom one.
        // Note: This could also be done in the parent module's constructor to give
        // multiple dashboards access to the same custom configurator section.
        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.TileDescriptionConfigComponentType,
            CustomKpiDescriptionConfigurationComponent.lateLoadKey
        );

        // Register the custom configurator section with the component registry to make it available
        // for late loading by the dashboards framework.
        this.componentRegistry.registerByLateLoadKey(
            CustomKpiDescriptionConfigurationComponent
        );

        // Register our data sources as dropdown options in the widget editor/configurator
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
                AverageRatingKpiDataSource.providerId,
                RatingsCountKpiDataSource.providerId,
            ]
        );

        // Register the data sources available for injection into the KPI tiles.
        // Note: Each tile of a KPI widget is assigned its own instance of a data source
        this.providerRegistry.setProviders({
            [AverageRatingKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AverageRatingKpiDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [HttpClient],
            },
            [RatingsCountKpiDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: RatingsCountKpiDataSource,
                deps: [HttpClient],
            },
        });

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example (see widgetConfig at the bottom of the file),
        // but this is where the widget's configuration could potentially be populated from a database
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

    /** Used for restoring widgets state */
    public reInitializeDashboard(): void {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
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
                        providerId: AverageRatingKpiDataSource.providerId,
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
