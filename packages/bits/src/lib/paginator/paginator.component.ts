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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import _chunk from "lodash/chunk";
import _clone from "lodash/clone";
import _get from "lodash/get";
import _includes from "lodash/includes";
import _min from "lodash/min";
import _range from "lodash/range";
import { Subject } from "rxjs";

import {
    IFilter,
    IFilterPub,
    IRange,
} from "../../services/data-source/public-api";
import { LoggerService } from "../../services/log-service";
import { PopupContainerService } from "../popup/popup-container.service";
import { SelectComponent } from "../select";
import { InputValueTypes } from "../select-v2/types";
import { ISelectChangedEvent } from "../select/public-api";
import { IPaginatorItem } from "./public-api";

export const defaultPageSizeSet = [10, 25, 50, 100];
const singleSymbolWidth = 8;
const singleCellPaddings = 12;
const containerPaddingsWithScroll = 37;

/**
 * Component used for pagination of data
 * <example-url>./../examples/index.html#/paginator</example-url>
 */
@Component({
    selector: "nui-paginator",
    templateUrl: "./paginator.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./paginator.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [PopupContainerService],
    host: { role: "navigation" },
})
export class PaginatorComponent
    implements OnInit, OnChanges, OnDestroy, IFilterPub
{
    @Input() public itemsList: Array<IPaginatorItem> = [];
    /**
     * Current page number
     */
    @Input() public page = 1;
    /**
     * Size of the page. For example: 10, 25, 50, 100;
     */
    @Input() public pageSize: number;
    /**
     * Array of page numbers
     */
    @Input() public pageSizeSet: number[] = [];
    /**
     * Total number of items
     */
    @Input() public total = 0;
    /**
     * Paginator separator symbol.
     */
    @Input() public dots = "...";
    /**
     * Hide paginator if all items of data can be displayed on one page
     */
    @Input() public hideIfEmpty = false;
    /**
     * Make paginator hidden
     */
    @Input() public hide: boolean;
    /**
     * Paginator active item class
     */
    @Input() public activeClass = "active";
    /**
     * Paginator disabled item class
     */
    @Input() public disabledClass = "disabled";
    /**
     * Number of items displayed before separator
     */
    @Input() public adjacent = 1;
    /**
     * Maximum number of items in paginator
     */
    @Input() public maxElements = this.adjacent * 2 + 5;
    /**
     * Show previous and next buttons
     */
    @Input() public showPrevNext = true;
    /**
     * Display popup above paginator if equals to 'true'
     */
    @Input() public popupDirectionTop = false;
    /**
     * Popup parent element css class used determining of popup direction
     */
    @Input() public popupBaseElementSelector: string;
    /**
     * inner nui-select appendToBody input
     */
    @Input() public appendToBody: boolean;
    /**
     * Action occurs on page change
     */
    @Output() public pagerAction = new EventEmitter<any>();

    @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

    public onDestroy$ = new Subject<void>();

    @ViewChild("select")
    private selectComponent: SelectComponent;

    @ViewChild(CdkVirtualScrollViewport)
    private virtualScrollViewport: CdkVirtualScrollViewport;

    private _dotsPagesPerRow = 5;

    public get dotsPagesPerRow(): number {
        return this._dotsPagesPerRow;
    }
    private mainRangeStart: number;
    private mainRangeEnd: number;

    public constructor(
        private logger: LoggerService,
        private popupContainer: PopupContainerService,
        private cd: ChangeDetectorRef
    ) {
        this.popupContainer.parent = this;
    }

    /**
     * Component initialization
     */
    ngOnInit(): void {
        this.initPageSizeSet();
        const pageCount = this.getPageCount();
        if (this.page > pageCount) {
            this.page = pageCount;
            this.pageChange.emit(this.page);
        }
        if (this.page <= 0) {
            this.page = 1;
            this.pageChange.emit(this.page);
        }
    }

    /**
     * Redraw component when 'total' or 'page' propery was changed
     * @param changes Changed properties
     */
    ngOnChanges(changes: SimpleChanges) {
        if (
            changes["total"] ||
            changes["page"] ||
            changes["adjacent"] ||
            changes["pageSize"]
        ) {
            this.assemble();
        }
    }

    /**
     * Initialize set of pages
     */
    public initPageSizeSet() {
        if (!_get(this.pageSizeSet, "length")) {
            this.pageSizeSet = _clone(defaultPageSizeSet);
        }
        if (!this.pageSize || this.pageSize <= 0) {
            this.pageSize = this.pageSizeSet[0];
        }
        if (!_includes(this.pageSizeSet, this.pageSize)) {
            this.logger
                .warn(`pageSize ${this.pageSize} not found in the current pageSizeSet ${this.pageSizeSet}. pageSize will be set to
${this.pageSizeSet[0]}. To set the desired initial page size, include it as part of the paginator's pageSizeSet input.`);
            this.pageSize = this.pageSizeSet[0];
        }
    }

    public getFilters(): IFilter<IRange<number>> {
        return {
            type: "range",
            value: {
                start: (this.page - 1) * this.pageSize,
                end: this.page * this.pageSize,
            },
        };
    }

    public resetFilter() {
        this.page = 1;
        this.pageChange.emit(this.page);
    }

    /**
     * Change page number
     * @param page Page number
     */
    public goToPage(page: number) {
        this.page = page;
        this.pageChange.emit(this.page);

        if (this.pagerAction) {
            const result = {
                page: this.page,
                pageSize: this.pageSize,
                total: this.total,
                pageSizeSet: this.pageSizeSet,
            };
            this.pagerAction.emit(result);
        }

        this.assemble();
    }

    // TODO: remove in vNext. Needs only for backward compatibility
    /**
     * @deprecated - remove in v12. Needs only for backward compatibility - Removal: NUI-5837
     */
    public onPageSizeChange(value: InputValueTypes): void {
        this.setItemsPerPage({
            oldValue: 0,
            newValue: value as number,
        });
    }

    // TODO: refactor in vNext. Replace ISelectChangedEvent to InputValueTypes - NUI-5837
    /**
     * Set items per page that should displayed
     * @param changedEvent select change event
     */
    public setItemsPerPage(changedEvent: ISelectChangedEvent<number>) {
        if (changedEvent?.newValue === changedEvent?.oldValue) {
            return;
        }

        const newValue = changedEvent?.newValue;

        if (newValue) {
            if (newValue < 1) {
                this.logger.warn(
                    "paginator-controller.setItemsPerPage - invalid newValue: " +
                        newValue
                );
                return;
            }
            this.pageSize = newValue;
        }

        this.goToPage(1);
    }

    /**
     * Get number of pages
     */
    public getPageCount() {
        if (this.total <= 0) {
            return 1;
        }
        return Math.ceil(this.total / this.pageSize);
    }

    /**
     * Display paginator component
     */
    public showPaginator() {
        const count: number = this.getPageCount();
        return isFinite(count) && (this.hideIfEmpty === false || count > 1);
    }

    /**
     * Get sequence number of first item of currently displayed paginated list
     */
    public getFirstItemOnPage(): number {
        return this.pageSize * (this.page - 1) + 1;
    }

    /**
     * Get sequence number of last item of currently displayed paginated repeat
     */
    public getLastItemOnPage(): number | undefined {
        return _min([this.pageSize * this.page, this.total]);
    }

    /**
     * Return range for info section
     */
    public getRange(total: number): string {
        return total > 0
            ? `${this.getFirstItemOnPage()}-${this.getLastItemOnPage()}`
            : "0";
    }

    /**
     * Re-renders the virtual scroll viewport to properly display items within the virtual scroll viewport
     */
    public handleDotsClick() {
        if (this.virtualScrollViewport) {
            this.virtualScrollViewport.checkViewportSize();
        }
    }

    /**
     * Add items to paginator component
     */
    private assemble() {
        this.itemsList = [];
        if (this.getPageCount() <= 0) {
            return;
        }

        const pageCount = this.getPageCount();

        this.prepareSeparators();

        this.addPrev();

        if (this.mainRangeStart !== 1) {
            // add starting separator and the first page
            this.add(1);
            this.addSeparator(2, this.mainRangeStart - 1);
        }

        this.addRange(this.mainRangeStart, this.mainRangeEnd);

        if (this.mainRangeEnd !== pageCount) {
            // add ending separator and the last page
            this.addSeparator(this.mainRangeEnd + 1, pageCount - 1);
            this.add(pageCount);
        }

        this.addNext();
        this.cd.detectChanges();
    }

    /**
     * Fills mainRangeStart and mainRangeEnd properties with proper values. Those properties
     * are used for displaying of page numbers between 'dots' separators.
     */
    private prepareSeparators() {
        // the only 2 variables that are needed to display everything are:
        //      mainRangeStart      mainRangeEnd
        //            |                   |
        //  < 1  ... 100  101  102  103  104 >
        const pageCount = this.getPageCount();
        const page = +this.page;
        const adjacent = +this.adjacent;

        // case when there are few items
        if (pageCount <= this.maxElements) {
            this.mainRangeStart = 1;
            this.mainRangeEnd = pageCount;
            return;
        }

        // set main range to
        this.mainRangeStart = page - adjacent < 1 ? 1 : page - adjacent;
        this.mainRangeEnd =
            page + adjacent > pageCount ? pageCount : page + adjacent;

        // case where starting separator is not shown
        if (
            this.mainRangeStart -
                1 - // end of possible starting separator
                2 < // start of possible starting separator
            1
        ) {
            this.mainRangeStart = 1;
        }

        // case where ending separator is not shown
        if (
            pageCount -
                1 - // end of possible ending separator
                (this.mainRangeEnd + 1) < // start of possible ending separator
            1
        ) {
            this.mainRangeEnd = pageCount;
        }

        // case where we have one of the first pages selected and the ending separator
        if (
            this.mainRangeEnd !== pageCount &&
            page < this.maxElements - 2 - adjacent
        ) {
            this.mainRangeStart = 1;
            this.mainRangeEnd = this.mainRangeStart + this.maxElements - 3;
        }

        // case where we have one of the last pages selected and the starting separator
        if (
            this.mainRangeStart !== 1 &&
            page > pageCount - this.maxElements + 2 + adjacent
        ) {
            this.mainRangeEnd = pageCount;
            this.mainRangeStart = this.mainRangeEnd - this.maxElements + 3;
        }
    }

    private addSeparator(from: number, to: number) {
        const pageRows = _chunk(_range(from, to + 1), this._dotsPagesPerRow);
        this.itemsList.push({
            title: $localize`Pages ${from} - ${to}`,
            value: this.dots,
            pageRows: pageRows,
            popupWidth:
                (to.toString().length * singleSymbolWidth +
                    singleCellPaddings) *
                    this._dotsPagesPerRow +
                containerPaddingsWithScroll, // each popup will have its own width
            useVirtualScroll: pageRows.length * this._dotsPagesPerRow >= 1000,
        });
    }

    private addPrev() {
        const pageCount = this.getPageCount();
        if (!this.showPrevNext || pageCount < 1) {
            return;
        }

        const prevBtn = {
            iconName: "caret-left",
            title: $localize`Previous Page`,
            page: this.page - 1 <= 0 ? 1 : this.page - 1,
        };
        const isDisabled = this.page - 1 <= 0;
        this.addItem(prevBtn, isDisabled);
    }

    private addNext() {
        const pageCount = this.getPageCount();
        if (!this.showPrevNext || pageCount < 1) {
            return;
        }

        const nextBtn = {
            iconName: "caret-right",
            title: $localize`Next Page`,
            page: this.page + 1 >= pageCount ? pageCount : this.page + 1,
        };
        const isDisabled = this.page + 1 > pageCount;
        this.addItem(nextBtn, isDisabled);
    }

    private addItem(item: IPaginatorItem, isDisabled: boolean) {
        this.itemsList.push({
            iconName: item.iconName,
            value: item.value,
            title: item.title,
            style: isDisabled ? this.disabledClass : "",
            action: () => {
                if (item.page) {
                    this.goToPage(item.page);
                }
                return false;
            },
        });
    }

    private add(page: number) {
        const inst = this;
        this.itemsList.push({
            value: page,
            title: $localize`Page ${page}`,
            style: this.page === page ? this.activeClass : "",
            action: function () {
                inst.goToPage(this.value);
                return false;
            },
        });
    }

    private addRange(start: number, finish: number) {
        for (let index = start; index <= finish; index++) {
            this.add(index);
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
