import {
    AfterViewInit,<% if (dataSource === "serverSide" || selectionMode === "multi") {%>
    ChangeDetectorRef,<% } %>
    Component,
    Inject,
    OnDestroy,<% if (dataSource === "serverSide") {%>
    OnInit,<% } %>
    ViewChild,
    ViewEncapsulation
} from "@angular/core";<%
if (pagingMode === "virtualScroll") {%>
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";<% } %>
import {
    DataSourceService,<%
    if (pagingMode === "virtualScroll" && virtualScrollStrategy === "standard") {%>
    IFilteringOutputs,<% }
if (pagingMode !== "virtualScroll" || (pagingMode === "virtualScroll" && virtualScrollStrategy === "custom")) {%>
    INovaFilteringOutputs,<% }
    if (selectionMode === "multi") {%>
    ISelection,<% }
    if (enableSort) {%>
    ISortedItem,<% }
    if (
        (enableSearch || enableSort || dataSourceName !== name)
        && (
            pagingMode === "virtualScroll"
            || (pagingMode === "pagination" && dataSource === "serverSide")
        )
    ) {%>
    nameof,<% }
    if (pagingMode === "pagination") {%>
    PaginatorComponent,<% }
    if (enableSearch) {%>
    SearchComponent,<% }
    if (enableSort) {%>
    SorterDirection,<% }
    if (dataSource === "clientSide" || dataSource === "none") {%>
    <% if (dataSourceName === name) {%>ClientSideDataSource<% } else {%>LocalFilteringDataSource<%}%>,<% } %>
    TableComponent,<%
    if (pagingMode === "virtualScroll") { %>
    VirtualViewportManager,<% } %>
} from "@nova-ui/bits";
import { Subject } from "rxjs";
import {<%
    if (enableSearch) {%>
    debounceTime,<% }
    if (pagingMode === "virtualScroll" && virtualScrollStrategy === "standard") {%>
    filter,
    switchMap,<% } %>
    takeUntil,
    tap,
} from "rxjs/operators";
<% if (pagingMode !== "none" || dataSource === "none" || dataSource === "clientSide") {%>
import {<%
    if (virtualScrollStrategy === "custom") {%>
    CUSTOM_SCROLL_ITEMS_PER_PAGE,<% }
    if (pagingMode !== "none") {%>
    RESULTS_PER_PAGE,<% }
    if (dataSource === "none" || dataSource === "clientSide") {%>
    LOCAL_DATA,<% } %>
} from "<% if (dataSourceName !== name) {%>.<% } %>./<%= dasherize(dataSourceName)%>-data";<%}
if (dataSource === "serverSide") {%>
import { <%= classify(dataSourceName) %>DataSource } from "<% if (dataSourceName !== name) {%>.<% } %>./<%= dasherize(dataSourceName) %>-data-source.service";<% } %>
import { IServer<%
    if (
        (enableSearch || enableSort || dataSourceName !== name)
        && (
            pagingMode === "virtualScroll"
            || (pagingMode === "pagination" && dataSource === "serverSide")
        )
    ) {%>, IServerFilters<% } %> } from "<% if (dataSourceName !== name) {%>.<% } %>./types";<%
if (virtualScrollStrategy === "custom") {%>
import { VirtualScrollCustomStrategyService } from "./virtual-scroll-custom-strategy.service";<% } %>

@Component({
    selector: "<%= selector %>",
    templateUrl: "./<%= dasherize(name) %>.component.html",
    styleUrls: ["./<%= dasherize(name) %>.component.less"],
    encapsulation: ViewEncapsulation.None,<%
    if (dataSourceName === name || virtualScrollStrategy === "custom") {%>
    providers: [<%
        if (pagingMode === "virtualScroll") { %>
        VirtualViewportManager,<%
        if (virtualScrollStrategy === "custom") {%>
        VirtualScrollCustomStrategyService,
        {
            provide: CUSTOM_SCROLL_ITEMS_PER_PAGE,
            useValue: RESULTS_PER_PAGE,
        },<% }
        }
        if (dataSourceName === name) { %>
        {
            provide: DataSourceService,
            useClass: <% if (dataSource === "none" || dataSource === "clientSide") {%><% if (dataSourceName === name) {%>ClientSide<% } else {%>LocalFiltering<%}%><% } else {%><%= classify(dataSourceName) %><% } %>DataSource,
        },<% } %>
    ],<% } %>
})
export class <%= classify(name) %>Component implements <% if (dataSource === "serverSide") {%>OnInit, <% } %>OnDestroy, AfterViewInit {
    public items: IServer[] = [];<%
    if (dataSource === "serverSide") {%>
    public isBusy: boolean = false;<% }
    if (pagingMode !== "none" && virtualScrollStrategy !== "custom") {%>
    // This value is obtained from the server and used to evaluate the total number of pages to display
    public totalItems: number = 0;<% } %>

    // columns of the table
    public displayedColumns = ["name", "location", "status"];<%
    if (enableSort) {%>

    // sorting
    public sortedColumn: ISortedItem = {
        sortBy: "name",
        direction: SorterDirection.ascending,
    };<% }
    if (enableSearch) {%>

    // search
    public searchTerm: string;
    public columnsToApplySearch = ["name"];<% }
    if (pagingMode === "pagination") { %>

    // pagination
    public page: number = 1;<% }
    if (pagingMode !== "none") {%>
    public pageSize: number = RESULTS_PER_PAGE;<% }
    if (selectionMode === "multi") {%>

    // row selection
    public selectedItems: IServer[] = [];
    public selection: ISelection = {
        isAllPages: false,
        include: ["ABERN-SVR-ATQU9404"],
        exclude: [],
    };<% }%>

    @ViewChild(TableComponent) table: TableComponent<IServer>;<%
    if (enableSearch) {%>
    @ViewChild(SearchComponent) search: SearchComponent;<% }
    if (pagingMode === "pagination") {%>
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;<% }
    if (pagingMode === "virtualScroll") {%>
    @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

    // the height in px of a single row from the table
    public rowHeight = 40;<%
    if (virtualScrollStrategy === "custom") {%>

    private previouslyLoadedCount: number;<% }} %>

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService) private dataSource: <%
        if (dataSource === "serverSide" || dataSource === "custom") {%><%= classify(dataSourceName) %><% }
        else {%><% if (dataSourceName === name) {%>ClientSide<% } else {%>LocalFiltering<%}%><% } %>DataSource<IServer><%
        if (pagingMode === "virtualScroll") { %>,
        private viewportManager: VirtualViewportManager<%
        if (virtualScrollStrategy === "custom") {%>,
        private customVirtualScrollStrategyService: VirtualScrollCustomStrategyService<% }
        }
        if (dataSource === "serverSide" || selectionMode === "multi") {%>,
        private changeDetection: ChangeDetectorRef<% } %>
    ) {<%
        if (dataSource === "clientSide" || dataSource === "none") {%>
        this.dataSource.setData(LOCAL_DATA);<% } %>
    }<%
    if (dataSource === "serverSide") {%>

    public ngOnInit() {
        this.dataSource.busy.pipe(
            tap(val => {
                this.isBusy = val;
                this.changeDetection.detectChanges();
            }),
            takeUntil(this.destroy$)
        ).subscribe();
    }<% } %>

    public async ngAfterViewInit() {<%
        if (enableSort) {%>
        // register filter to be able to sort
        this.dataSource.registerComponent(this.table.getFilterComponents());<% }
        if (enableSearch || pagingMode !== "none") {%>
        this.dataSource.registerComponent({<%
            if (enableSearch) {%>
            search: { componentInstance: this.search },<%}
            if (pagingMode === "pagination") { %>
            paginator: { componentInstance: this.paginator },<% }
            if (pagingMode === "virtualScroll") {%>
            virtualScroll: {componentInstance: <%
            if (virtualScrollStrategy === "standard") {%>this.viewportManager<% }
            else if (virtualScrollStrategy === "custom") {%>this.customVirtualScrollStrategyService <% } %>},<% } %>
        });<% }
        if (pagingMode === "virtualScroll") {%>
        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(this.viewport)<%
            if (virtualScrollStrategy === "standard") {%>
            // Note: Initializing the stream with the desired page size, based on which
            // VirtualViewportManager will perform the observations and will emit
            // distinct ranges with step equal to provided pageSize
            .observeNextPage$({ pageSize: this.pageSize }).pipe(
                // Since we know the total number of items we can stop the stream when dataset end is reached
                // Otherwise we can let VirtualViewportManager to stop when last received page range will not match requested range
                filter(() => !this.items.length || this.items.length < this.totalItems),
                tap(() => this.applyFilters(<%
                if (pagingMode==="virtualScroll" && (dataSourceName !== name || enableSearch || enableSort)) {%>false<% } %>)),
                // Note: Using the same stream to subscribe to the outputsSubject and update the items list
                switchMap(() => this.dataSource.outputsSubject.pipe(
                    tap((data: IFilteringOutputs) => {
                        // update the list of items to be rendered<%
                        if (virtualScrollStrategy === "standard") {%>
                        const items = data.repeat?.itemsSource || [];<% }
                        else if (virtualScrollStrategy === "custom") {%>
                        let items = data.repeat?.itemsSource || [];
                        items = items.slice(
                            0,
                            items.length - (this.itemsLoaded < this.pageSize ? this.itemsLoaded : 0)
                        );<% } %>

                        // after receiving data we need to append it to our previous fetched results
                        this.items = this.items.concat(items);<%
                        if (dataSource === "serverSide" && virtualScrollStrategy === "standard") {%>
                        this.totalItems = data.paginator?.total || 0;<% }
                        if (virtualScrollStrategy === "custom") {%>
                        this.itemsLoaded = this.items.length
                            - this.viewportManager.currentPageRange.start
                            - (this.itemsLoaded < this.pageSize ? this.itemsLoaded : 0);<% }
                        if (dataSource === "serverSide") {%>
                        this.changeDetection.detectChanges();<% } %>
                    })
                )
            ),
            takeUntil(this.destroy$)
        ).subscribe();<% }
        }

        if (pagingMode !== "virtualScroll" || (pagingMode === "virtualScroll" && virtualScrollStrategy === "custom")) {%>

        this.dataSource.outputsSubject.pipe(
            tap((data: INovaFilteringOutputs) => {
                // update the list of items to be rendered<%
                if (pagingMode !== "virtualScroll") {%>
                this.items = data.repeat?.itemsSource || [];<%
                } else if (virtualScrollStrategy === "custom") {%>
                let items = data.repeat?.itemsSource || [];

                // number of fetched items from our data source
                const fetchedItemsCount = items.length;

                // number of useful items after eliminating the leftovers;
                // leftovers appear when we reach the end of all our data
                // since we're keep requesting the same page multiple times
                // waiting for new items to be added between subsequent requests
                const usefulItemsCount = fetchedItemsCount < this.pageSize
                    ? this.previouslyLoadedCount - fetchedItemsCount
                    : fetchedItemsCount;

                items = items.slice(0, usefulItemsCount);

                this.previouslyLoadedCount = items.length;

                // append current useful items we need to append it to our previous fetched results
                this.items = this.items.concat(items);

                this.customVirtualScrollStrategyService.prepareNextPage(fetchedItemsCount);<% }

                if (pagingMode !== "none" && virtualScrollStrategy !== "custom") {%>
                this.totalItems = data.paginator?.total ?? 0;<% } %>
            }),
            takeUntil(this.destroy$)
        ).subscribe();<%
        }
        if (enableSearch) {%>

        // listen for input change in order to perform the search
        this.search.inputChange.pipe(
            debounceTime(500),
            // perform actual search
            tap(() => this.onSearch()),
            takeUntil(this.destroy$)
        ).subscribe();<% }
        if (pagingMode !== "virtualScroll" || (pagingMode === "virtualScroll" && virtualScrollStrategy === "custom")) {%>

        await this.applyFilters();<% } %>
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }<%
    if (enableSearch) {%>

    public async onSearch() {<%
        if (dataSource === "clientSide" || dataSource === "none") {%>
        this.dataSource.setSearchProperties(this.columnsToApplySearch);<% } %>
        await this.applyFilters();
    }

    public async onSearchCancel() {
        await this.applyFilters();
    }<% }

    if (enableSort) {%>

    public async sortData(sortedColumn: ISortedItem) {
        this.sortedColumn = sortedColumn;
        await this.applyFilters();
    }<% }

    if (pagingMode === "pagination") {%>

    public async changePagination($event: any) {
        await this.applyFilters();
    }<% }

    if (selectionMode === "multi") {%>

    public onSelectionChanged(selection: ISelection) {
        // do something with the selection

        // make component aware of the new selection value
        // so it's displayed correctly
        this.changeDetection.detectChanges();
    }

    // trackBy handler used to identify uniquely each item in the table
    public trackBy(index: number, item: IServer) {
        return item.name;
    }<% } %>

    public async applyFilters(<%
        if (pagingMode === "virtualScroll" && (dataSourceName !== name || enableSearch || enableSort)) { %>resetVirtualScroll: boolean = true<% }%>) {<%
        if (pagingMode === "virtualScroll" && (dataSourceName !== name || enableSearch || enableSort)) { %>
        if (resetVirtualScroll) {
            // it is important to reset viewportManager to start page
            // so that the datasource performs the search with 1st page
            this.viewportManager.reset({emitFirstPage: false});
        }
<% }

        if (
            (enableSearch || enableSort || dataSourceName !== name)
            && pagingMode === "virtualScroll"
        ) {%>
        // Every new search request or filter change should
        // clear the cache in order to correctly display a new set of data
        const filters = this.dataSource.getFilters();
        const reset = this.dataSource.computeFiltersChange(filters);
        if (reset<% if (pagingMode === "virtualScroll") {%> || filters.virtualScroll?.value.start === 0<% } %>) {<%

            if (pagingMode === "virtualScroll") {%>
            this.items = [];<% }

            if (virtualScrollStrategy === "custom") {%>
            this.customVirtualScrollStrategyService.reset();<% } %>
        }
<% } %>
        await this.dataSource.applyFilters();
    }
}
