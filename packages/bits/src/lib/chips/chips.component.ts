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

import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  output
} from "@angular/core";
import _isEmpty from "lodash/isEmpty";
import _size from "lodash/size";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { ChipComponent } from "./chip/chip.component";
import { ChipsOverflowService } from "./chips-overflow.service";
import {
    IChipRemoved,
    IChipsGroup,
    IChipsItem,
    IChipsItemsSource,
} from "./public-api";

// <example-url>./../examples/index.html#/chips</example-url>

/**
 * Control used to list groups of selected options (former ng1 nui-chiclets component).
 *
 *  __Usage:__
 *
 * ```html
 * <nui-chips [autoHide]="false"
 *            [itemsSource]="itemsSource"
 *            [title]="title"
 *            [orientation]="'vertical'"
 *            [allowRemoveAll]="false"
 *            [removeAllLinkText]="clearAllText"
 *            (chipRemoved)="onRemove($event)"
 *            (removeAll)="onRemoveAll()">
 * </nui-chips>
 * ```
 *
 */
@Component({
    selector: "nui-chips",
    templateUrl: "./chips.component.html",
    styleUrls: ["./chips.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [ChipsOverflowService],
    host: { "[attr.role]": "role" },
    standalone: false,
})
export class ChipsComponent
    implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
    /**
     * Whether overflow mode turned on
     */
    @Input() overflow: boolean = false;
    /**
     * Limits chips lines if overflow mode
     */
    @Input() overflowLinesNumber: number = 1;
    /**
     * Flag for 'Clear all' link visibility.
     */
    @Input() public allowRemoveAll = true;
    /**
     * Expression to determine if the component is hidden when 'itemsSource' is empty.
     */
    @Input() public autoHide = true;
    /**
     * Value to be shown as remove all link text.
     */
    @Input() public removeAllLinkText: string;
    /**
     * Data source. Both 'flatItems' and 'groupedItems' collections could be passed simultaneously
     * (previous ng1 implementation did not allow that, it handled only one type of items).
     */
    @Input() public itemsSource: IChipsItemsSource;
    /**
     * Can be set to 'vertical' to switch chips to vertical list mode. Otherwise horizontal mode is used.
     */
    @Input() public orientation: "horizontal" | "vertical";
    /**
     * Value to be shown as vertical orientation chips title.
     */
    @Input() public title: string;

    /** */
    @Input() public customClass: string;
    /**
     * Event that is fired when single item is cleared (by clicking on item or its remove icon).
     * Event data passed contains object with item clicked and its parent group.
     */
    public readonly chipRemoved = output<IChipRemoved>();
    /**
     * Event that is fired when 'Clear All' is clicked.
     */
    public readonly removeAll = output<MouseEvent>();

    /**
     * Emits overflowed chips if chips overflow
     */
    public readonly chipsOverflowed = output<IChipsItemsSource>();

    public isOverflowed: boolean;

    @ViewChild("chipsMainCell") private mainCell: ElementRef;
    @ViewChild("clearAll") private set clearAll(elem: ElementRef) {
        this.chipsOverflowService.clearAll = elem;
    }
    @ViewChild("nuiChips") private nuiChips: ElementRef;
    @ViewChildren("chipItem") private allChips: QueryList<
        ChipComponent | ElementRef<HTMLElement>
    >;
    @ContentChild("overflowCounterLabel") private set overflowCounter(
        el: ElementRef<HTMLElement>
    ) {
        this.chipsOverflowService.overflowCounter = el;
    }

    private readonly destroy$ = new Subject<void>();

    get role(): string | null {
        return this.getItemsCount() ? "list" : null;
    }

    constructor(
        private zone: NgZone,
        private chipsOverflowService: ChipsOverflowService
    ) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.itemsSource) {
            this.chipsOverflowService.itemsSource =
                changes.itemsSource.currentValue;
        }
        if (changes.overflowLinesNumber) {
            this.chipsOverflowService.overflowLinesNumber =
                changes.overflowLinesNumber.currentValue;
        }
        if (changes.overflow && !changes.overflow.currentValue) {
            this.chipsOverflowService.onDestroy();
        }
    }

    public ngOnInit(): void {
        this.removeAllLinkText = this.removeAllLinkText || $localize`Clear all`;
    }

    public ngAfterViewInit(): void {
        if (this.overflow) {
            this.initChipsOverflow();
        }
    }

    /** Handles Popup on window resize */
    @HostListener("window:resize")
    public onWinResize(): void {
        if (this.overflow && this.getItemsCount()) {
            this.chipsOverflowService.handleOverflow();
        }
    }

    public getItemsCount(): number {
        let count = _size(this.itemsSource.flatItems);
        if (!_isEmpty(this.itemsSource.groupedItems)) {
            count += (this.itemsSource.groupedItems || [])
                .map<number>((group) => group.items.length)
                .reduce((sum, val) => sum + val);
        }
        return count;
    }

    public onRemove(data: { item: IChipsItem; group?: IChipsGroup }): void {
        this.chipRemoved.emit(data);
    }

    public onRemoveAll(event: MouseEvent): void {
        this.removeAll.emit(event);
        event.preventDefault();
    }

    public ngOnDestroy(): void {
        if (this.overflow) {
            this.chipsOverflowService.onDestroy();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initChipsOverflow(): void {
        this.chipsOverflowService.mainCell = this.mainCell;
        this.chipsOverflowService.nuiChips = this.nuiChips;
        this.chipsOverflowService.allChips = this.allChips;
        this.chipsOverflowService.itemsSource = this.itemsSource;
        this.chipsOverflowService.overflowLinesNumber =
            this.overflowLinesNumber;

        this.chipsOverflowService.init();

        this.chipsOverflowService.chipsOverflowed
            .pipe(takeUntil(this.destroy$))
            .subscribe((e: IChipsItemsSource) => {
                this.chipsOverflowed.emit(e);
                this.isOverflowed = Boolean(
                    e.groupedItems?.length || e.flatItems?.length
                );
            });
    }
}
