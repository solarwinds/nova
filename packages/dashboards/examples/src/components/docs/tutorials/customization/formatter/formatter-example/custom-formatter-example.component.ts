import { ListRange } from "@angular/cdk/collections";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataSourceService, IconService, INovaFilteringOutputs, INovaFilters, ISorterFilter, LoggerService } from "@nova-ui/bits";
import {
    ComponentRegistryService,
    DATA_SOURCE,
    FormatterConfiguratorComponent,
    IDashboard,
    IDataField,
    IDataSourceOutput,
    IFormatterDefinition,
    IHasChangeDetector,
    ITableWidgetColumnConfig,
    ITableWidgetSorterConfig,
    IWidget,
    IWidgets,
    PizzagnaLayer,
    ProviderRegistryService,
    RawFormatterComponent,
    TableFormatterRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService
} from "@nova-ui/dashboards";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import isEqual from "lodash/isEqual";
import orderBy from "lodash/orderBy";
import { BehaviorSubject } from "rxjs";

export const BREW_API_URL = "https://api.punkapi.com/v2/beers";

@Component({
    selector: "custom-formatter",
    host: { class: "d-flex" },
    template: `
<div class="d-inline-flex w-100">
    <div class="mr-2 d-flex align-items-center" *ngIf="icon && isAboveThreshold()">
        <nui-icon [icon]="icon"></nui-icon>
    </div>
    <div [attr.data-value]="data.value">
        {{ data.value }}
    </div>
</div>
`,
    styleUrls: ["./custom-formatter-example.component.less"],
})
export class CustomFormatterComponent implements IHasChangeDetector {
    public static lateLoadKey = "CustomFormatterComponent";

    constructor(public changeDetector: ChangeDetectorRef) { }

    @Input() public data: any;
    @Input() public icon: string;
    @Input() public threshold: string;

    public isAboveThreshold(): boolean {
        return (parseFloat(this.threshold) <= this.data.value);
    }
}

@Component({
    selector: "custom-formatter-configurator",
    styleUrls: ["./custom-formatter-example.component.less"],
    template: `
<form [formGroup]="form">
    <div class="mt-4" formGroupName="dataFieldIds">
        <nui-form-field caption="Value"
                        i18n-caption
                        [control]="dataFieldIds.controls['value']">
            <nui-select-v2 placeholder="Select value"
                           i18n-placeholder
                           formControlName="value">
                <nui-select-v2-option
                    *ngFor="let item of dropdownItems.value"
                    [value]="item.id">
                    {{item.label}}
                </nui-select-v2-option>
            </nui-select-v2>
            <nui-validation-message for="required" i18n>
                This field is required
            </nui-validation-message>
        </nui-form-field>
    </div>
    <div class="mt-4">
        <nui-form-field caption="Icon"
                        i18n-caption="caption | displayed above the icon selection field"
                        [control]="form.controls['icon']">
            <nui-select-v2 placeholder="Select icon"
                           i18n-placeholder
                           [displayValueTemplate]="iconSelectTemplate"
                           formControlName="icon"
                           [overlayConfig]="{width: 36}">
                <nui-select-v2-option class="d-flex align-items-center" *ngFor="let item of options" [value]="item" i18n>
                    <nui-icon [icon]="item"></nui-icon>
                </nui-select-v2-option>
            </nui-select-v2>
            <nui-validation-message for="required"
                                    i18n="error message | displayed on blur when icon selection is empty">
                    This field is required
            </nui-validation-message>
        </nui-form-field>
    </div>
    <div class="mt-4">
        <nui-form-field caption="A.B.V. Threshold"
                        i18n-caption="caption | displayed above the threshold textbox"
                        [control]="form.controls['threshold']">
                        <nui-textbox
                            type="number"
                            formControlName="threshold"
                            placeholder="Set threshold"
                            i18n-placeholder>
                        </nui-textbox>
            <nui-validation-message for="required"
                                    i18n="error message | displayed on blur when threshold selection is empty">
                    This field is required
            </nui-validation-message>
        </nui-form-field>
    </div>
</form>
<ng-template #iconSelectTemplate let-item let-open="open">
    <div class="nui-select-v2__value">
        <div *ngIf="item else empty" class="d-flex align-items-center nui-select-v2__value-content">
        <nui-icon [icon]="item"></nui-icon>
        </div>

        <nui-icon  [style.transform]="open ? 'rotate(180deg)' : ''"
            icon="caret-down"></nui-icon>
    </div>

    <ng-template #empty>
        <span class="nui-select-v2__placeholder">Select Item</span>
    </ng-template>

</ng-template>
`,
})

