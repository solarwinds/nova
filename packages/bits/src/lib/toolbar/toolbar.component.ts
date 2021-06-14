import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    QueryList,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from "@angular/core";
import _isEmpty from "lodash/isEmpty";
import { merge, Subject, Subscription } from "rxjs";
import { debounceTime, take, takeUntil } from "rxjs/operators";
import { KEYBOARD_CODE } from "../../constants";

import { LoggerService } from "../../services/log-service";
import { ButtonComponent } from "../button/button.component";
import { MenuComponent } from "../menu";

import {
    IToolbarGroupContent,
    IToolbarSelectionState,
    ToolbarItemDisplayStyle,
    ToolbarItemType,
} from "./public-api";
import { ToolbarGroupComponent } from "./toolbar-group.component";
import { ToolbarItemComponent } from "./toolbar-item.component";
import { ToolbarNavigationService } from "./toolbar-navigation.service";

/**
 * NUI wrapper for toolbar control. It groups toolbar items (nui-toolbar-item),
 * which can be aligned to the left or to the right side of the bar. Items are aligned to the left by default.
 * Use nui-toolbar-splitter to determine the place where the right alignment starts.
 * Use nui-toolbar-divider to display a vertical line between items.
 * <example-url>./../examples/index.html#/toolbar</example-url>
 */

@Component({
    selector: "nui-toolbar",
    templateUrl: "./toolbar.component.html",
    host: {
        "class": "nui-toolbar nui-strip-layout nui-flex-container",
        "role": "toolbar",
    },
    styleUrls: ["./toolbar.component.less"],
    providers: [ToolbarNavigationService],
    encapsulation: ViewEncapsulation.None,
})

export class ToolbarComponent implements AfterViewInit, OnDestroy {

    @ContentChildren(ToolbarGroupComponent)
    public groups: QueryList<ToolbarGroupComponent>;

    @ContentChildren(ToolbarItemComponent, {descendants: true})
    public items: QueryList<ToolbarItemComponent>;

    @Input()
    /**
     * selectionEnabled: boolean which allows to show selected section
     */
    @HostBinding("class.nui-toolbar--active")
    public selectionEnabled: boolean;
    /**
     * In selection mode allows to show current selected item and total of selected items
     */
    @Input() public selectedItems: IToolbarSelectionState;

    @Input()
    @HostBinding("class.nui-toolbar--shadowed")
    public boxShadow: boolean = true;

    @ViewChild("toolbarContainer") public toolbarContainer: ElementRef;
    @ViewChild("menu") public menu: MenuComponent;
    @ViewChildren("button") public buttons: QueryList<ButtonComponent>;

    public commandGroups: IToolbarGroupContent[] = [];
    public menuGroups: IToolbarGroupContent[] = [];
    public showMenu = true;
    public allItemsHidden = false;
    public commandsTitle = $localize `Commands`;
    public moreTitle = $localize `More`;

    private lastChildBorder: number;
    private toolbarItems: HTMLElement[] = [];
    private embeddedContainer: HTMLElement | undefined;
    private childrenSubscription: Subscription;
    private destructiveItems: any[];
    private destroy$: Subject<any> = new Subject<any>();

    @HostListener("keydown", ["$event"]) onKeyDown(event: KeyboardEvent): void {
        this.navigationService.onKeyDown(event);
    }

    constructor(public element: ElementRef,
                private navigationService: ToolbarNavigationService,
                private changeDetector: ChangeDetectorRef,
                private logger: LoggerService,
                private ngZone: NgZone) {}

    ngAfterViewInit(): void {
        this.splitToolbarItems();
        this.embeddedContainer = this.toolbarContainer.nativeElement.querySelector(".nui-toolbar-embedded");
        this.childrenSubscription = merge(this.groups.changes, this.items.changes).pipe(debounceTime(20)).subscribe(() => {
            // timeout is needed for updating actual querylist. without it splitToolbarItems won't get new element in groups' arrays
            setTimeout(() => {
                this.splitToolbarItems();
            }, 0);
        });
        this.ngZone.onStable.asObservable().pipe(take(1))
            .subscribe(() => {
                this.moveToolbarItems();
            });
        this.destructiveItems = [];
        this.groups.forEach((group: ToolbarGroupComponent) => {
            const isDestructiveItem = group.items.filter((item: ToolbarItemComponent) => item.displayStyle === ToolbarItemDisplayStyle.destructive);
            if (isDestructiveItem.length) {
                this.destructiveItems.push(isDestructiveItem);
                if (this.destructiveItems.length === 1 && this.destructiveIsLastItem || this.destructiveItems.length > 1) {
                    this.logger.error("Only one tool-bar-item with type destructive may be defined, and it must be the last item in last group");
                }
            }
        });

        this.buttons.changes
            .pipe(takeUntil(this.destroy$))
            .subscribe((buttons: QueryList<ButtonComponent>) => {
                this.toolbarItems = buttons.toArray().slice().map(b => b["el"].nativeElement as HTMLElement);
                if (this.menu) {
                    if (!buttons.length) {
                        // In case all buttons are hidden within the Commands menu we want this menu to receive the focus
                        this.menu.menuToggle.nativeElement.setAttribute("tabindex", "0");
                    } else {
                        // If at least one button is visible in the toolbar it should receive the focus fist upon navigating onto the toolbar
                        this.menu.menuToggle.nativeElement.setAttribute("tabindex", "-1");
                    }
                    this.toolbarItems.push(this.menu.menuToggle.nativeElement);
                }
                if (this.embeddedContainer) {
                    this.embeddedContainer.setAttribute("tabindex", "-1");
                    this.toolbarItems.push(this.embeddedContainer as HTMLElement);
                }
                this.navigationService.setToolbarItems(this.toolbarItems, this.embeddedContainer);
            });
    }

