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

import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostBinding,
    Inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Optional,
    QueryList,
    SimpleChange,
    SimpleChanges,
    ViewChild,
    ViewChildren,
} from "@angular/core";
import get from "lodash/get";
import isEqual from "lodash/isEqual";
import omit from "lodash/omit";
// eslint-disable-next-line import/no-deprecated
import { BehaviorSubject, merge, Observable, of, Subject } from "rxjs";
// eslint-disable-next-line import/no-deprecated
import { filter, map, take, takeUntil, tap } from "rxjs/operators";

import {
    DEFAULT_INTERACTIVE_ELEMENTS,
    EventBus,
    IDataField,
    IDataSource,
    IEvent,
    IFilter,
    INovaFilteringOutputs,
    IPaginatorItem,
    ISortedItem,
    LoggerService,
    PaginatorComponent,
    SorterDirection,
    TableAlignmentOptions,
    TableComponent,
    TableRowComponent,
    VirtualViewportManager,
} from "@nova-ui/bits";

import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { TableFormatterRegistryService } from "../../services/table-formatter-registry.service";
import {
    INTERACTION,
    REFRESH,
    WIDGET_READY,
    WIDGET_RESIZE,
} from "../../services/types";
import { WidgetConfigurationService } from "../../services/widget-configuration.service";
import {
    DATA_SOURCE,
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
    WellKnownDataSourceFeatures,
} from "../../types";
import { ITableFormatterDefinition } from "../types";
import { SearchFeatureAddonService } from "./addons/search-feature-addon.service";
import { VirtualScrollFeatureAddonService } from "./addons/virtual-scroll-feature-addon.service";
import {
    IPaginatorState,
    ITableWidgetColumnConfig,
    ITableWidgetConfig,
    ScrollType,
} from "./types";

/**
 * @ignore
 */
