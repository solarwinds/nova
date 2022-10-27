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
import { Injectable } from "@angular/core";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import {
    catchError,
    delay,
    finalize,
    map,
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
    IFilter,
    IFilters,
    INovaFilteringOutputs,
    INovaFilters,
    LoggerService,
} from "@nova-ui/bits";
import { IDataSourceOutput } from "@nova-ui/dashboards";

import { GBOOKS_API_URL } from "./constants";

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

    public searchableColumn: searchableColumnType = "title"; // TODO: configure from pizzagna

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
        { id: "title", label: $localize`Title`, dataType: "string" },
        { id: "authors", label: $localize`Authors`, dataType: "string" },
    ];

    constructor(private logger: LoggerService, private http: HttpClient) {
        super();
        // Using Nova DataSourceFeatures implementation for the features
        this.features = new DataSourceFeatures(this.supportedFeatures);

        this.applyFilters$
            .pipe(switchMap((filters) => this.getData(filters)))
            .subscribe(async (res) => {
                this.outputsSubject.next(await this.getFilteredData(res));
            });
    }

    public async getFilteredData(
        booksData: IGBooksData
    ): Promise<IDataSourceOutput<INovaFilteringOutputs>> {
        return of(booksData)
            .pipe(
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
            .toPromise();
    }

    private getData(filters: INovaFilters): Observable<IGBooksData> {
        if (
            this.isNewSearchTerm(filters.search) ||
            filters.virtualScroll?.value.start === 0
        ) {
            this.cache = [];
        }
        this.busy.next(true);
        return this.http
            .get<IGBooksApiResponse>(this.getComposedUrl(filters))
            .pipe(
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
                    this.busy.next(false);
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
            (filters.virtualScroll?.value.end ?? 0) -
            (filters.virtualScroll?.value.start ?? 0)
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
    public async applyFilters() {
        this.applyFilters$.next(this.getFilters());
    }
}
