import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injectable,
    OnDestroy,
    OnInit,
    ViewChild,
} from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";

import {
    DataSourceService,
    IFilteringOutputs,
    INovaFilteringOutputs,
    INovaFilters,
    VirtualViewportManager,
} from "@nova-ui/bits";

@Component({
    selector: "nui-table-virtual-scroll-real-api-example",
    templateUrl: "./table-virtual-scroll-real-api.example.component.html",
    styleUrls: ["./table-virtual-scroll-real-api.example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [VirtualViewportManager],
})
export class TableVirtualScrollRealApiExampleComponent
    implements AfterViewInit, OnDestroy, OnInit
{
    @ViewChild(CdkVirtualScrollViewport, { static: false })
    viewport: CdkVirtualScrollViewport;
    // This value is obtained from the server and used to evaluate the total number of pages to display
    private _totalItems: number = 0;
    private _isBusy: boolean = false;
    private dataSource: RandomuserTableDataSource;
    private onDestroy$: Subject<void> = new Subject<void>();

    get totalItems() {
        return this._totalItems;
    }

    get isBusy() {
        return this._isBusy;
    }

    // The range of items to fetch from the server and display within the viewport.
    public range: number = 40;
    // The dynamically changed array of items to render by the table
    public users: IRandomUserTableModel[] = [];
    public displayedColumns: string[] = [
        "no",
        "nameTitle",
        "nameFirst",
        "nameLast",
        "gender",
        "country",
        "city",
        "postcode",
        "email",
        "cell",
    ];
    public gridHeight = 400;
    public makeSticky: boolean = true;

    constructor(
        private cd: ChangeDetectorRef,
        private viewportManager: VirtualViewportManager
    ) {
        this.dataSource = new RandomuserTableDataSource();
    }

    ngOnInit() {
        this.dataSource.busy
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((busy) => {
                this._isBusy = busy;
            });
    }

    ngAfterViewInit(): void {
        this.registerVirtualScroll();
        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(this.viewport)
            // Note: Initializing the stream with the desired page size, based on which
            // VirtualViewportManager will perform the observations and will emit
            // distinct ranges with step equal to provided pageSize
            .observeNextPage$({ pageSize: this.range })
            .pipe(
                // Note: In case we know the total number of items we can stop the stream when dataset end is reached
                // Otherwise we can let VirtualViewportManager to stop when last received page range will not match requested range
                filter((range) =>
                    this.totalItems ? this.totalItems >= range.end : true
                ),
                tap(async () => this.dataSource.applyFilters()),
                // Note: Using the same stream to subscribe to the outputsSubject and update the items list
                switchMap(() =>
                    this.dataSource.outputsSubject.pipe(
                        tap((outputs: IFilteringOutputs) => {
                            this._totalItems = outputs.totalItems;
                            this.users = outputs.repeat.itemsSource || [];
                            this.cd.detectChanges();
                        })
                    )
                ),
                takeUntil(this.onDestroy$)
            )
            .subscribe();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private registerVirtualScroll() {
        this.dataSource.registerComponent({
            virtualScroll: { componentInstance: this.viewportManager },
        });
    }
}

@Injectable()
export class RandomuserTableDataSource extends DataSourceService<IRandomUserTableModel> {
    private readonly url = "https://randomuser.me/api";
    private readonly seed = "sw";

    private cache = Array.from<IRandomUserTableModel>({ length: 0 });
    public busy = new BehaviorSubject(false);

    public async getFilteredData(
        filters: INovaFilters
    ): Promise<INovaFilteringOutputs> {
        this.busy.next(true);
        const virtualScrollFilter =
            filters.virtualScroll && filters.virtualScroll.value;
        const start = virtualScrollFilter
            ? filters.virtualScroll?.value.start
            : 0;
        const end = virtualScrollFilter ? filters.virtualScroll?.value.end : 0;

        // We're returning Promise with setTimeout here to make the response from the server longer, as the API being used sends responses
        // almost immediately. We need it longer to be able the show the spinner component on data load
        return new Promise((resolve) => {
            setTimeout(() => {
                this.getData(start, end).then(
                    (response: UsersQueryResponse | undefined) => {
                        if (!response) {
                            return;
                        }

                        this.cache = this.cache.concat(response.users);
                        this.dataSubject.next(this.cache);
                        resolve({
                            repeat: {
                                itemsSource: this.cache,
                            },
                            // This API can return thousands of results, however doesn't return the max number of results,
                            // so we set the max number of result manually here.
                            totalItems: 200,
                            start: response.start,
                        });
                        this.busy.next(false);
                    }
                );
            }, 2000);
        });
    }

    public async getData(
        start: number = 0,
        end: number = 20
    ): Promise<UsersQueryResponse | undefined> {
        let response: IRandomUserResponse | undefined;
        const delta: number = end - start;
        try {
            response = await (
                await fetch(
                    `${this.url}/?page=${end / delta}&results=${delta}&seed=${
                        this.seed
                    }`
                )
            ).json();
            return {
                users: response?.results.map(
                    (result: IRandomUserResults, i: number) => ({
                        no: this.cache.length + i + 1,
                        nameTitle: result.name.title,
                        nameFirst: result.name.first,
                        nameLast: result.name.last,
                        gender: result.gender,
                        country: result.location.country,
                        city: result.location.city,
                        postcode: result.location.postcode,
                        email: result.email,
                        cell: result.cell,
                    })
                ),
                total: response?.results.length,
                start: start,
            } as UsersQueryResponse;
        } catch (e) {
            console.error(
                "Error responding from server. Please visit https://https://randomuser.me/ to see if it's available"
            );
        }
    }
}

export interface UsersQueryResponse {
    users: IRandomUserTableModel[];
    total: number;
    start: number;
}

export interface IRandomUserResponse {
    info: Array<IRandomUserInfo>;
    results: Array<IRandomUserResults>;
}

export interface IRandomUserInfo {
    page: number;
    results: number;
    seed: string;
    version: string;
}

export interface IRandomUserResults {
    cell: string;
    dob: {
        age: number;
        date: string;
    };
    email: string;
    gender: string;
    id: any;
    location: IRandomUserLocation;
    login: {
        md5: string;
        password: string;
        salt: string;
        sha1: string;
        sha256: string;
        username: string;
        uuid: string;
    };
    name: {
        title: string;
        first: string;
        last: string;
    };
    nat: string;
    phone: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    registered: {
        date: string;
        age: number;
    };
}

export interface IRandomUserTableModel {
    no: number;
    nameTitle: string;
    nameFirst: string;
    nameLast: string;
    gender: string;
    country: string;
    city: string;
    postcode: number;
    email: string;
    cell: string;
}

export interface IRandomUserLocation {
    city: string;
    coordinates: { latitude: string; longitude: string };
    country: string;
    postcode: number;
    state: string;
    street: { number: number; name: string };
    timezone: any;
}
