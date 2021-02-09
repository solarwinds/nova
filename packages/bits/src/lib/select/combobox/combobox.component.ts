import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    QueryList,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewChildren,
    ViewEncapsulation
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import _debounce from "lodash/debounce";
import _escape from "lodash/escape";
import _every from "lodash/every";
import _find from "lodash/find";
import _flatMap from "lodash/flatMap";
import _includes from "lodash/includes";
import _isArray from "lodash/isArray";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import _isUndefined from "lodash/isUndefined";
import _some from "lodash/some";
import _unescape from "lodash/unescape";
import { Subject, Subscription } from "rxjs";

import { UtilService } from "../../../services/util.service";
import { NuiFormFieldControl } from "../../form-field/public-api";
import { MenuActionComponent } from "../../menu/menu-item/menu-action/menu-action.component";
import { MenuGroupComponent } from "../../menu/menu-item/menu-group/menu-group.component";
import { MenuItemBaseComponent } from "../../menu/menu-item/menu-item/menu-item-base";
import { MenuKeyControlService } from "../../menu/menu-key-control.service";
import { PopupComponent } from "../../popup-adapter/popup-adapter.component";
import { BaseSelect } from "../base-select";
import { ISelectGroup } from "../public-api";

// <example-url>./../examples/index.html#/combobox</example-url>
/**
 * @deprecated in v11 - Use ComboboxV2Component instead - Removal: NUI-5796
 */
