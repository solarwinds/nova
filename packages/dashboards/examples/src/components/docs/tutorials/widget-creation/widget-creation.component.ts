import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, EventEmitter, Injectable, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { DataSourceService, IFilteringOutputs, ToastService, uuid } from "@nova-ui/bits";
import {
    DashboardComponent,
    DATA_SOURCE,
    DEFAULT_PIZZAGNA_ROOT,
    IDashboard,
    IDashboardPersistenceHandler,
    IDataSourceOutput,
    IKpiData,
    IProviderConfiguration,
    IRefresherProperties,
    IWidget,
    IWidgets,
    IWidgetSelector,
    IWidgetTemplateSelector,
    KpiComponent,
    NOVA_KPI_DATASOURCE_ADAPTER,
    PizzagnaLayer,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetClonerService,
    WidgetTypesService,
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { finalize, take, takeUntil } from "rxjs/operators";

// Interface of a widget item
interface IWidgetItem {
    name: string;
    widget: IWidget;
}

// This component acts as the first step, or page, in the wizard where the user selects a wizard type to create.
// It's recommended to have this component in a different file. For this tutorial, it's included in the same
// file for simplicity.
@Component({
    selector: "widget-template-selection",
    styleUrls: ["./widget-creation.component.less"],
    template: `
<div class="nui-widget-cloner">
    <nui-repeat [itemsSource]="widgetItems"
                [selection]="widgetSelection"
                selectionMode="singleWithRequiredSelection"
                (selectionChange)="onSelect($event)"
                [repeatItemTemplateRef]="widgetClonerItem">
    </nui-repeat>
</div>

<ng-template #widgetClonerItem let-item="item">
    <div class="nui-widget-cloner__item d-flex pt-2 pb-2 align-items-center">
        <div class="text-info ml-3">{{ item.name }}</div>
    </div>
</ng-template>
    `,
})
export class WidgetTemplateSelectionComponent implements IWidgetTemplateSelector, OnInit {
    // This output will notify the wizard that a widget has been selected.
    @Output() public widgetSelected = new EventEmitter<IWidget>();

    public widgetItems: IWidgetItem[] = [];
    public widgetSelection: IWidgetItem[];

    constructor(private widgetTypesService: WidgetTypesService) { }

    public ngOnInit() {
        // Here we combine the widget structure from the WidgetTypesService with the corresponding widget
        // configuration to create an array of widget objects for the itemSource on the repeat component.
        this.widgetItems = [
            {
                name: "Fully Configured KPI Widget",
                widget: this.widgetTypesService.mergeWithWidgetType(fullKpiWidgetConfig),
            },
            {
                name: "Unconfigured Proportional Widget",
                // Note that 'partialPropWidgetConfig' sets 'metadata.needsConfiguration' to true.
                // When this widget is selected in the wizard, the 'Create Widget' button will be hidden
                // to guide the user to the second step where they can complete the configuration.
                widget: this.widgetTypesService.mergeWithWidgetType(partialPropWidgetConfig),
            },
        ];

        // You can optionally auto-select a widget by doing the following
        // this.onSelect([this.widgetItems[0]]);
    }

    public onSelect(selectedItems: any[]) {
        // We emit the selected widget to communicate the selection to the configurator
        this.widgetSelected.emit(selectedItems[0].widget);
        this.widgetSelection = selectedItems;
    }
}


/**
 * A simple persistence handler that is tied to the widget editor directive
 */
@Injectable()
// The realizer of IDashboardPersistenceHandler may implement a trySubmit and/or a tryRemove method.
export class PersistenceHandler implements IDashboardPersistenceHandler {

    // This variable is just to show how to handle error handling.
    private persistenceSucceeded: boolean = true;

    // The example uses the toast service to demonstrate the
    // invocation of each of the persistence handler callbacks
    constructor(private toastService: ToastService) {
        // toastService options to let it sit on the page for 2 seconds.
        this.toastService.setConfig({
            timeOut: 2000,
        });
    }

    // This method will be invoked anytime the widget editor form gets submitted.
    public trySubmit = (widget: IWidget): Observable<IWidget> => {
        // Since we are working asynchronously, we'll return a subject. So, after the submit attempt
        // succeeds or fails, we can let the subscriber know the result.
        const subject = new Subject<IWidget>();

        if (!widget.id) {
            // Creates an id if the widget has no id.
            // (This step will make more sense in the context of the widget cloning tutorial
            // in which we handle the persistence of a newly created widget.)
            widget.id = uuid();
        }

        // For this example, we're using a setTimeout to mock an asynchronous persistence request to a backend
        setTimeout(() => {
            if (this.persistenceSucceeded) {
                // Passes along the new widget after one second.
                subject.next(widget);
                // Toast on the page on success.
                this.toastService.success({ title: $localize`Submit succeeded.` });
            } else {
                const errorText = $localize`Submit failed.`;
                // Toast on the page on failure.
                this.toastService.error({ title: errorText });
                // Makes the subject say there is an error.
                subject.error(errorText);
            }
            // Completes the subject so whoever subscribes to it knows its finished.
            subject.complete();
        }, 1000);

        // Returns the subject as an observable.
        return subject.asObservable();
    }

    // This method will be invoked anytime there's a widget removal attempt.
    public tryRemove = (widgetId: string): Observable<string> => {
        const subject = new Subject<string>();

        setTimeout(() => {
            if (this.persistenceSucceeded) {
                // Pass through the id of the widget that was removed.
                subject.next(widgetId);
                this.toastService.success({ title: $localize`Removal success` });
            } else {
                const errorText = $localize`Removal failed.`;
                this.toastService.error({ title: errorText });
                subject.error(errorText);
            }
            subject.complete();
        }, 1000);

        return subject.asObservable();
    }
}

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "widget-creation",
    templateUrl: "./widget-creation.component.html",
    styleUrls: ["./widget-creation.component.less"],
    // Here we provide our persistence handler at the component level; this can also be done in the module.
    providers: [PersistenceHandler],
})
export class WidgetCreationComponent implements OnInit {
    // The WidgetClonerService will need this for updating the dashboard
    @ViewChild(DashboardComponent, { static: true }) dashboardComponent: DashboardComponent;
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {
        // These values will be used to set the initial widget dimensions on creation.
        // If not set, they each default to 6.
        defaultItemCols: 3,
        defaultItemRows: 5,
    };