export class CustomFormatterConfiguratorComponent extends FormatterConfiguratorComponent implements OnInit, IHasChangeDetector {
    public static lateLoadKey = "CustomFormatterConfiguratorComponent";

    constructor(changeDetector: ChangeDetectorRef, formBuilder: FormBuilder, logger: LoggerService, public iconService: IconService) {
        super(changeDetector, formBuilder, logger);
    }

    public formatterFormGroup: FormGroup;
    // This array is where the icon names will be stored
    public options: string[] = [];

    public ngOnInit(): void {
        for (const icon of this.iconService.icons) {
            if (icon.category === "severity") {
                this.options.push(icon.name);
            }
        }
    }

    protected addCustomFormControls(form: FormGroup): void {
        form.addControl("icon", this.formBuilder.control("", Validators.required));
        form.addControl("threshold", this.formBuilder.control(null, Validators.required));
    }
}

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "custom-formatter-example",
    templateUrl: "./custom-formatter-example.component.html",
    styleUrls: ["./custom-formatter-example.component.less"],
})
export class CustomFormatterExampleComponent implements OnInit {
    public editMode: boolean = false;
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard | undefined;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,
        // In general, the ProviderRegistryService is used for making entities available for injection into dynamically loaded components.
        private providerRegistry: ProviderRegistryService,
        // Inject the ComponentRegistryService to make our custom component available for late loading by the dashboards framework
        private componentRegistry: ComponentRegistryService,
        private tableFormatterRegistryService: TableFormatterRegistryService,
        private changeDetectorRef: ChangeDetectorRef

    ) {
        // Register the custom configurator component with the component registry to make it available
        // for late loading by the dashboard framework.
        this.componentRegistry.registerByLateLoadKey(CustomFormatterConfiguratorComponent);
        // Register the custom formatter component with the component registry to make it available
        // for late loading by the dashboard framework.
        this.componentRegistry.registerByLateLoadKey(CustomFormatterComponent);

        // Grab the widget's default template which will be needed as a parameter for setNode below.
        const table = this.widgetTypesService.getWidgetType("table", 1);

        const tableFormatters: IFormatterDefinition[] = [
            {
                // This will be the component that will format the data
                componentType: RawFormatterComponent.lateLoadKey,
                // This is the label for what the formatter is selected in the drop down
                label: $localize`:table formatter|:No formatter`,
                // This says what datatype the formatter supports. If the value node is null, it accepts any data type.
                dataTypes: {
                    // @ts-ignore: Ignoring compiler error to keep the same flow
                    value: null,
                },
            },
            {
                componentType: CustomFormatterComponent.lateLoadKey,
                label: $localize`:table formatter|:Custom formatter`,
                // This is a custom configurator that will pop up below the formatter once it gets selected
                configurationComponent: CustomFormatterConfiguratorComponent.lateLoadKey,
                // This says what data types the formatter supports.
                // In this case, it supports abv values only.
                // If you look below in the table data source you'll see where we define our column's data types.
                dataTypes: {
                    value: ["abv"],
                },
            },
        ];

        // Registering the formatters
        this.tableFormatterRegistryService.addItems(tableFormatters);

        // This sets the table's datasource to have the BeerDataSource so the drop down is filled similar to the line above.
        this.widgetTypesService.setNode(table, "configurator", WellKnownPathKey.DataSourceProviders, [BeerDataSource.providerId]);

        // Registering the data source for injection into the widget.
        this.providerRegistry.setProviders({
            [BeerDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: BeerDataSource,
                // Any dependencies that need to be injected into the provider must be listed here
                deps: [],
            },
        });
    }

    public ngOnInit(): void {
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

export interface IBrewInfo {
    id: number;
    name: string;
    tagline: string;
    first_brewed: string;
    description: string;
    brewers_tips: string;
    abv: number;
}

export interface IBrewDatasourceResponse {
    brewInfo: IBrewInfo[];
    total: number;
}

export class BeerDataSource extends DataSourceService<IBrewInfo> {
    public static providerId = "BeerDataSource";

    private cache = Array.from<IBrewInfo>({ length: 0 });
    private lastSortValue?: ISorterFilter;
    private lastVirtualScroll?: ListRange;
    // For simplicity, the totalItems value is hard-coded here, but in a real-world scenario the value would likely be retrieved via an async backend call
    private totalItems: number = 325;

    public page: number = 1;
    public busy = new BehaviorSubject(false);

    public dataFields: Array<IDataField> = [
        { id: "id", label: "No", dataType: "number" },
        { id: "name", label: "Name", dataType: "string" },
        { id: "tagline", label: "Tagline", dataType: "string" },
        { id: "first_brewed", label: "First Brewed", dataType: "string" },
        { id: "description", label: "Description", dataType: "string" },
        { id: "brewers_tips", label: "Brewer's Tips", dataType: "string" },
        // We are giving this field a custom data type of 'abv' so the dropdown in the custom formatter configurator can use it to filter out other data types
        { id: "abv", label: "Alcohol By Volume", dataType: "abv" },
    ];

    constructor(private logger: LoggerService) {
        super();
    }

    public async getFilteredData(filters: INovaFilters): Promise<IDataSourceOutput<INovaFilteringOutputs>> {
        const start = filters.virtualScroll?.value?.start ?? 0;
        const end = filters.virtualScroll?.value?.end ?? 0;
        const delta = end - start;

        // Note: We should start with a clean cache every time first page is requested
        if (start === 0) {
            this.cache = [];
        }

        // This condition handles sorting. We want to sort columns without fetching another chunk of data.
        // Since the data is being fetched when scrolled, we compare virtual scroll indexes here in the condition as well.
        if (filters.sorter?.value) {
            if (!isEqual(this.lastSortValue, filters.sorter.value) && filters.virtualScroll?.value.start === 0 && !!this.lastVirtualScroll) {
                const totalPages = Math.ceil(delta ? this.totalItems / delta : 1);
                const itemsPerPage: number = Math.max(delta < 80 ? delta : 80, 1);
                let response: Array<IBrewInfo> | null = null;
                let map: IBrewDatasourceResponse;

                if (filters.sorter?.value?.direction === "desc") {
                    this.cache = [];
                    for (let i = 0; i < this.page; ++i) {

                        response = await
                            (await fetch(`${BREW_API_URL}/?page=${totalPages - i || 1}&per_page=${itemsPerPage}`)).json();

                        // since the last page contains only 5 items we need to fetch another page to give virtual scroll enough space to work
                        if (response && response.length < itemsPerPage) {
                            this.page++;
                        }
                        map = {
                            brewInfo: response?.map((result: IBrewInfo) => ({
                                id: result.id,
                                name: result.name,
                                tagline: result.tagline,
                                first_brewed: result.first_brewed,
                                description: result.description,
                                brewers_tips: result.brewers_tips,
                            })),
                            total: response?.length,
                        } as IBrewDatasourceResponse;
                        this.cache = totalPages - i !== 0 ? this.cache.concat(map.brewInfo) : this.cache;
                    }
                }

                if (filters.sorter?.value?.direction === "asc") {
                    this.cache = [];
                    for (let i = 0; i < this.page; i++) {
                        response = await
                            (await fetch(`${BREW_API_URL}/?page=${i + 1}&per_page=${itemsPerPage}`)).json();
                        map = {
                            brewInfo: response?.map((result: IBrewInfo) => ({
                                id: result.id,
                                name: result.name,
                                tagline: result.tagline,
                                first_brewed: result.first_brewed,
                                description: result.description,
                                brewers_tips: result.brewers_tips,
                            })),
                            total: response?.length,
                        } as IBrewDatasourceResponse;
                        this.cache = this.cache.concat(map.brewInfo);
                    }
                }

                this.lastSortValue = filters.sorter?.value;
                this.lastVirtualScroll = filters.virtualScroll?.value;

                return {
                    result: {
                        repeat: { itemsSource: this.sortData(this.cache, filters) },
                        paginator: { total: this.totalItems },
                        dataFields: this.dataFields,
                    },
                };
            }
        }

        this.busy.next(true);
        return new Promise(resolve => {
            setTimeout(() => {
                this.getData(start, end, filters).then((response: INovaFilteringOutputs) => {
                    if (!response) {
                        return;
                    }

                    this.cache = this.cache.concat(response.brewInfo);

                    this.dataSubject.next(this.cache);
                    resolve({
                        result: {
                            repeat: { itemsSource: this.sortData(this.cache, filters) },
                            paginator: { total: this.totalItems },
                            dataFields: this.dataFields,
                        },
                    });

                    this.lastSortValue = filters.sorter?.value;
                    this.lastVirtualScroll = filters.virtualScroll?.value;
                    this.busy.next(false);
                });
            }, 500);
        });
    }

    public async getData(start: number = 0, end: number = 20, filters: INovaFilters): Promise<INovaFilteringOutputs> {
        const delta = end - start;
        const totalPages = Math.ceil(delta ? this.totalItems / delta : 1);
        let response: Array<IBrewInfo> | null = null;
        // The api.punk.com is able to return only 80 items per page
        const itemsPerPage: number = Math.max(delta < 80 ? delta : 80, 1);

        if (filters.sorter?.value?.direction === "asc") {
            response = await (await fetch(`${BREW_API_URL}/?page=${this.page}&per_page=${itemsPerPage}`)).json();
        }

        if (filters.sorter?.value?.direction === "desc") {
            response = await (await fetch(`${BREW_API_URL}/?page=${totalPages - this.page}&per_page=${itemsPerPage}`)).json();
        }

        if (!filters.sorter) {
            response = await (await fetch(`${BREW_API_URL}/?page=${this.page}&per_page=${itemsPerPage}`)).json();
        }
        return {
            brewInfo: response?.map((result: IBrewInfo, i: number) => ({
                id: result.id,
                abv: result.abv,
                name: result.name,
                tagline: result.tagline,
                first_brewed: result.first_brewed,
                description: result.description,
                brewers_tips: result.brewers_tips,
            })),
            total: response?.length,
        } as IBrewDatasourceResponse;
    }

    private sortData(data: IBrewInfo[], filters: INovaFilters) {
        return orderBy(data, filters.sorter?.value?.sortBy, filters.sorter?.value?.direction as "desc" | "asc");
    }
}

export const widgetConfig: IWidget = {
    id: "tableWidgetId",
    type: "table",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
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
                        columns: [
                            {
                                id: "column1",
                                label: "Beer Name",
                                isActive: true,
                                width: 185,
                                formatter: {
                                    componentType: RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "name",
                                        },
                                    },
                                },
                            },
                            {
                                id: "column2",
                                label: "Tagline",
                                isActive: true,
                                width: 250,
                                formatter: {
                                    componentType: RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "tagline",
                                        },
                                    },
                                },
                            },
                            {
                                id: "column3",
                                label: "Alcohol By Volume",
                                isActive: true,
                                width: 150,
                                formatter: {
                                    componentType: CustomFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "abv",
                                        },
                                        icon: "severity_error",
                                        threshold: "5",
                                    },
                                },
                            },
                            {
                                id: "column4",
                                label: "Description",
                                isActive: true,
                                formatter: {
                                    componentType: RawFormatterComponent.lateLoadKey,
                                    properties: {
                                        dataFieldIds: {
                                            value: "description",
                                        },
                                    },
                                },
                            },
                        ] as ITableWidgetColumnConfig[],
                        sorterConfiguration: {
                            descendantSorting: false,
                            sortBy: "",
                        } as ITableWidgetSorterConfig,
                        hasVirtualScroll: true,
                    },
                },
            },
        },
    },
};
