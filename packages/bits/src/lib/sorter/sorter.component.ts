import { OverlayConfig } from "@angular/cdk/overlay";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component, ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import _assign from "lodash/assign";
import _isEqual from "lodash/isEqual";
import _values from "lodash/values";
import ResizeObserver from "resize-observer-polyfill";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IFilter, IFilterPub, ISorterFilter } from "../../services/data-source/public-api";
import { LoggerService } from "../../services/log-service";
import { IMenuGroup, IMenuItem } from "../menu/public-api";
import { PopupComponent } from "../popup-adapter/popup-adapter.component";

import { ISortedItem, ISorterChanges, SorterDirection } from "./public-api";
import {OVERLAY_WITH_POPUP_STYLES_CLASS} from "../overlay/constants";
import {OverlayComponent} from "../overlay/overlay-component/overlay.component";

const SORTER_MAX_WIDTH = 450;

// <example-url>./../examples/index.html#/sorter</example-url>

@Component({
    selector: "nui-sorter",
    host: {
        "class": "nui-sorter",
    },
    templateUrl: "./sorter.component.html",
    styleUrls: ["./sorter.component.less"],
    encapsulation: ViewEncapsulation.None,
})

export class SorterComponent implements OnChanges, OnDestroy, AfterViewInit, IFilterPub {
    @Input() appendToBody: boolean;
    @Input() caption: string;

    // Note: The string[] type for itemsSource is the legacy non-i18n-friendly type
    // and it should be removed as an option in v10 or later.
    @Input() itemsSource: string[] | IMenuItem[];

    @Input() selectedItem: string;
    @Input() sortDirection: any;

    @Output() sorterAction = new EventEmitter<ISorterChanges>();

    @ViewChild(PopupComponent) popupElement: PopupComponent;
    @ViewChild("popupArea", {static: true}) popupArea: ElementRef;
    @ViewChild(OverlayComponent) public overlay: OverlayComponent;

    // mark this filter to be monitored by our datasource for any changes in order reset other filters(eg: pagination)
    // before any new search is performed
    public detectFilterChanges = true;

