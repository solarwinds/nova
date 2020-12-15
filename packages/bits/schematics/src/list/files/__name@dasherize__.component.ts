import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,<% if (dataSource === "serverSide") {%>
    OnInit,<% } %>
    ViewChild,
} from "@angular/core";
import {
    DataSourceService,<%
    if (pagingMode === "virtualScroll") {%>
    IFilteringOutputs,<% }
    if (enableSort) { %>
    IMenuItem,<% } %>
    INovaFilteringOutputs,
    IRepeatItemConfig,<%
    if (enableSort) { %>
    ISorterChanges,<% }
    if (enableSearch || (
        (enableSort || dataSourceName !== name)
        && (
            pagingMode === "virtualScroll"
            || (pagingMode === "pagination" && dataSource === "serverSide")
        )
    )) {%>
    nameof,<% }
    if (selectionMode !== "none") { %>
    ListService,<% }
    if (dataSource === "none") { %>
    <% if (dataSourceName === name) {%>ClientSideDataSource<% } else {%>LocalFilteringDataSource<%}%>,<% }
    if (pagingMode === "pagination") { %>
    PaginatorComponent,<% } %>
    RepeatComponent,<% if (selectionMode !== "none") { %>
    RepeatSelectionMode,<% }if (enableSearch) { %>
    SearchComponent,<% } %><% if (selectionMode !== "none") { %>
    SelectionType,<% } %><% if (enableSort) { %>
    SorterComponent,
    SorterDirection,<% }
    if (pagingMode === "virtualScroll") { %>
    VirtualViewportManager,<% } %>
} from "@nova-ui/bits";
import {<%
    if (dataSource === "serverSide") {%>
    BehaviorSubject,<% } %>
    Subject,
} from "rxjs";
import {<%
    if (pagingMode === "virtualScroll") {%>
    filter,
    switchMap,<% } %>
    takeUntil,
    tap,
} from "rxjs/operators";
<% if (dataSource !== "none" || pagingMode === "pagination") {%>
import {<%
    if (dataSource === "none" || dataSource === "clientSide") {%>
    LOCAL_DATA,<% }
    if (pagingMode !== "none") {%>
    RESULTS_PER_PAGE,<% } %>
} from "<% if (dataSourceName !== name) {%>.<% } %>./<%= dasherize(dataSourceName)%>-data";
import {
    IServer,<%
    if (enableSearch) {%>
    IServerFilters,<% } %>
} from "<% if (dataSourceName !== name) {%>.<% } %>./types";<%
if (dataSource !== "none") {%>
import { <%= classify(dataSourceName) %>DataSource } from "<% if (dataSourceName !== name) {%>.<% } %>./<%= dasherize(dataSourceName) %>-data-source.service";<%}}%>

@Component({
    selector: "<%= selector %>",
    templateUrl: "./<%= dasherize(name) %>.component.html",
    styleUrls: ["./<%= dasherize(name) %>.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,<% if (dataSourceName === name) {%>
    providers: [<% if (pagingMode === "virtualScroll") { %>
        VirtualViewportManager,<% }
        if (dataSourceName === name) {%>
        {
            provide: DataSourceService,
            useClass: <% if (dataSource === "none" || dataSource === "clientSide") {%><% if (dataSourceName === name) {%>ClientSide<% } else {%>LocalFiltering<%}%><% } else {%><%= classify(dataSourceName) %><% } %>DataSource,
        },<% } %>
    ],<% } %>
})
export class <%= classify(name) %>Component implements <% if (dataSource === "serverSide") {%>OnInit, <% } %>AfterViewInit, OnDestroy {<%
    if (dataSource === "serverSide") {%>
    public listItems$ = new BehaviorSubject<IServer[]>([]);<% }
    if (enableSort) { %>
    public readonly sorterItems: IMenuItem[] = [
        {
            title: $localize`Name`,
            value: "name",
        },
        {
            title: $localize`Status`,
            value: "status",
        },
        {
            title: $localize`Location`,
            value: "location",
        },
    ];

    public readonly initialSortDirection = SorterDirection.ascending;
    public sortBy = this.sorterItems[0].value;<% } %>

    public filteringState: INovaFilteringOutputs = {};<% if (dataSource === "serverSide") {%>
    public isBusy = false;<%}
    if (pagingMode !== "none") {%>

    // This value is obtained from the server and used to evaluate the total number of pages to display
    public totalItems: number = 0;<% }
    if (pagingMode === "pagination") { %>

    // pagination
    public page: number = 1;
    public pageSize: number = RESULTS_PER_PAGE;<% } %>

    public itemConfig: IRepeatItemConfig<IServer> = {
        trackBy: (index, item) => item?.name,
    };

    @ViewChild(RepeatComponent) repeat: RepeatComponent;<%
    if (pagingMode === "pagination") { %>
    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;<% }
    if (enableSearch) { %>
    @ViewChild(SearchComponent) search: SearchComponent;<% }
    if (enableSort) { %>
    @ViewChild(SorterComponent) sorter: SorterComponent;<% } %>

    private destroy$ = new Subject();