@Component({
    selector: "nui-table-widget",
    templateUrl: "./table-widget.component.html",
    styleUrls: ["./table-widget.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SearchFeatureAddonService, VirtualScrollFeatureAddonService],
    host: {
        // Note: Moved here from configuration to ensure that consumers will not override it.
        // Used to prevent table overflowing preview container in the edit/configuration mode.
        "[class.table-widget-fullwidth]": "true",
    },
})
export class TableWidgetComponent
    implements AfterViewInit, OnChanges, OnDestroy, OnInit
{
    static lateLoadKey = "TableWidgetComponent";

    @Input() public widgetData: any[];
    @Input() public componentId: string;
    @Input() public configuration: ITableWidgetConfig;
    @Input() public dataFields: IDataField[];
    @Input() public totalItems: number;
    // 70 px stands for widget header and margins
    @Input() public indentFromTop: number = 70;
    @Input() public sortable: boolean = true;
    @Input() public delayedMousePresenceDetectionEnabled: boolean = true;

    @Input()
    public set range(value: number) {
        this._range = value;
    }

    public get range(): number {
        return this.getTableScrollRange();
    }

    public get headerTooltipsEnabled(): boolean {
        // Note: If tooltip state is not provided treat is as true;
        return this.configuration.headerTooltipsEnabled ?? true;
    }

    @Input() @HostBinding("class") public elementClass: string;

    public tableData: any[] = [];
    public headers: string[];
    public sortedColumn: ISortedItem;
    public columns: ITableWidgetColumnConfig[] = [];
    public columnsWidthMap: Map<string, number | undefined> = new Map<
        string,
        number | undefined
    >();
    // public hasVirtualScroll: boolean = true;

    public scrollType: ScrollType = ScrollType.virtualScroll;

    public tableContainerHeight: number;
    public isSearchEnabled: boolean = false;
    public searchTerm$ = new Subject<string>();
    public searchValue: string;
    public defaultPaginatorState: IPaginatorState = {
        page: 1,
        pageSize: 10,
        pageSizeSet: [10, 20, 50],
        total: 0,
    };
    public makeSticky: boolean = true;

    public paginatorState: IPaginatorState = this.defaultPaginatorState;

    public onDestroy$: Subject<void> = new Subject<void>();
    public tableUpdate$: Subject<void> = new Subject<void>();
    public mousePresent$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);
    public rowHeight: number = 24;

    public set scrollBuffer(value: number) {
        if (value > 100 || value < 0) {
            throw new Error(
                "Invalid scroll buffer provided. Required range 1..100"
            );
        }
        this._scrollBuffer = value;
    }

    private _scrollBuffer: number = 0;
    private sortFilter: ISortedItem;
    private totalPages: number = 0;
    private lastPageFetched: number = 0;
    private sortableSet: Record<string, boolean> = {};
    private formatters: {
        version: string;
        items: Record<string, ITableFormatterDefinition>;
    };
    private tableWidgetHeight: number;
    private _range: number;

    private readonly defaultColumnAlignment: TableAlignmentOptions = "left";

    private idle: boolean = false;
    public isBusy: boolean = this.lastPageFetched !== this.totalPages;

    @ViewChild("widgetTable") table: TableComponent<any>;
    @ViewChild("paginator") paginator: PaginatorComponent;

    @ViewChild(CdkVirtualScrollViewport)
    vscrollViewport?: CdkVirtualScrollViewport;
    @ViewChildren(TableRowComponent, { read: ElementRef })
    tableRows: QueryList<ElementRef>;

    public get interactive(): boolean {
        return (
            this.configuration?.interactive ??
            this.dataSource?.features?.getFeatureConfig(
                WellKnownDataSourceFeatures.Interactivity
            )?.enabled ??
            false
        );
    }

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) public eventBus: EventBus<IEvent>,
        @Optional() @Inject(DATA_SOURCE) public dataSource: IDataSource,
        @Optional()
        private widgetConfigurationService: WidgetConfigurationService,
        public changeDetector: ChangeDetectorRef,
        public pizzagnaService: PizzagnaService,
        public viewportManager: VirtualViewportManager,
        public zone: NgZone,
        private el: ElementRef,
        private logger: LoggerService,
        private searchAddon: SearchFeatureAddonService,
        public virtualScrollAddon: VirtualScrollFeatureAddonService,
        private formattersRegistryService: TableFormatterRegistryService
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.dataFields) {
            if (this.dataFields?.length) {
                this.setSortableSet();
            }
        }

        if (changes.widgetData || changes.configuration || changes.dataFields) {
            this.updateTable();
            // Note: CDK Viewport does not have a proper mechanism to identify the changes and trigger checkViewportSize
            // we have to do it manually. Using optional chaining because vscrollViewport can be unavailable at initialization.
            // Related issue: https://github.com/angular/components/issues/10117
            this.vscrollViewport?.checkViewportSize();

            console.log("this.vscrollViewport?.checkViewportSize", this.vscrollViewport?.checkViewportSize);
        }

        if (changes.configuration) {
            // Note: We don't have to trigger sorting in case sortable flag is false.
            // Note: Using true as a default sortable value to maintain backward compatibility
            if (
                this.isSortByUpdated(changes.configuration) &&
                (changes.configuration.currentValue.sortable ?? true)
            ) {
                const sortedColumn = {
                    direction: changes.configuration.currentValue
                        .sorterConfiguration.descendantSorting
                        ? SorterDirection.descending
                        : SorterDirection.ascending,
                    sortBy: changes.configuration.currentValue
                        .sorterConfiguration.sortBy,
                };
                this.onSortOrderChanged(sortedColumn);
            }

            const newScrollType = get(
                changes,
                "configuration.currentValue.scrollType",
                true
            ).valueOf() as ScrollType;

            this.scrollType = newScrollType;

            if (newScrollType === ScrollType.virtualScroll) {
                // this.hasVirtualScroll = true;
                console.log("initVirtualScroll");
                this.virtualScrollAddon.initVirtualScroll();
                // this.paginatorAddon.deregisterPaginator();
            }

            if (newScrollType === ScrollType.paginator) {
                // this.paginatorAddon.initPaginator();
            }
        }

        if (changes.totalItems) {
            this.totalPages = Math.floor((this.totalItems ?? 0) / this.range);
        }
    }

    public ngOnInit(): void {
        console.log("this.configuration", this.configuration);

        this.paginatorState.pageSize =
            this.configuration.paginatorConfiguration?.pageSize ??
            this.defaultPaginatorState.pageSize;
        this.paginatorState.pageSizeSet =
            this.configuration.paginatorConfiguration?.pageSizeSet ??
            this.defaultPaginatorState.pageSizeSet;
        this.dataSource.outputsSubject.subscribe(
            (data: INovaFilteringOutputs) => {
                console.log("data", data);
                this.paginatorState.total = data.paginator?.total ?? 0;
            }
        );

        if (this.dataSource) {
            // Since the sortFilter is not initialized, we have to retrieve and set the correct filter value from the configuration before registering it
            this.setSortFilter();
            this.registerSorter();
            this.virtualScrollAddon.initWidget(this);
            // this.paginatorAddon.initWidget(this);
        }
    }

    public ngAfterViewInit(): void {
        if (!this.dataSource) {
            return;
        }

        this.dataSource.busy
            ?.pipe(
                // eslint-disable-next-line import/no-deprecated
                tap((isBusy) => (this.isBusy = isBusy)),
                takeUntil(this.onDestroy$)
            )
            .subscribe();

        this.virtualScrollAddon.initVirtualScroll();
        this.searchAddon.initWidget(this);

        this.dataSource.registerComponent({
            paginator: {
                componentInstance: this.paginator,
            },
        });

        const tableHeightChanged$: Observable<number> = this.eventBus
            .getStream(WIDGET_RESIZE)
            .pipe(
                filter(
                    (event) =>
                        event.payload?.widgetId?.toString() ===
                        this.widgetConfigurationService.getWidget().id
                ),
                // eslint-disable-next-line import/no-deprecated
                map((event) => event.payload?.height ?? 0)
            );

        // subscribing to widget resize event from dashboard and update virtual scroll viewport size
        tableHeightChanged$
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((height) => {
                this.tableContainerHeight = height - this.indentFromTop;
                this.vscrollViewport?.checkViewportSize();
                this.changeDetector.detectChanges();
            });

        // Note: Secondary stream used to trigger widget ready event when table is properly displayed and we can start
        // loading data for our virtual scroll
        // setTimeout is needed because this.el.nativeElement.getBoundingClientRect().height is 0  when it switches components from
        // fallback component to table widget and it needs to have height
        setTimeout(() => {
            // eslint-disable-next-line import/no-deprecated
            merge(
                of(this.range * this.rowHeight),
                tableHeightChanged$,
                of(this.el.nativeElement.getBoundingClientRect().height)
            )
                .pipe(
                    filter((value) => !!value),
                    take(1),
                    // eslint-disable-next-line import/no-deprecated
                    tap((value) => {
                        this.tableWidgetHeight = value;
                        this.virtualScrollAddon.subscribeToVirtualScroll();
                        this.eventBus.getStream(WIDGET_READY).next({});
                    })
                )
                .subscribe();
        });
    }

    public applyFilters(): void {
        this.dataSource.applyFilters();
    }

    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.tableUpdate$.complete();
        this.searchTerm$?.complete();

        // erase the error status when this component gets destroyed to prevent an error status leak when changing data sources
        this.pizzagnaService.setProperty(
            {
                componentId: "bodyContent",
                propertyPath: ["fallbackKey"],
                pizzagnaKey: PizzagnaLayer.Data,
            },
            undefined
        );
    }

    /** Checks if table should be displayed */
    public shouldDisplayTable(): boolean {
        const columnsCondition = this.columns.length > 0;
        const dataCondition = this.tableData?.length > 0;
        // return true;
        return this.isSearchEnabled ||
            ((this.isVirtualScroll || this.isPaginator) &&
                (this.isBusy || this.idle))
            ? columnsCondition
            : columnsCondition && dataCondition;
    }

    public dataTrackBy(index: number, item: any): any {
        return item ? item.id : index;
    }

    public columnTrackBy(
        index: number,
        item: ITableWidgetColumnConfig
    ): string {
        return item.id;
    }

    /**
     * Handles updating of columns.
     * @param configuration
     */
    public updateColumns(configuration: ITableWidgetConfig): void {
        this.headers = configuration.columns
            .filter((item) => item.isActive)
            .map((item) => item.id);
        const allColumnsHaveWidthSpecified = configuration.columns.every(
            (column) => Boolean(column.width)
        );

        const columns = configuration.columns.map((column, index, array) => {
            this.columnsWidthMap.set(column.id, column.width);
            if (allColumnsHaveWidthSpecified) {
                const lastColumn = array[array.length - 1];
                this.columnsWidthMap.set(lastColumn.id, undefined);
            }
            // console.log("column", column);
            return {
                ...column,
                sortable:
                    this.sortableSet[
                        column?.formatter?.properties?.dataFieldIds?.value
                    ] ?? true,
            };
        });

        if (columns.length > 0 && allColumnsHaveWidthSpecified) {
            this.logger.warn(
                `Cannot set width for all columns. Resetting last column width.`
            );
        }

        if (this.columns.length !== columns.length) {
            this.columns = [...columns];
        } else {
            // This Object.assign is important. It helps to track changes in column header names
            this.columns.forEach((c, i) => {
                Object.assign(c, columns[i], {});
            });
        }
    }

    /**
     * Takes tableData from back-end, columns which are provided in table widget config and dataFields and maps them to data-format
     * which is acceptable by table component.
     * Also it can merge multiple data fields into one column. If you provide more than one dataFieldId in your
     * widget config, they will be merged to an object with needed data. This data can be passed to formatter and displayed
     * in one column.
     * @param tableData
     * @param columns
     * @param dataFields
     * @returns any[]
     */
    public mapTableData(
        tableData: any[],
        columns: ITableWidgetColumnConfig[],
        dataFields: IDataField[]
    ): any[] {
        if (!dataFields || dataFields.length === 0) {
            this.logger.warn(
                "There are no data fields defined, so table data cannot be displayed."
            );
            return [];
        }

        // console.log("tableData", tableData);

        return tableData.map((record) => {
            const row = columns.reduce(
                (result: Record<string, any>, column) => {
                    const dataFieldIds =
                        column.formatter?.properties?.dataFieldIds;
                    if (!dataFieldIds) {
                        return result;
                    }

                    const data = Object.keys(dataFieldIds).reduce(
                        (mapping: Record<string, any>, next) => {
                            mapping[next] = record[dataFieldIds[next]];
                            return mapping;
                        },
                        {}
                    );

                    result[column.id] = {
                        data,
                        ...omit(column.formatter?.properties, "dataFieldIds"),
                    };

                    return result;
                },
                {}
            );

            // we want to include original record for row interaction
            row.__record = record;

            return row;
        });
    }

    /**
     * Handles change of sorting. Gets sorted column from columns array.
     * @param event
     */
    public onSortOrderChanged(event: ISortedItem): void {
        this.sortedColumn = event;
        const columnToSort = this.columns.find(
            (column) => column.id === event.sortBy
        );
        if (!columnToSort) {
            return;
        }

        const dataFieldIds = columnToSort.formatter?.properties?.dataFieldIds;
        const sortField = dataFieldIds?.value;
        if (!sortField) {
            return;
        }
        const newSortFilter = {
            sortBy: sortField,
            direction: event.direction,
        };
        if (isEqual(newSortFilter, this.sortFilter)) {
            return;
        }
        this.sortFilter = newSortFilter;

        // Note: Since we're relying on the CDK Viewport internal logic to perform data load
        // we have to move to the start of the range for dataSource to take correct range,
        // if we will keep old data user can think (NUI-5333) that data is already reloaded.
        // So we're flushing the old data and waiting for new one to avoid confusion.
        this.flushTableData();

        this.eventBus.getStream(REFRESH).next({});
    }

    public onInteraction(row: any, event: MouseEvent): void {
        if (!this.interactive) {
            return;
        }

        const ignoredSelectors =
            this.configuration.interactionIgnoredSelectors ||
            DEFAULT_INTERACTIVE_ELEMENTS;

        // avoid emitting events when an ignored element was clicked
        if ((event.target as HTMLElement).closest(ignoredSelectors.join(","))) {
            return;
        }

        this.eventBus
            .getStream(INTERACTION)
            .next({ payload: { data: row.__record } });
    }

    public onSearchInputChanged(searchTerm: string): void {
        this.searchValue = searchTerm;
        this.searchTerm$.next("");
    }

    public getColumnAlignment(
        column: ITableWidgetColumnConfig
    ): TableAlignmentOptions {
        // Note: In case we have provided formatters by old manner (via config)
        // we don't have to proceed with calculations
        if (
            !column?.formatter?.componentType ||
            this.formattersRegistryService.isEmpty
        ) {
            return this.defaultColumnAlignment;
        }

        // Note: We don't want to invoke getFormattersMap() on every change detection cycle
        // but only when it was changed
        if (
            this.formatters?.version !==
            this.formattersRegistryService.stateVersion
        ) {
            this.formatters = {
                // Transforming array into map
                items: this.formattersRegistryService.getItems().reduce(
                    (prev, next) => ({
                        ...prev,
                        [next.componentType]: next,
                    }),
                    {}
                ),
                version: this.formattersRegistryService.stateVersion,
            };
        }

        return (
            this.formatters.items[column.formatter.componentType]?.alignment ||
            this.defaultColumnAlignment
        );
    }

    private setSortFilter() {
        if (this.configuration) {
            const sortBy = this.configuration.sorterConfiguration?.sortBy;
            const columnValue = this.configuration.columns?.find(
                (column) => column.id === sortBy
            )?.formatter?.properties?.dataFieldIds?.value;

            this.sortFilter = {
                direction: this.configuration.sorterConfiguration
                    ?.descendantSorting
                    ? SorterDirection.descending
                    : SorterDirection.ascending,
                sortBy: columnValue,
            };
        }
    }

    /**
     * Checks if column id has changed or if sorting order has changed
     * @param state
     */
    private isSortByUpdated(configuration: SimpleChange) {
        const oldSorterConfiguration =
            configuration.previousValue?.sorterConfiguration;
        const newSorterConfiguration =
            configuration.currentValue.sorterConfiguration;
        const oldSortById = oldSorterConfiguration?.sortBy;
        const newSortById = newSorterConfiguration?.sortBy;
        if (!newSortById) {
            return Boolean(oldSortById);
        }

        const equalSortingState =
            oldSortById === newSortById &&
            newSorterConfiguration.descendantSorting ===
                oldSorterConfiguration.descendantSorting;

        return !equalSortingState;
    }

    /**
     * Updates table columns and maps table data.
     */
    private updateTable() {
        console.log("updateTable")
        if (this.widgetData && this.dataFields && this.configuration.columns) {
            this.updateColumns(this.configuration);
            // console.log("configuraiton",this.configuration)
            this.idle = false;
            this.tableData = this.mapTableData(
                this.widgetData,
                this.configuration.columns,
                this.dataFields
            );
            console.log("this.tableData", this.tableData);
            this.tableUpdate$.next();
            this.changeDetector.detectChanges();
        }
    }

    /**
     * Registers sorter filter.
     */
    private registerSorter() {
        this.dataSource.registerComponent({
            sorter: {
                componentInstance: {
                    getFilters: () =>
                        <IFilter<ISortedItem>>{
                            type: "sorter",
                            value: this.sortFilter,
                        },
                },
            },
        });
    }

    private setSortableSet() {
        this.sortableSet = {};
        this.dataFields.forEach((dataField) => {
            this.sortableSet[dataField.id] = dataField.sortable ?? true;
        });
    }

    private flushTableData(): void {
        this.idle = true;
        this.tableData = [];
    }

    private getTableScrollRange(): number {
        // Note: To work properly virtual viewport should be scrollable
        // to ensure that container will be scrollable we're adding 50% more items
        // Ex: Viewport height: 100px, itemSize: 20px => 5 (range) in current configuration the viewport
        // will not be scrollable/work properly because all the items fits the screen.
        // We're adding 50% more items and in this case, we're covered even the user provides 0% buffer.
        const internalBuffer: number = 2;
        const scrollBuffer: number = (this._scrollBuffer ?? 0) / 100 + 1;

        if (this._range) {
            // Note: In case user provided a range we don't need
            // to add our internal buffer. Totally relying on user calculus
            return Math.floor(this._range * scrollBuffer);
        }

        return Math.floor(
            (this.tableWidgetHeight / this.rowHeight) *
                internalBuffer *
                scrollBuffer
        );
    }

    public get isVirtualScroll(): boolean {
        return this.scrollType === ScrollType.virtualScroll;
    }

    public get isPaginator(): boolean {
        return this.scrollType === ScrollType.paginator;
    }
}
