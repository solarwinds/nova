import {CdkDrag, DragDrop, DragRef, DropListRef, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {Point} from "@angular/cdk/drag-drop/drag-ref";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    IterableDiffer,
    IterableDiffers,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren,
    ViewEncapsulation
} from "@angular/core";
import _isEqual from "lodash/isEqual";
import {Subject} from "rxjs";
import {takeUntil, tap} from "rxjs/operators";

import {nameof} from "../../functions/nameof";
import {IFilter, IFilterPub, INovaFilters, IRepeatFilter} from "../../services/data-source/public-api";
import {LoggerService} from "../../services/log-service";

import {
    IItemsReorderedEvent,
    IRepeatItem,
    IRepeatItemConfig,
    PaddingOptions,
    RepeatSelectionMode
} from "./types";

interface IDndItemDropped {
    item: DragRef;
    currentIndex: number;
    previousIndex: number;
    container: DropListRef;
    previousContainer: DropListRef;
    isPointerOverContainer: boolean;
    distance: Point;
}

/**
 * repeat is used for displaying of continuous rows.
 * It can be used in "single"/"radio" or "multi" selection mode
 * <example-url>./../examples/index.html#/repeat</example-url>
 */
@Component({
    selector: "nui-repeat",
    templateUrl: "./repeat.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["./repeat.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.virtual-scroll-viewport]": "virtualScroll",
        "[attr.role]": "role",
        "[attr.aria-multiselectable]": "selectionMode === repeatSelectionMode.multi || null",
    },
})
export class RepeatComponent<T extends IRepeatItem = any> implements OnInit, OnDestroy, AfterViewInit, DoCheck, IFilterPub {
    /**
     * Turns on/off dragging functionality
     */
    @Input()
    public set draggable(value: boolean) {
        this._draggable = value;

        // make sure we initialize the list
        this.initializeCDKDropList();

        if (this.dropListRef) {
            this.dropListRef.disabled = !this._draggable;
        }

        if (!this._draggable && this._reorderable) {
            this._reorderable = false;
            this.reorderableChange.emit(this._reorderable);
        }
    }

    public get draggable() {
        return this._draggable;
    }

    /**
     * Turns on/off item reorder functionality
     */
    @Input()
    public set reorderable(value: boolean) {
        if (this._draggable === false) {
            this.logger.warn("'reorderable' property must be used only when draggable is true");
        }

        // make item also draggable ONLY if we ever change it to sortable
        if (value && !this._draggable) {
            this._draggable = true;
            this.draggableChange.emit(value);
        }

        // update propriety ONLY if it actually changes
        if (this.dropListRef && this._reorderable !== value) {
            this.dropListRef.sortingDisabled = !value;
        }

        this._reorderable = value;
    }

    public get reorderable() {
        return this._reorderable;
    }

    // made event async to avoid ExpressionChangedAfterItHasBeenCheckedError
    @Output() draggableChange: EventEmitter<boolean> = new EventEmitter<boolean>(true);
    @Output() reorderableChange: EventEmitter<boolean> = new EventEmitter<boolean>(true);

    /**
     * This will stretch repeat items full width
     */
    @HostBinding("style.width") width = "100%";

    /**
     * repeat item template
     */
    @Input() repeatItemTemplateRef: TemplateRef<any>;

    /**
     * Drag handle template that is applied on each item
     */
    @Input() dragHandleTemplateRef: TemplateRef<any>;

    /**
     * Drag preview class that is applied on the previewed item
     *
     * This input is required since CDK adds the preview DOM element as the last child on the body;
     * without it all drag previews within a project would have the same style
     */
    @Input() dragPreviewClass: string = "nui-dnd-preview";

    /**
     * Drag preview template that is applied on each item
     */
    @Input() dragPreviewTemplateRef: TemplateRef<any>;

    /**
     * Actions-container content.
     */
    @Input() actionsTemplateRef: TemplateRef<any>;

    /**
     * Possible values are 'single', 'radio', 'multi' and 'none'
     */
    @Input() public selectionMode: RepeatSelectionMode = RepeatSelectionMode.none;

    /**
     * repeat rows padding. Possible values are:
     * 'normal', 'compact'.
     * Default value is 'compact'.
     */
    @Input() public paddingSize: PaddingOptions;

    /**
     * Enables virtual scroll feature. Requires @itemSize input to have a correct item size set.
     */
    @Input() public virtualScroll: boolean = false;

    /**
     * Required for virtual scroll. Don't forget to set a correct value here if you want to use virtual scroll.
     * The input accepts values in px only
     * @returns {number}
     */
    @Input() public itemSize: number;

    /**
     * Selected repeat objects
     */
    @Input() public selection: T[] = [];
    /**
     * Is emitted when on items order has changed
     */
    @Output() public itemsReordered = new EventEmitter<IItemsReorderedEvent<T>>();