    constructor(
        @Inject(DataSourceService) private dataSource: <%
        if (dataSource === "none" || dataSource === "clientSide") {%><% if (dataSourceName === name) {%>ClientSide<% } else {%>LocalFiltering<%}%><% } else {%><%= classify(dataSourceName) %><% } %>DataSource<IServer>,
        private changeDetection: ChangeDetectorRef<%
        if (pagingMode === "virtualScroll") { %>,
        private viewportManager: VirtualViewportManager<% }
        if (selectionMode !== "none") { %>,
        private listService: ListService<% } %>
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

    public async ngAfterViewInit() {
        this.dataSource.registerComponent({<% if (pagingMode === "pagination") { %>
            paginator: { componentInstance: this.paginator },<% } %><% if (pagingMode === "virtualScroll") { %>
            virtualScroll: { componentInstance: this.viewportManager },<% } %><% if (enableSearch) { %>
            search: { componentInstance: this.search },<% } %><% if (enableSort) { %>
            sorter: { componentInstance: this.sorter },<% } %>
            repeat: { componentInstance: this.repeat },
        });<%

        if (pagingMode === 'virtualScroll') { %>

        this.viewportManager
            // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
            .setViewport(this.repeat.viewportRef)

            // Note: Initializing the stream with the desired page size, based on which
            // ViewportManager will perform the observations and will emit
            // distinct ranges with step equal to provided pageSize
            .observeNextPage$({pageSize: RESULTS_PER_PAGE})
                .pipe(
                    // Since we know the total number of items we can stop the stream when dataset end is reached
                    // Otherwise we can let VirtualViewportManager to stop when last received page range will not match requested range
                    filter(() => {
                        const items = this.listItems$.getValue();
                        return !items.length || items.length < this.totalItems;
                    }),
                    tap(() => this.applyFilters(<%
                    if (dataSourceName !== name || enableSearch || enableSort) {%>false<% } %>)),
                    // Note: Using the same stream to subscribe to the outputsSubject and update the items list
                    switchMap(() => this.dataSource.outputsSubject.pipe(
                        tap((data: IFilteringOutputs) => {
                            // update the list of items to be rendered
                            const items = data.repeat?.itemsSource || [];

                            // after receiving data we need to append it to our previous fetched results
                            this.listItems$.next(this.listItems$.getValue().concat(items));<%
                            if (dataSource === "serverSide") { %>

                            this.totalItems = data.paginator?.total || 0;

                            this.changeDetection.detectChanges();<% } %>
                        })
                    )
                ),
                takeUntil(this.destroy$)
            ).subscribe();<% }

        if (enableSearch) {%>

        this.search.focusChange.pipe(
            tap(async(focused: boolean) => {
                // we want to perform a new search on blur event
                // only if the search filter changed
                if (!focused && this.dataSource.filterChanged(nameof<IServerFilters>("search"))) {
                    await this.applyFilters();
                }
            }),
            takeUntil(this.destroy$)
        ).subscribe();<% }

        if (pagingMode !== "virtualScroll") {%>

        this.dataSource.outputsSubject.pipe(
            tap((data: INovaFilteringOutputs) => {<%
                if (dataSource === "serverSide") {%>
                // update the list of items to be rendered
                this.listItems$.next(data.repeat?.itemsSource || []);
<% } %>
                this.filteringState = <%if (selectionMode !== "none") { %>{ ...this.filteringState, ...<% } %>data<%if (selectionMode !== "none") { %> }<% } %>;<%if (selectionMode !== "none") { %>
                this.filteringState = this.listService.updateSelectionState(this.filteringState);<% }
                if (pagingMode !== "none") {%>

                this.totalItems = data.paginator?.total ?? 0;
<% } %>
                this.changeDetection.detectChanges();
            }),
            takeUntil(this.destroy$)
        ).subscribe();

        // make 1st call to retrieve initial results
        await this.applyFilters();<% } %>
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }<% if (enableSearch) {%>

    public async onSearch() {
        await this.applyFilters();
    }

    public async onCancelSearch() {
        await this.applyFilters();
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

            if (pagingMode === "virtualScroll") {
            if (dataSource === "clientSide") {%>
            if (filteringState.repeat) {
                filteringState.repeat.itemsSource = [];
            }<%
            } else if (dataSource === "serverSide") {%>
            this.listItems$.next([]);<% }
            }

%>
            this.changeDetection.detectChanges();
        }
<% } %>
        await this.dataSource.applyFilters();
    }<%

    if (enableSort) { %>

    public async onSorterAction(changes: ISorterChanges) {
        this.sortBy = changes.newValue.sortBy;
        await this.applyFilters();
    }<% }

    if (selectionMode !== "none") { %>

    public onSelectorOutput(selectionType: SelectionType) {
        this.filteringState = this.listService.applySelector(selectionType, this.filteringState);
    }

    public onRepeatOutput(selectedItems: IServer[]) {
        this.filteringState = this.listService.selectItems(selectedItems, RepeatSelectionMode.<%= selectionMode %>, this.filteringState);
    }<% } %>
}
