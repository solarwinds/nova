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
    OnInit,
} from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import { BehaviorSubject, firstValueFrom, Observable, of, Subject } from "rxjs";
import {
    catchError,
    delay,
    finalize,
    map,
    // eslint-disable-next-line import/no-deprecated
    switchMap,
    tap,
} from "rxjs/operators";

import {
    DataSourceFeatures,
    DataSourceService,
    IDataField,
    IDataSource,
    IDataSourceFeatures,
    IDataSourceFeaturesConfiguration,
    IDataSourceOutput,
    IFilter,
    IFilters,
    INovaFilteringOutputs,
    INovaFilters,
    LoggerService,
} from "@nova-ui/bits";
import {
    DATA_SOURCE,
    IDashboard,
    ITableWidgetConfig,
    IWidget,
    IWidgets,
    ProviderRegistryService,
    WellKnownPathKey,
    WellKnownProviders,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { GBOOKS_API_URL } from "../../../../../prototypes/data/table/constants";

interface IGBooksApiResponse {
    kind: string;
    totalItems: number;
    items: IGBooksItemModel[];
    [key: string]: any;
}

interface IGBooksItemModel {
    id: string;
    volumeInfo: {
        title: string;
        subtitle: string;
        authors: string[];
        [key: string]: any;
    };
    accessInfo: { [key: string]: any };
    saleInfo: { [key: string]: any };
}

interface IGBooksData {
    books: IGBooksVolume[];
    totalItems: number;
}

interface IGBooksVolume {
    title: string;
    authors: string;
}

type searchableColumnType = "title" | "authors";

@Injectable()
export class AcmeTableGBooksDataSource
    extends DataSourceService<IGBooksVolume>
    implements IDataSource
{
    public static providerId = "AcmeTableGBooksDataSource";
    public static mockError = false;

    public searchableColumn: searchableColumnType = "title";

    public page: number = 1;
    public busy = new BehaviorSubject(false);
    public features: IDataSourceFeaturesConfiguration;

    private cache = Array.from<IGBooksVolume>({ length: 0 });
    private previousFilters: INovaFilters;
    // DataSource Features declared
    private supportedFeatures: IDataSourceFeatures = {
        search: { enabled: true },
        pagination: { enabled: true },
    };
    private columnToQueryParamMap: { [k in searchableColumnType]: string } = {
        title: "intitle",
        authors: "inauthor",
    };

    private applyFilters$ = new Subject<IFilters>();

    public dataFields: Array<IDataField> = [
        {
            id: "title",
            label: $localize`Title`,
            dataType: "string",
            sortable: false,
        },
        {
            id: "authors",
            label: $localize`Authors`,
            dataType: "string",
            sortable: false,
        },
    ];

    constructor(private logger: LoggerService, private http: HttpClient) {
        super();
        // Using Nova DataSourceFeatures implementation for the features
        this.features = new DataSourceFeatures(this.supportedFeatures);

        this.applyFilters$
            // eslint-disable-next-line import/no-deprecated
            .pipe(switchMap((filters) => this.getData(filters)))
            .subscribe(async (res) => {
                this.outputsSubject.next(await this.getFilteredData(res));
            });
    }

    public async getFilteredData(
        booksData: IGBooksData
    ): Promise<IDataSourceOutput<INovaFilteringOutputs>> {
        return firstValueFrom(
            of(booksData).pipe(
                tap((response) => {
                    this.cache = this.cache.concat(response.books);
                }),
                map((response) => ({
                    result: {
                        repeat: { itemsSource: this.cache },
                        paginator: { total: response.totalItems },
                        dataFields: this.dataFields,
                    },
                }))
            )
        );
    }

    private getData(filters: INovaFilters): Observable<IGBooksData> {
        if (
            this.isNewSearchTerm(filters.search) &&
            filters.virtualScroll?.value.start === 0
        ) {
            this.cache = [];
        }

        return this.http
            .get<IGBooksApiResponse>(this.getComposedUrl(filters))
            .pipe(
                tap(() => this.busy.next(true)),
                delay(300), // mock
                map((response) => ({
                    books:
                        response.items?.map((volume) => ({
                            title: volume.volumeInfo.title,
                            authors:
                                volume.volumeInfo.authors?.join(", ") || "",
                        })) || [],
                    totalItems: response.totalItems,
                })),
                catchError((e) => {
                    this.logger.error(e);
                    return of({
                        books: [],
                        totalItems: 0,
                    });
                }),
                finalize(() => {
                    this.busy.next(false);
                    this.previousFilters = filters;
                })
            );
    }

    private getComposedUrl(filters: INovaFilters) {
        const initialUrl = `${GBOOKS_API_URL}?q=`;
        const maxResults = `maxResults=${
            (filters.virtualScroll?.value.end || 0) -
            (filters.virtualScroll?.value.start || 0)
        }`;

        const virtualScrollPart = filters.virtualScroll
            ? `startIndex=${filters.virtualScroll.value.start}`
            : "";

        const searchQueryParam =
            this.columnToQueryParamMap[this.searchableColumn];
        const searchPart = filters.search
            ? `${searchQueryParam}:${filters.search.value}`
            : "_"; // google books api requires some criteria to do the search

        return `${initialUrl}${searchPart}&${maxResults}&${virtualScrollPart}&filter=full`;
    }

    private isNewSearchTerm(search: IFilter<string> | undefined) {
        return (
            !isNil(search?.value) &&
            !isEqual(search?.value, this.previousFilters?.search?.value)
        );
    }

    // redefine parent method
    public async applyFilters(): Promise<void> {
        this.applyFilters$.next(this.getFilters());
    }
}

/**
 * A component that instantiates the dashboard
 */
@Component({
    selector: "table-widget-search-example",
    templateUrl: "./table-widget-search.example.component.html",
    styleUrls: ["./table-widget-search.example.component.less"],
})
export class TableWidgetSearchExampleComponent implements OnInit {
    public dashboard: IDashboard | undefined;
    public gridsterConfig: GridsterConfig = {};
    public editMode: boolean = false;

    constructor(
        private widgetTypesService: WidgetTypesService,
        private providerRegistry: ProviderRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        const widgetTemplate = this.widgetTypesService.getWidgetType(
            "table",
            1
        );
        this.widgetTypesService.setNode(
            widgetTemplate,
            "configurator",
            WellKnownPathKey.DataSourceProviders,
            [AcmeTableGBooksDataSource.providerId]
        );

        this.providerRegistry.setProviders({
            [AcmeTableGBooksDataSource.providerId]: {
                provide: DATA_SOURCE,
                useClass: AcmeTableGBooksDataSource,
                deps: [LoggerService, HttpClient],
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
        const tableWidget = widgetConfig;
        const widgetIndex: IWidgets = {
            [tableWidget.id]:
                this.widgetTypesService.mergeWithWidgetType(tableWidget),
        };

        const positions: Record<string, GridsterItem> = {
            [tableWidget.id]: {
                cols: 12,
                rows: 6,
                y: 0,
                x: 0,
            },
        };

        this.dashboard = {
            positions,
            widgets: widgetIndex,
        };
    }
}

export const widgetConfig: IWidget = {
    id: "tableWidgetId",
    type: "table",
    pizzagna: {
        configuration: {
            header: {
                properties: {
                    title: "Google Books",
                },
            },
            table: {
                providers: {
                    [WellKnownProviders.DataSource]: {
                        providerId: AcmeTableGBooksDataSource.providerId,
                    },
                },
                properties: {
                    configuration: {
                        columns: [
                            {
                                id: "column1",
                                label: $localize`Title`,
                                isActive: true,
                                formatter: {
                                    componentType: "RawFormatterComponent",
                                    properties: {
                                        dataFieldIds: {
                                            value: "title",
                                        },
                                    },
                                },
                            },
                            {
                                id: "column2",
                                label: $localize`Author`,
                                isActive: true,
                                formatter: {
                                    componentType: "RawFormatterComponent",
                                    properties: {
                                        dataFieldIds: {
                                            value: "authors",
                                        },
                                    },
                                },
                            },
                        ],
                        sortable: false,
                        // define search configuration here
                        searchConfiguration: {
                            enabled: true,
                            // following properties below can be configured as well
                            // searchTerm: "search criteria here",
                            // searchDebounce: 300,
                        },
                        hasVirtualScroll: true,
                    } as ITableWidgetConfig,
                },
            },
        },
    },
};