    /**
     * item config object containing callbacks
     */
    @Input() public itemConfig: IRepeatItemConfig<T>;

    /**
     * repeat view objects array
     */
    @Input() public itemsSource: T[];

    /**
     * Is selected item should be highlighted
     */
    @Input() public highlightSelectedItem = true;

    /**
     * Is emitted when another item in the repeat is selected
     */
    @Output() public selectionChange = new EventEmitter<any[]>();

    @ViewChild("dropListArea") dropListArea: ElementRef;

    /**
     * Reference to CdkVirtualScrollViewport exposed to give users control
     * over virtual viewport (ex. infinite scroll, programmatic repeat container scrolling).
     *
     * @see https://material.angular.io/cdk/scrolling/api#CdkVirtualScrollViewport
     */
    @ViewChild(CdkVirtualScrollViewport) private _viewportRef: CdkVirtualScrollViewport;
    public get viewportRef(): CdkVirtualScrollViewport {
        if (!this.virtualScroll) {
            throw new Error("VirtualScroll is not enabled");
        }
        return this._viewportRef;
    }

    @ViewChildren(CdkDrag) draggableElements: QueryList<CdkDrag>;

    public mousedOver: boolean[] = [];

    /**
     * Reference to CDK DropList so that the user can also subscribe
     * to its events in case he requires to
     * @see https://material.angular.io/cdk/drag-drop/api#DropListRef
     */
    public dropListRef: DropListRef;

    // Note: workaround to be able to use enum values in template
    public repeatSelectionMode = RepeatSelectionMode;

    /**
     * Allows the list items to be draggable or not
     *
     * Note: This is not initialized so we can know whether it's been set by the consumer
     */
    private _draggable: boolean;

    /**
     * Allows the list items to be reorderable or not
     */
    private _reorderable: boolean;

    private selectionHasChanged = false;
    private itemsSourceDiff: IterableDiffer<T>;
    private intersectionObserver: IntersectionObserver;

    /** Emits when the drop list has been destroyed. */
    private readonly dropListDestroyed = new Subject<void>();

    get role(): string { return this.selectionMode !== "none" ? "listbox" : "list"; }

    constructor(public changeDetector: ChangeDetectorRef, public logger: LoggerService,
                private iterableDiffers: IterableDiffers, public dragDropService: DragDrop,
                private elRef: ElementRef) {
    }

    public ngOnInit() {
        this.intersectionObserver = new IntersectionObserver(this.intersectionObserverCallback);
        this.intersectionObserver.observe(this.elRef.nativeElement);

        if (this.dragPreviewTemplateRef || this.dragHandleTemplateRef || this._reorderable === true) {
            this._draggable = true;
            this.draggableChange.emit(this._draggable);
        }

        this.paddingSize = this.paddingSize in PaddingOptions ? this.paddingSize : PaddingOptions.compact;
        if (!this.itemSize && this.virtualScroll) {
            this.logger.error("ERROR: To use virtual scroll feature please set correct value to the 'itemSize' input!");
        }

        // Note: Using empty array as a fallback value to obtain a proper differ factory
        // when the itemsSource is not provided by parent at init.
        this.itemsSourceDiff = this.iterableDiffers.find(this.itemsSource || []).create();
    }

    public ngDoCheck(): void {
        // Note: In case the input value have changed the CD will not be triggered because
        // of onPush strategy we have to check if array values changed manually and trigger CD.
        if (this.itemsSourceDiff.diff(this.itemsSource)) {
            this.changeDetector.markForCheck();
        }
    }

    public ngAfterViewInit() {
        this.initializeCDKDropList();
    }

    /**
     * Cleanup CDK
     * PS: No need to unsubscribe from the EventEmitters, they are handled
     * automatically by Angular & RxJs
     */
    public ngOnDestroy(): void {
        this.intersectionObserver?.unobserve(<Element>this.elRef.nativeElement);
        this.disposeCDKDropList();
    }

    public update() {
        this.changeDetector.detectChanges();
    }

    public getFilters(): IFilter<IRepeatFilter> {
        const response = {
            type: nameof<INovaFilters>("selection"),
            value: {
                selection: this.selection,
                itemsSource: this.itemsSource,
                selectionMode: this.selectionMode,
                selectionHasChanged: this.selectionHasChanged,
            },
        };
        this.selectionHasChanged = false;
        return response;
    }

    /**
     * Checks if repeat item is selected
     * @param item selected repeat item in repeat
     */
    public isItemSelected(item: T): boolean {
        if (!this.highlightSelectedItem) {
            return false;
        }

        switch (this.selectionMode) {
            case RepeatSelectionMode.single:
            case RepeatSelectionMode.radio:
            case RepeatSelectionMode.singleWithRequiredSelection:
            case RepeatSelectionMode.radioWithNonRequiredSelection:
                return (this.selection && _isEqual(item, this.selection[0]));
            case RepeatSelectionMode.multi:
                return Boolean(this.selection && this.selection.length && this.selection.indexOf(item) !== -1);
            default:
                return false;
        }
    }