    // Boolean the dashboard takes in as an input; if it's set to true
    // the dashboard allows you to resize widgets and move them around.
    public editMode: boolean = false;

    // Subject used for auto-unsubscribing from subscriptions on component destruction
    private destroy$ = new Subject();

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,

        // In general, the ProviderRegistryService is used for making entities available for injection into dynamically loaded components.
        private providerRegistry: ProviderRegistryService,

        // Injecting the PersistenceHandler we created and assigning it to a property we use in the template.
        public persistenceHandler: PersistenceHandler,

        // Injecting the cloner service which is needed for opening up the cloner wizard.
        private widgetClonerService: WidgetClonerService
    ) { }

    public ngOnInit(): void {
        // Grabbing the widget's default template which will be needed as a parameter for setNode
        const kpiTemplate = this.widgetTypesService.getWidgetType("kpi", 1);
        const proportionalTemplate = this.widgetTypesService.getWidgetType("proportional", 1);

        // Registering our data sources as dropdown options in the widget editor/configurator
        // Note: This could also be done in the parent module's constructor so that
        // multiple dashboards could have access to the same widget template modification.
        this.widgetTypesService.setNode(
            // This is the template we grabbed above with getWidgetType
            proportionalTemplate,
            // Setting the editor/configurator part of the widget template
            "configurator",
            // This indicates which node you are changing and we want to change
            // the data source providers available for selection in the editor.
            WellKnownPathKey.DataSourceProviders,
            // Setting the data sources available for selection in the editor
            [RandomCitiesProportionalDataSource.providerId]
        );

        // Same as above, but for the KPI data sources
        this.widgetTypesService.setNode(
            kpiTemplate,
            "configurator",
            WellKnownPathKey.DataSourceProviders,
            [AverageRatingKpiDataSource.providerId, RatingsCountKpiDataSource.providerId]
        );

        // Registering the data sources available for injection into the KPI tiles and proportional widget.
        // Note: Each tile of a KPI widget is assigned its own instance of a data source.
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
            [RandomCitiesProportionalDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: RandomCitiesProportionalDataSource,
                deps: [],
            },
        });

        this.initializeDashboard();
    }

    public onCreateWidget() {
        const widgetSelector: IWidgetSelector = {
            // Template ref of the dashboard component.
            dashboardComponent: this.dashboardComponent,
            // A trySubmit function; in this case, we use the trySubmit from the PersistenceHandler created in the previous tutorial.
            trySubmit: this.persistenceHandler.trySubmit,
            // WidgetTemplateSelectionComponent will act as step one of the wizard to allow the user to select which widget will be cloned.
            widgetSelectionComponentType: WidgetTemplateSelectionComponent,
        };
        this.widgetClonerService.open(widgetSelector)
            .pipe(
                // Auto-unsubscribe after one emission or on component destruction
                take(1),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example (see widgetConfig at the bottom of the file),
        // but this is where the widget's configuration could potentially be populated from a database
        const kpiWidget = fullKpiWidgetConfig;
        const widgetIndex: IWidgets = {
            // Complete the KPI widget with information coming from its type definition
            [kpiWidget.id]: this.widgetTypesService.mergeWithWidgetType(kpiWidget),
        };

        // Setting the widget dimensions and position (this is for gridster)
        // Note: If no position is given for a widget the 'defaultItemCols' and 'defaultItemRows' properties
        // from the gridsterConfig will be used for the dimensions
        const positions: Record<string, GridsterItem> = {
            [kpiWidget.id]: {
                cols: 3,
                rows: 5,
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

// Interface for each data point in a proportional widget.
interface IProportionalWidgetData {
    id: string;
    name: string;
    data: number[];
    icon: string;
    link: string;
    value: string;
}

@Injectable()
export class RandomCitiesProportionalDataSource implements OnDestroy {
    public static providerId = "RandomCitiesProportionalDataSource";

    public outputsSubject = new Subject<IDataSourceOutput<IProportionalWidgetData[]>>();

    // Every time applyFilters gets ran we are changing the data source.
    public applyFilters() {
        setTimeout(() => {
            this.outputsSubject.next({ result: this.getRandomProportionalWidgetData() });
        }, 1000);
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }

    private getRandomProportionalWidgetData(): IProportionalWidgetData[] {
        return [
            {
                id: "Down",
                name: "Down",
                data: [Math.round(Math.random() * 100)],
                icon: "status_down",
                link: "https://en.wikipedia.org/wiki/Brno",
                value: "Brno",
            },
            {
                id: "Critical",
                name: "Critical",
                data: [Math.round(Math.random() * 100)],
                icon: "status_critical",
                link: "https://en.wikipedia.org/wiki/Kyiv",
                value: "Kyiv",
            },
            {
                id: "Warning",
                name: "Warning",
                data: [Math.round(Math.random() * 100)],
                icon: "status_warning",
                link: "https://en.wikipedia.org/wiki/Austin",
                value: "Austin",
            },
            {
                id: "Unknown",
                name: "Unknown",
                data: [Math.round(Math.random() * 100)],
                icon: "status_unknown",
                link: "https://en.wikipedia.org/wiki/Lisbon",
                value: "Lisbon",
            },
            {
                id: "Up",
                name: "Up",
                data: [Math.round(Math.random() * 100)],
                icon: "status_up",
                link: "https://en.wikipedia.org/wiki/Sydney",
                value: "Sydney",
            },
            {
                id: "Unmanaged",
                name: "Unmanaged",
                data: [Math.round(Math.random() * 100)],
                icon: "status_unmanaged",
                link: "https://en.wikipedia.org/wiki/Nur-Sultan",
                value: "Nur-Sultan",
            },
        ];
    }
}

/**
 * A simple KPI data source to retrieve the average rating of Harry Potter and the Sorcerer's Stone (book) via googleapis
 */
@Injectable()
export class AverageRatingKpiDataSource extends DataSourceService<IKpiData> implements OnDestroy {
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
            this.http.get("https://www.googleapis.com/books/v1/volumes/5MQFrgEACAAJ")
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
export class RatingsCountKpiDataSource extends DataSourceService<IKpiData> implements OnDestroy {
    public static providerId = "RatingsCountKpiDataSource";

    // Use this subject to communicate the data source's busy state
    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        return new Promise((resolve) => {
            this.http.get("https://www.googleapis.com/books/v1/volumes/5MQFrgEACAAJ")
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

const fullKpiWidgetConfig: IWidget = {
    id: "widget1",
    type: "kpi",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            [DEFAULT_PIZZAGNA_ROOT]: {
                "providers": {
                    [WellKnownProviders.Refresher]: {
                        "properties": {
                            // Configuring the refresher interval so that our data source is invoked every ten minutes
                            "interval": 60 * 10,
                            "enabled": true,
                        } as IRefresherProperties,
                    } as Partial<IProviderConfiguration>,
                },
            },
            "header": {
                "properties": {
                    "title": "Harry Potter and the Sorcerer's Stone",
                    "subtitle": "By J. K. Rowling",
                },
            },
            "tiles": {
                "properties": {
                    "nodes": ["kpi1"],
                },
            },
            "kpi1": {
                "id": "kpi1",
                "componentType": KpiComponent.lateLoadKey,
                "properties": {
                    "widgetData": {
                        "units": `out of 5 Stars`,
                        "label": `Average Rating`,
                    },
                },
                "providers": {
                    [WellKnownProviders.DataSource]: {
                        // Setting the data source providerId for the tile with id "kpi1"
                        "providerId": AverageRatingKpiDataSource.providerId,
                    } as IProviderConfiguration,
                    [WellKnownProviders.Adapter]: {
                        "providerId": NOVA_KPI_DATASOURCE_ADAPTER,
                        "properties": {
                            "componentId": "kpi1",
                            "propertyPath": "widgetData",
                        },
                    } as IProviderConfiguration,
                },
            },
        },
    },
};

const partialPropWidgetConfig: IWidget = {
    id: "widget2",
    type: "proportional",
    metadata: {
        // Set 'needsConfiguration' to true if the widget needs further configuration before it can be
        // placed on the dashboard. The "Create Widget" button will be hidden in the wizard when this
        // widget is selected.
        needsConfiguration: true,
    },
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            "header": {
                "properties": {
                    "title": "*New Proportional Widget*",
                },
            },
        },
    },
};
