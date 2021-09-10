import { FocusMonitor, FocusOrigin } from "@angular/cdk/a11y";
import {
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import _isEmpty from "lodash/isEmpty";
import { Subject, Subscription } from "rxjs";

import { ButtonSizeType } from "../../../lib/button/public-api";
import { PopupComponent } from "../../popup-adapter/popup-adapter.component";
import { MenuGroupComponent } from "../menu-item/menu-group/menu-group.component";
import { MenuItemBaseComponent } from "../menu-item/menu-item/menu-item-base";
import { MenuKeyControlService } from "../menu-key-control.service";
import { MenuPopupComponent } from "../menu-popup/menu-popup.component";
import { IMenuItem } from "../public-api";

/**
 * Examples: <example-url>./../examples/index.html#/menu</example-url><br />
 * "nui-menu" provides simple dropdown menu option with custom items:
 * "nui-header", "nui-divider", "nui-action", "nui-link", "nui-option"
 */
@Component({
    selector: "nui-menu",
    host: {
        "class": "nui-menu",
        "[attr.aria-label]": "title || ariaLabel",
    },
    templateUrl: "./menu.component.html",
    styleUrls: ["./menu.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [MenuKeyControlService],
})
export class MenuComponent implements AfterViewInit, OnChanges, OnDestroy {
    public iconSize = "";
    public iconColor = "";
    @Input() public widthOfPopup: string;
    @Input() public contextClass: string;
    /**
     * Should dropdown be appended to body or not
     */
    @Input() public appendToBody: boolean;
    /**
     * sets aria-label for menu button
     */
    @Input() public ariaLabel: string;
    /**
     * sets title/name for menu button
     */
    @Input() public title: string;
    /**
     * sets size of menu button and caret icon
     * (take a look on nui-button possible sizes)
     */
    @Input() public size?: ButtonSizeType;
    /**
     * sets styles for menu button
     * (take a look on nui-button possible styles)
     */
    @Input() public displayStyle?: string;
    /**
     * Disables menu and prevents it from opening
     */
    @Input() public isDisabled: boolean;
    /**
     * adds additional icon at the left of menu button
     * (take a look on nui-icon possible values)
     */
    @Input() public icon = "caret-down";
    /**
     *Value to be used as menu items data.
     */
    @Input() public itemsSource?: IMenuGroup[];
    /**
     * Event emitted when menu is blurred.
     */
    @Output() public blurred = new EventEmitter();

    public menuOpenStream = new Subject<boolean>();
    // Only menu that resolves *ngIf on <ng-content> with these menuItems can correctly get ContentChildren
    @ContentChildren(MenuItemBaseComponent, {descendants: true}) public menuItems: QueryList<MenuItemBaseComponent>;
    @ContentChildren(MenuGroupComponent) public menuGroups: QueryList<MenuGroupComponent>;
    @ViewChild(PopupComponent) public popup: PopupComponent;
    @ViewChild(MenuPopupComponent) menuPopup: MenuPopupComponent;
    @ViewChild("menuToggle", { read: ElementRef }) menuToggle: ElementRef;

    private menuKeyControlListeners: Function[] = [];
    private focusMonitorSubscription: Subscription;
    constructor(private keyControlService: MenuKeyControlService,
                private renderer: Renderer2,
                private focusMonitor: FocusMonitor) {}

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["size"]) {
            // Empty string sets the default size of an icon 16x16 defined by .nui-icon class
            this.iconSize = this.size === ButtonSizeType.compact ? "small" : "";
        }

        if (changes["displayStyle"]) {
            this.iconColor = this.displayStyle === "primary" ? "white" : "";
        }

    }

    ngAfterViewInit() {
        // setting data for key-control service
        this.setKeyboardManagerServiceData();
        // initializing key-control manager
        this.keyControlService.initKeyboardManager();
        // listening to events for key-control
        this.menuKeyControlListeners.push(
            this.renderer.listen(this.menuToggle.nativeElement, "keydown", (event: KeyboardEvent) => {
                if (!this.popup.popupToggle.disabled) {
                    this.keyControlService.handleKeydown(event);
                }
            })
        );
        // opening menu on focusin
        // The FocusMonitor is an injectable service that can be used to listen for changes in the focus state of an element.
        // It's more powerful than just listening for focus or blur events because it tells you how the element was focused
        // (via mouse, keyboard, touch, or programmatically).
        this.focusMonitorSubscription = this.focusMonitor.monitor(this.menuToggle.nativeElement).subscribe((origin: FocusOrigin) => {
            if (origin === "keyboard") {
                if (!this.popup.popupToggle.disabled) {
                    this.popup.toggleOpened(new FocusEvent("focusin"));
                }
            }
        });
    }

    public isMenuCompact() {
        return this.size === "compact";
    }

    public isTitlePresent() {
        return !_isEmpty(this.title);
    }

    public onBlur(event: any) {
        this.blurred.emit(event);
    }

    public onMenuOpen() {
        this.menuOpenStream.next();
    }

    public isJustified() {
        return this.contextClass?.includes("nui-select--justified");
    }

    private setKeyboardManagerServiceData(): void {
        this.keyControlService.menuGroups = this.menuGroups;
        this.keyControlService.menuItems = this.menuItems;
        this.keyControlService.popup = this.popup;
        this.keyControlService.menuToggle = this.menuToggle;
        this.keyControlService.keyControlItemsSource = !!this.itemsSource;
        this.keyControlService.menuPopup = this.menuPopup;
        this.keyControlService.menuOpenListener = this.menuOpenStream;
    }

    ngOnDestroy(): void {
        this.menuKeyControlListeners.forEach(listener => listener());
        this.focusMonitorSubscription.unsubscribe();
    }
}