    public customContainer: ElementRef | undefined;
    public popupWidth: string;
    public onDestroy$ = new Subject<void>();
    public items: IMenuGroup[] = [{
        itemsSource: [],
    }];
    public overlayConfig: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS],
        maxWidth: SORTER_MAX_WIDTH,
    };

    private sortConfig: ISortedItem;
    private sortIcons: { [key: string]: string } = {
        [SorterDirection.ascending]: "arrow-up",
        [SorterDirection.descending]: "arrow-down",
    };
    private overlayResizeObserver: ResizeObserver;

    constructor(private logger: LoggerService,
                private cdRef: ChangeDetectorRef) {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.itemsSource && !_isEqual(changes.itemsSource.previousValue, changes.itemsSource.currentValue)) {
            if (this.itemsSource?.length > 0 && typeof this.itemsSource[0] === "string") {
                this.logger.warn(`The 'string[]' type for the sorter's itemsSource input is deprecated as of Nova v9. \
                                  Instead, use type 'IMenuItem[]' which is internationalizable with title and value properties for each item.`);
            }
            this.initSelectedItem();
            this.initPopupItems();
        }

        if (changes.selectedItem && this.sortConfig?.sortBy !== changes.selectedItem.currentValue && !changes.selectedItem.firstChange) {
            const oldValue = _assign({}, this.sortConfig, {sortBy: changes.selectedItem.previousValue});

            this.selectedItem = changes.selectedItem.currentValue;
            this.sortConfig = _assign({}, this.sortConfig, {sortBy: changes.selectedItem.currentValue});

            this.triggerSorterAction(oldValue);

            this.setPopupSelection();
        }

        if (changes.appendToBody) {
            this.customContainer = changes.appendToBody.currentValue ? undefined : this.popupArea;
        }
    }

    public ngAfterViewInit() {
        this.initSelectedItem();
        this.initSortDirection();

        this.sortConfig = {
            sortBy: this.selectedItem,
            direction: this.sortDirection,
        };
        this.overlay.clickOutside
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(_ => this.overlay.hide());
        // this.handleSyncWidth();
    }

    public select(item: IMenuItem) {
        // perform update only if the new value actually changes
        if (this.selectedItem !== item.value) {
            const oldValue = this.sortConfig;

            this.selectedItem = item.value;
            this.sortConfig = _assign({}, this.sortConfig, {
                sortBy: item.value,
            });

            this.triggerSorterAction(oldValue);
            this.setPopupSelection();
        }
    }

    public toggleSortDirection(): void {
        const oldValue = this.sortConfig;

        this.sortDirection = (this.sortDirection === SorterDirection.ascending) ?
            SorterDirection.descending : SorterDirection.ascending;
        this.sortConfig = _assign({}, this.sortConfig, {
            direction: this.sortDirection,
        });
        this.sorterAction.emit({ newValue: this.sortConfig, oldValue });
    }

    public getSelectedItem(): any {
        return this.selectedItem;
    }

    public getSelectedItemTitle(): string {
        return this.items[0].itemsSource.find((item: IMenuItem) => item.isSelected)?.title;
    }

    public getSortIcon(): string {
        return this.sortIcons[this.sortDirection];
    }

    public getFilters(): IFilter<ISorterFilter> {
        return {
            type: "sorter",
            value: { ...this.sortConfig },
        };
    }

    public toggleSorter() {
        if (this.appendToBody || !this.popupWidth) {
            this.cdRef.detectChanges();
        }
    }

    public ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();

        if (this.popupElement?.popup) {
            this.popupElement.popup.ngOnDestroy();
        }
        if (this.overlayResizeObserver) {
            this.overlayResizeObserver.disconnect();
        }
    }

    private initSelectedItem() {
        // skip initialization in case we already have a value
        // or if the itemsSource are lazy loaded
        if (this.selectedItem || !this.itemsSource?.length) {
            return;
        }

        const firstItem = this.itemsSource[0];
        this.selectedItem = typeof firstItem === "string" ? firstItem : (firstItem as IMenuItem).value;
    }

    private initPopupItems() {
        this.items[0].itemsSource = (this.itemsSource as any[]).map((item: string | IMenuItem) => {
            const menuItem: IMenuItem = typeof item === "string" ? { title: item, value: item } : item as IMenuItem;
            menuItem.isSelected = this.selectedItem === menuItem.value;
            return menuItem;
        });
    }

    private initSortDirection(): void {
        if (_values(SorterDirection).indexOf(this.sortDirection) === -1) {
            this.sortDirection = SorterDirection.ascending;
        }
    }

    private setPopupSelection(): void {
        this.items[0].itemsSource.forEach((popupItem: IMenuItem) => {
            popupItem.isSelected = popupItem.value === this.selectedItem;
        });
    }

    private handleSyncWidth() {
        this.popupElement.opened
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(this.handleOverlayResize);
    }

    private handleOverlayResize = (isOpened: boolean): void => {
        if (!isOpened) {
            this.overlayResizeObserver.disconnect();
            return;
        }

        this.overlayResizeObserver = new ResizeObserver(() => {
            const overlayWidth = this.popupElement.popupAreaContent.nativeElement.offsetWidth;
            const toggleRefWidth = this.popupElement.toggleReference.offsetWidth;

            if (overlayWidth < toggleRefWidth) {
                this.popupElement.popup.getOverlayRef().updateSize({
                    minWidth: toggleRefWidth,
                });
            }
        });

        this.overlayResizeObserver.observe(this.popupElement.popupAreaContent.nativeElement);
    }

    private triggerSorterAction(oldValue: ISortedItem) {
        this.sorterAction.emit({ newValue: this.sortConfig, oldValue });
    }
}