@Component({
    selector: "nui-combobox",
    host: { "class": "nui-combobox" },
    templateUrl: "./combobox.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => ComboboxComponent),
        },
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => ComboboxComponent),
            multi: true,
        },
        MenuKeyControlService,
    ],
    styleUrls: ["./combobox.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class ComboboxComponent extends BaseSelect implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    /**
     * The option to clear the combobox if the value entered is not in array.
     */
    @Input() clearOnBlur: boolean;
    /**
     * A value that tells popup to be attached right after it's parent declaration or in <body>
     */
    @Input() appendToBody: boolean;

    public isOpened: boolean;
    public openControl: Subject<Event> = new Subject<Event>();

    @ViewChildren(MenuActionComponent) public menuItems: QueryList<MenuActionComponent>;
    @ViewChild("comboboxToggle", { read: ElementRef }) comboboxToggle: ElementRef;
    @ViewChild("scrollContainer", { read: ElementRef }) scrollContainer: ElementRef;
    @ViewChildren(MenuGroupComponent) public menuGroups: QueryList<MenuGroupComponent>;
    @ViewChild(PopupComponent) popup: PopupComponent;
    @ViewChild(PopupComponent, { read: ElementRef, static: true }) popupRef: ElementRef; // static: true because of getWidth

    private debouncedBlur = _debounce(() => {
        this.handleBlur();
    }, 300);

    private comboboxEventListeners: Function[] = [];
    private itemsChangeSubscription: Subscription;
    private focusMonitorSubscription: Subscription;

    @HostBinding("class.nui-combobox--justified")
    get isJustified() {
        return this.justified;
    }

    @HostBinding("class.nui-combobox--inline")
    get isInline() {
        return this.inline;
    }

    constructor(utilService: UtilService,
                private elRef: ElementRef,
                private renderer: Renderer2,
                private changeDetector: ChangeDetectorRef,
                private keyControlService: MenuKeyControlService,
                private focusMonitor: FocusMonitor) {
        super(utilService);
        // Blur is debounced cause when you click on menu item blur is triggered twice: from textbox and when popup is closed.
        this.comboboxEventListeners.push(
            this.renderer.listen(this.elRef.nativeElement, "focusout", () => {
                this.debouncedBlur();
            })
        );
    }

    ngOnInit() {
        super.ngOnInit();

    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    public displayPlaceholder(): boolean {
        return !_isUndefined(this.placeholder) && _isEmpty(this.inputValue);
    }

    public displayPlaceholderValue() {
        return this.displayPlaceholder() ? this.placeholder : "";
    }

    public showIcon() {
        return !_isNil(this.icon);
    }

    public showRightBorder() {
        return !this.isRemoveValueDisplayed() && !_isEmpty(this.inputValue);
    }

    public isRemoveValueDisplayed() {
        return this.isRemoveValueEnabled && !_isEmpty(this.inputValue);
    }

    public ngAfterViewInit() {
        // setting data for key-control service
        this.setKeyboardManagerServiceData();
        // initializing key-control manager
        this.keyControlService.initKeyboardManager();

        // listening to events for key-control
        this.comboboxEventListeners.push(
            this.renderer.listen(this.elRef.nativeElement, "keydown", (event: KeyboardEvent) => {
                this.keyControlService.handleKeydown(event);
            })
        );

        // listen to focus event to open popup using tab key
        // The FocusMonitor is an injectable service that can be used to listen for changes in the focus state of an element.
        // It's more powerful than just listening for focus or blur events because it tells you how the element was focused
        // (via mouse, keyboard, touch, or programmatically).
        // It also allows listening for focus on descendant elements if desired as it is done below by passing second
        // argument with value true in the monitor method of FocusMonitor.
        this.focusMonitorSubscription = this.focusMonitor.monitor(this.comboboxToggle.nativeElement, true).subscribe((origin: FocusOrigin) => {
            if (origin === "keyboard") {
                if (!this.popup.popupToggle.disabled) {
                    if (!this.isOpened) {
                        this.openControl.next(new FocusEvent("focusin"));
                    }
                }
            }
        });

        // when datasource change we need to re-initialize key control stuff
        this.itemsChangeSubscription = this.menuItems.changes
            .subscribe((changes: QueryList<MenuItemBaseComponent>) => {
                const activeIndex = this.keyControlService.getActiveItemIndex();
                this.keyControlService.initKeyboardManager();
                this.keyControlService.setActiveItem(0);
                this.changeDetector.detectChanges();
            });

        // when appendToBody is set width of the popup element should be calculated
        // To get actual value detectChanges() call afterViewInit is needed
        this.changeDetector.detectChanges();
    }

    private setKeyboardManagerServiceData(): void {
        this.keyControlService.menuGroups = this.menuGroups;
        this.keyControlService.menuItems = this.menuItems;
        this.keyControlService.popup = this.popup;
        this.keyControlService.menuToggle = this.comboboxToggle;
    }

    public openChange(currentValue: boolean) {
        this.keyControlService.setActiveItem(-1);
        this.isOpened = currentValue;
    }

    public onInputChange(value: any) {
        const oldValue = this.selectedItem;
        const newValue = this.displayValue ? this.findObjectByValue(value) : value;

        this.changeValue(newValue);
        this.changed.emit({ newValue, oldValue });
    }

    public handleBlur() {
        const newValue = this.displayValue ? this.findObjectByValue(_unescape(this.inputValue)) : _unescape(this.inputValue);
        const isGroupedData = this.isGroupedData(this.itemsSource);
        let isInArray: boolean;
        if (isGroupedData) {
            const flattenedData = _flatMap(this.itemsSource, (group) => group.items);
            isInArray = this.displayValue ? _some(flattenedData, newValue) : _includes(flattenedData, newValue);
        } else {
            isInArray = this.displayValue ? _some(this.itemsSource, newValue) : _includes(this.itemsSource, newValue);
        }
        const valueToSelect = this.clearOnBlur && !isInArray ? "" : this.selectedItem;
        this.select(valueToSelect);
    }

    public select(item: any) {
        super.select(item);
    }

    public findObjectByValue(value: any) {
        let arrayOfValues: any[];
        let foundObject: any;

        // for itemsSource passed as ISelectGroup[]
        if (this.isGroupedData(this.itemsSource)) {
            arrayOfValues = _flatMap(this.itemsSource, (group) => group.items);
        } else {
            arrayOfValues = this.itemsSource;
        }

        foundObject = _find(arrayOfValues, [this.displayValue, value]);
        return foundObject ? foundObject : value;
    }

    public isGroupedData(itemsSource: any[] | ISelectGroup[]): itemsSource is ISelectGroup[] {
        return _every(itemsSource, (group) => _isArray(group.items));
    }

    public getItemDisplay(item: any): string {
        return super.getItemDisplay(item);
    }

    public escapeItem(item: string): string {
        return _escape(item);
    }

    public unescapeItem(item: string): string {
        return _unescape(item);
    }

    public ngOnDestroy() {
        if (this.itemsChangeSubscription) {
            this.itemsChangeSubscription.unsubscribe();
        }
        if (this.comboboxEventListeners.length > 0) {
            this.comboboxEventListeners.forEach(listener => listener());
        }
        if (this.focusMonitorSubscription) {
            this.focusMonitorSubscription.unsubscribe();
        }
    }

    public getWidth(): string {
        return this.customTemplate ? "auto" : this.popupRef.nativeElement.getBoundingClientRect().width;
    }

    public getPopupContextClass(): string {
        return `${this.justified ? "nui-combobox--justified " : ""}nui-combobox-popup-host`;
    }

    public clearValue(event: Event) {
        if (this.isRemoveValueEnabled) {
            this.changeValue(null);
            event.stopPropagation(); // To avoid triggering dropdown open/close
            this.popup.closePopup();
        }
    }
}