    ngOnDestroy(): void {
        this.childrenSubscription.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }

    public manageKeyDown(event: KeyboardEvent): void {
        const active = document.activeElement;
        const activeIndex: number = this.toolbarItems.indexOf(active as any);
        const menu = this.menu?.menuToggle?.nativeElement;
        const first = this.toolbarItems[0];
        const last = this.toolbarItems[this.toolbarItems.length - 1];

        if (menu) {
            this.menu.menuToggle.nativeElement.setAttribute("tabindex", "-1");
        }

        if (event.code === KEYBOARD_CODE.ARROW_LEFT) {
            active === first
                ? last.focus()
                : this.toolbarItems[activeIndex - 1].focus();
        }

        if (event.code === KEYBOARD_CODE.ARROW_RIGHT) {
            active === last
                ? first.focus()
                : this.toolbarItems[activeIndex + 1].focus();
        }

    }

    public moveToolbarItems() {
        this.makeAllItemsVisible();

        const containerBorder = Math.floor(this.toolbarContainer.nativeElement.getBoundingClientRect().right);
        this.lastChildBorder = Math.floor(this.toolbarContainer.nativeElement.lastElementChild.getBoundingClientRect().right);

        while (containerBorder < this.lastChildBorder && this.commandGroups.length > 0) {
            this.commandGroups.forEach((group: IToolbarGroupContent, ind: number, groups: IToolbarGroupContent[]) => {
                if (ind === groups.length - 1) {
                    group.items.forEach((item: ToolbarItemComponent, index: number, items: ToolbarItemComponent[]) => {
                        if (index === items.length - 1) {
                            item.menuHidden = true;
                        }
                    });
                }
            });
            this.splitToolbarItems();
            this.lastChildBorder = Math.floor(this.toolbarContainer.nativeElement.lastElementChild.getBoundingClientRect().right);
        }
    }

    public splitToolbarItems() {
        this.commandGroups = [];
        this.menuGroups = [];
        this.groups.forEach((group: ToolbarGroupComponent) => {
            const commandGroupItems = group.items.filter((item: ToolbarItemComponent) => item.menuHidden === false);
            const menuGroupItems = group.items.filter((item: ToolbarItemComponent) => item.menuHidden === true);

            if (commandGroupItems.length) {
                this.commandGroups.push({items: commandGroupItems});
            }
            if (menuGroupItems.length) {
                this.menuGroups.push({items: menuGroupItems, title: group.title});
            }
        });
        this.showMenu = this.menuGroups.length > 0;
        this.allItemsHidden = this.commandGroups.length === 0;
        this.changeDetector.detectChanges();
    }

    public makeAllItemsVisible() {
        this.groups.forEach((group: ToolbarGroupComponent) => {
            group.items.forEach((item: ToolbarItemComponent) => {
                if (item.type === ToolbarItemType.primary) {
                    item.menuHidden = false;
                }
            });
        });
        this.splitToolbarItems();
    }

    public handleSelectionState() {
        if (this.selectionEnabled) {
            if (!_isEmpty(this.selectedItems)) {
                const itemSelected = $localize `${this.selectedItems.current} of ${this.selectedItems.total} selected`;
                const allItemSelected = $localize `All ${this.selectedItems.total} selected`;
                return this.selectedItems.current === this.selectedItems.total ? allItemSelected : itemSelected;
            }
        }
    }

    public get menuTitle() {
        return this.allItemsHidden ? this.commandsTitle : this.moreTitle;
    }

    public get destructiveIsLastItem() {
        return this.groups.last.items.last.displayStyle !== ToolbarItemDisplayStyle.destructive;
    }
}
