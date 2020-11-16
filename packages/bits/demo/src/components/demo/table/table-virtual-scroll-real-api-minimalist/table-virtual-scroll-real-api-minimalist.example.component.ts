import { ListRange } from "@angular/cdk/collections";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    forwardRef,
    OnDestroy,
    OnInit,
    ViewChild
} from "@angular/core";
import {
    IFilter,
    IFilteringOutputs,
    SearchService,
    SelectorService,
    TableComponent,
    TableVirtualScrollDirective,
} from "@solarwinds/nova-bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IRandomUserTableModel } from "../index";
import { RandomuserTableDataSource } from "../table-virtual-scroll-datasource";

@Component({
    selector: "nui-table-virtual-scroll-real-api-minimalist-example",
    templateUrl: "./table-virtual-scroll-real-api-minimalist.example.component.html",
    styleUrls: ["./table-virtual-scroll-real-api-minimalist.example.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableVirtualScrollRealApiMinimalistExampleComponent implements AfterViewInit, OnDestroy, OnInit {
    // This value is obtained from the server and used to evaluate the total number of pages to display
    private _totalItems: number = 0;
    // This value is being depending to obtain the total number of pages available depending on the range of the fatched items selected
    private totalPages: number = 0;
    private lastPageFetched: number = 0;
    // Since we always have the first pagge fetched automatically (on OnInit), it's fair to say we always start with the first page prefetched
    private prefetchedDsPageNumber: number = 1;
    // The range of items to fetch from the server and display within the viewport.
    private range: number = 40;
    private _isBusy: boolean = false;
    private virtualScrollFilterValue: ListRange = { start: 0, end: this.range };
    private onDestroy$: Subject<void> = new Subject<void>();

    get totalItems() { return this._totalItems; }
    get isBusy() { return this._isBusy; }
    // The dynamically changed array of items to render by the table
    public users: IRandomUserTableModel[] = [];
    public dataSourceObs: Subject<Array<any>> = new Subject();
    public displayedColumns: string[] = ["no", "nameTitle", "nameFirst", "nameLast", "gender", "country", "city", "postcode", "email", "cell"];
    public gridHeight = 400;
    public makeSticky: boolean = true;
    private dataSource: RandomuserTableDataSource;

    constructor(public selectorService: SelectorService, private cd: ChangeDetectorRef) {
        this.dataSource = new RandomuserTableDataSource();
    }

    @ViewChild(forwardRef(() => TableComponent), { static: false }) table: TableComponent<any>;
    @ViewChild(forwardRef(() => TableVirtualScrollDirective), { static: false }) virtualDirective: TableVirtualScrollDirective;
    @ViewChild(CdkVirtualScrollViewport, { static: false }) viewport: CdkVirtualScrollViewport;

    ngOnInit() {
        this.dataSource.outputsSubject.subscribe((outputs: IFilteringOutputs) => {
            if (outputs) {
                this.users = outputs.repeat.itemsSource;
                this._totalItems = outputs.totalItems;
                this.totalPages = Math.floor(this._totalItems / this.range);
                // This condition handles the case when the number of items fetched is less than the viewport size.
                // To have virtual scroll working, we need to prefetch the number of items missing to trigger the scrollbar.
                if (this.users.length < Math.round((this.viewport.getViewportSize() / this.virtualDirective.rowHeight))) {
                    this.prefetchedDsPageNumber++;
                    this.dataSource.page = this.prefetchedDsPageNumber;
                    this.dataSource.applyFilters();
                }
                this.cd.detectChanges();
            }
        });

        this.dataSource.busy.subscribe(busy => {
            this._isBusy = busy;
        });
    }

    ngAfterViewInit(): void {
        this.registerVirtualScroll();

        // Setting the items range to properly evaluate the virtual scroll viewport size
        this.virtualDirective.setMaxItems(this.range);

        this.viewport.renderedRangeStream
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(value => {
                // There is no use to proceed if we've already fetched all the items
                if (this.users.length === this._totalItems) { return; }

                const page = Math.floor(value.end / this.range);
                if (page > this.lastPageFetched && page <= this.totalPages) {
                    const start = page * this.range;
                    const end = start + this.range;
                    this.virtualScrollFilterValue = {start: start, end: end};
                    this.lastPageFetched = page;
                    // Due to a specificity of the chosen API, we explicitly send it the page number, because the API can
                    // return data in pages. This can vary depending on the user's usecase
                    this.dataSource.page = this.prefetchedDsPageNumber + page;

                    this.dataSource.applyFilters();
                }
            });

        this.dataSource.applyFilters();
    }

    public ngOnDestroy(): void {
        this.dataSource.busy.unsubscribe();
        this.dataSource.outputsSubject.unsubscribe();
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private registerVirtualScroll() {
        this.dataSource.registerComponent({
            virtualScroll: {
                componentInstance: {
                    getFilters: () => <IFilter<ListRange>>({
                        type: "virtualScroll",
                        value: this.virtualScrollFilterValue,
                    }),
                },
            },
        });
     }
}