    /**
     * repeat item is clicked
     * @param event
     * @param item value object that is used in nui-repeat-item
     */
    public itemClicked(event: any, item: T) {
        if (this.selectionMode === RepeatSelectionMode.none || this.isItemDisabled(item)) {
            return;
        } else if (this.selectionMode === RepeatSelectionMode.multi) {
            event.preventDefault(); // TODO: add reasoning for this
            this.selectionHasChanged = true;
            this.multiSelectionChanged(item);
        } else {
            if (this.selectionMode === RepeatSelectionMode.singleWithRequiredSelection ||
                this.selectionMode === RepeatSelectionMode.radio) {
                this.selection = [item];
            }
            if (this.selectionMode === RepeatSelectionMode.single ||
                this.selectionMode === RepeatSelectionMode.radioWithNonRequiredSelection) {
                if (this.selection.indexOf(item) !== -1) {
                    this.selection = [];
                } else {
                    this.selection = [item];
                }
            }
            this.changeDetector.markForCheck();
            this.selectionHasChanged = true;
            this.selectionChange.emit(this.selection);
            return;
        }
    }

    /**
     * nui-repeat-item selection change handler
     * @param item selected nui-repeat-item
     */
    public multiSelectionChanged(item: T) {
        if (this.selection.indexOf(item) === -1) {
            this.selection = [...this.selection, item];
        } else {
            this.selection = this.selection.filter(selectionItem => selectionItem !== item);
        }
        this.selectionChange.emit(this.selection);
    }

    /* START - ITEM BEHAVIOUR DECIDERS */
    public isItemDisabled(item: T): boolean {
        return (item as IRepeatItem).hasOwnProperty(nameof<IRepeatItem>("disabled"))
            ? (item as IRepeatItem).disabled
            : !!this.itemConfig?.isDisabled?.(item);
    }

    public isItemDraggable(item: T): boolean {
        if (this.virtualScroll || this.isItemDisabled(item)) {
            return false;
        }

        // Note: Item cannot be draggable if the main draggable is off.
        if (this.itemConfig && this.draggable === false) {
            this.logger.warn(`Draggable config per item is available only when ${nameof<RepeatComponent<T>>("draggable")} is set to true`);
            return false;
        }
        return this.itemConfig?.isDraggable?.(item) ?? this.draggable;
    }
    /* END - ITEM BEHAVIOUR DECIDERS */

    private initializeCDKDropList() {
        if (!this.virtualScroll && this.dropListArea && this._draggable && !this.dropListRef) {
            this.dropListRef = this.dragDropService.createDropList(this.dropListArea);
            this.dropListRef.disabled = !this._draggable;
            this.dropListRef.data = this.itemsSource;

            // self-destroyed subscription
            this.dropListRef.dropped.pipe(
                tap((event) => this.itemDropped(event)),
                takeUntil(this.dropListDestroyed)
            ).subscribe();

            this.dropListRef.withItems(this.draggableElements.map(item => item._dragRef));
        }
    }

    private disposeCDKDropList() {
        if (this.dropListRef) {
            this.dropListRef.dispose();
            this.dropListDestroyed.next();
            this.dropListDestroyed.complete();
        }
    }

    private itemDropped(event: IDndItemDropped) {
        // CDK retrieves incorrectly event.previousIndex so we need to compute it ourselves
        const item = event.item.data;
        const computedPreviousIndex = this.itemsSource.indexOf(item.data, 0);
        const oldSorting = [...this.itemsSource];
        const newSorting = [...this.itemsSource];

        let sortingOrderChanged: boolean = true;

        this.mousedOver = [];

        if (event.previousContainer === event.container) {
            moveItemInArray(newSorting, computedPreviousIndex, event.currentIndex);
            sortingOrderChanged = computedPreviousIndex !== event.currentIndex;
        } else {
            // moves the item from the source: event.container[computedPreviousIndex] to target: event.container.data[event.currentIndex]
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                computedPreviousIndex,
                event.currentIndex);
        }

        if (sortingOrderChanged) {
            // trigger event only if position index or the container actually changed
            this.itemsReordered.emit({
                item: item,
                previousIndex: computedPreviousIndex,
                currentIndex: event.currentIndex,
                currentState: newSorting,
                previousState: oldSorting,
                dropListRef: this.dropListRef,
            });
        }
    }

    private intersectionObserverCallback = (entries: IntersectionObserverEntry[], observer: IntersectionObserver): void => {
        if (entries[0].isIntersecting && this.virtualScroll) {
            // recheck the cdk viewport size in case the repeat is instantiated before becoming visible in the viewport (NUI-5820)
            this.viewportRef.checkViewportSize();
        }
    }
}
