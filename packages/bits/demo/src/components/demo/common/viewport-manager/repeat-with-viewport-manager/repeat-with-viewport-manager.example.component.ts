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

import { HttpClient, HttpParams } from "@angular/common/http";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Injectable,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import { BehaviorSubject, firstValueFrom, Observable, of, Subject } from "rxjs";
import {
    catchError,
    delay,
    finalize,
    map,
    switchMap,
    takeUntil,
    tap,
} from "rxjs/operators";

import {
    DataSourceService,
    IDataSource,
    IDataSourceOutput,
    IFilter,
    IFilteringOutputs,
    IFilters,
    INovaFilteringOutputs,
    INovaFilters,
    LoggerService,
    RepeatComponent,
    SearchComponent,
    VirtualViewportManager,
} from "@nova-ui/bits";

const API_URL = "https://www.googleapis.com/books/v1/volumes";
const RESULTS_PER_PAGE = 20;

// collection of books that we've received from the Google Books backend API response
interface IGBooksApiResponse {
    kind: string;
    totalItems: number;
    items: IGBookBackendDTO[];
    [key: string]: any;
}

// main book model being received from the backend
interface IGBookBackendDTO {
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

// collection of books that we've transformed from the backend API
interface IGBooksFrontendCollection {
    books: IGBookFrontendDTO[];
    totalItems: number;
}

// main model being processed & rendered in the frontend
// PS: these are only the fields we decided we want to process
// since there are many other model proprieties in the backend DTO
interface IGBookFrontendDTO {
    title: string;
    authors: string;
}

/**
 * Example of a Remote DataSourceService which is using the API from Google Books API
 * to fetch data
 */
@Injectable()
export class GBooksDataSourceWithSearch
    extends DataSourceService<IGBookFrontendDTO>
    implements IDataSource
{
    public busy = new BehaviorSubject(false);

    // cache used to store our previous fetched results while scrolling
    // and more data is automatically fetched from the backend
    private cache = Array.from<IGBookFrontendDTO>({ length: 0 });
    private previousFilters: INovaFilters;

    private applyFilters$ = new Subject<IFilters>();

    constructor(private logger: LoggerService, private http: HttpClient) {
        super();

        this.applyFilters$
            .pipe(
                // cancel any previous requests
                switchMap((filters) => this.getData(filters))
            )
            .subscribe(async (res) => {
                this.outputsSubject.next(await this.getFilteredData(res));
            });
    }

    public async getFilteredData(
        booksData: IGBooksFrontendCollection
    ): Promise<IDataSourceOutput<INovaFilteringOutputs>> {
        return firstValueFrom(
            of(booksData).pipe(
                tap((response: IGBooksFrontendCollection) => {
                    // after receiving data we need to append it to our previous fetched results
                    this.cache = this.cache.concat(response.books);
                }),
                map((response: IGBooksFrontendCollection) => ({
                    result: {
                        repeat: { itemsSource: this.cache },
                        paginator: { total: response.totalItems },
                    },
                }))
            )
        );
    }

    // redefine parent method
    public async applyFilters(): Promise<void> {
        this.applyFilters$.next(this.getFilters());
    }

    private getData(
        filters: INovaFilters
    ): Observable<IGBooksFrontendCollection> {
        // Note: Every new search request should clear the
        // cache in order to correctly display a new set of data.
        if (this.isNewSearchTerm(filters.search)) {
            this.cache = [];
        }

        // fetch response from the backend
        return this.http
            .get<IGBooksApiResponse>(API_URL, {
                params: this.getRequestParams(filters),
            })
            .pipe(
                // show the loader
                tap(() => this.busy.next(true)),

                // since API being used (Google Books ) sends the response almost immediately,
                // we need to fake it takes longer to be able the show the spinner component
                // while the data is being received
                // PS: NOT to be used in real examples
                delay(300),

                // transform backend API response (IGBooksApiResponse)
                // to our frontend books collection (IGBooksFrontendCollection)
                map((response) => ({
                    books:
                        response.items?.map((volume) => ({
                            title: volume.volumeInfo.title,
                            authors:
                                volume.volumeInfo.authors?.join(", ") || "",
                        })) || [],
                    totalItems: response.totalItems,
                })),

                // error handle in case of any error
                catchError((e) => {
                    this.logger.error(e);
                    return of({
                        books: [],
                        totalItems: 0,
                    });
                }),

                finalize(() => {
                    // no matter if the backend response was successful or not,
                    // we need to hide our loader and reset the filters
                    this.busy.next(false);
                    this.previousFilters = filters;
                })
            );
    }

    // build query params specific to our backend API
    private getRequestParams(filters: INovaFilters): HttpParams {
        return (
            new HttpParams()
                // define the start page used by the virtual scroll internal "paginator"
                .set(
                    "startIndex",
                    filters.virtualScroll?.value?.start.toString() ?? ""
                )

                // specify the maximum number of items we need to fetch for each request
                .set("maxResults", String(RESULTS_PER_PAGE))

                // google books api requires some criteria to do the search
                .set(
                    "q",
                    filters.search ? `intitle:${filters.search.value}` : "_" // google books api requires some criteria to do the search
                )
        );
    }

    private isNewSearchTerm(search: IFilter<string> | undefined) {
        return (
            !isNil(search?.value) &&
            !isEqual(search?.value, this.previousFilters?.search?.value)
        );
    }
}

@Component({
    selector: "nui-repeat-with-viewport-manager-example",
    templateUrl: "./repeat-with-viewport-manager.example.component.html",
    providers: [VirtualViewportManager, GBooksDataSourceWithSearch],
})
export class RepeatWithViewportManagerExampleComponent
    implements OnInit, OnDestroy, AfterViewInit
{
    public books$ = new BehaviorSubject<IGBookBackendDTO[]>([]);
    public busy: boolean = false;

    @ViewChild(RepeatComponent) private repeat: RepeatComponent;
    @ViewChild(SearchComponent) private search: SearchComponent;

    private destroy$ = new Subject<void>();

    constructor(
        private viewportManager: VirtualViewportManager,
        private cd: ChangeDetectorRef,
        private dataSource: GBooksDataSourceWithSearch
    ) {}

    public ngOnInit(): void {
        this.dataSource.busy
            .pipe(
                tap((val) => {
                    this.busy = val;
                    this.cd.detectChanges();
                }),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public ngAfterViewInit(): void {
        // Note: registering filtering participants
        this.registerFilters();

        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(this.repeat.viewportRef)
            // Note: Initializing the stream with the desired page size, based on which
            // ViewportManager will perform the observations and will emit
            // distinct ranges with step equal to provided pageSize
            .observeNextPage$({ pageSize: RESULTS_PER_PAGE })
            .pipe(
                tap(() => {
                    this.dataSource.applyFilters();
                }),
                // Note: Using the same stream to subscribe to the outputsSubject and update the items list
                switchMap(() =>
                    this.dataSource.outputsSubject.pipe(
                        tap((outputs: IFilteringOutputs) => {
                            this.books$.next(
                                outputs.result.repeat.itemsSource || []
                            );
                            this.cd.detectChanges();
                        })
                    )
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onSearch(): void {
        this.doSearch();
    }

    public onCancelSearch(): void {
        this.doSearch();
    }

    private doSearch() {
        // Note: It is important to reset viewportManager to start page
        // so that the datasource performs the search with 1st page
        // emitFirstPage: false prevents viewportManager emitting first page after reset
        this.viewportManager.reset({ emitFirstPage: false });
        this.dataSource.applyFilters();
    }

    private registerFilters() {
        this.dataSource.registerComponent({
            virtualScroll: { componentInstance: this.viewportManager },
            search: { componentInstance: this.search },
        });
    }
}
