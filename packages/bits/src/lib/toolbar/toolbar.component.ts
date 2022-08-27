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
import { ToolbarKeyboardService } from "./toolbar-keyboard.service";

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
        class: "nui-toolbar nui-strip-layout nui-flex-container",
        role: "toolbar",
    },
    styleUrls: ["./toolbar.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarKeyboardService],
})
export class ToolbarComponent implements AfterViewInit, OnDestroy {
    @ContentChildren(ToolbarGroupComponent)
    public groups: QueryList<ToolbarGroupComponent>;

    @ContentChildren(ToolbarItemComponent, { descendants: true })
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

    @ViewChild("toolbarContainer")
    public toolbarContainer: ElementRef;

    @ViewChild("menuComponent") public menu: MenuComponent;

    @ViewChildren("toolbarButtons")
    public toolbarButtons: QueryList<ButtonComponent>;

    public commandGroups: IToolbarGroupContent[] = [];
    public menuGroups: IToolbarGroupContent[] = [];
    public showMenu = true;
    public allItemsHidden = false;
    public commandsTitle = $localize`Commands`;
    public moreTitle = $localize`More`;

    private lastChildBorder: number;
    private toolbarItems: HTMLElement[] = [];
    private childrenSubscription: Subscription;
    private destructiveItems: any[];
    private destroy$: Subject<void> = new Subject<void>();

    constructor(
        public element: ElementRef,
        private changeDetector: ChangeDetectorRef,
        private logger: LoggerService,
        private ngZone: NgZone,
        private keyboardService: ToolbarKeyboardService
    ) {}

    @HostListener("keydown", ["$event"])
    onKeyDown(event: KeyboardEvent): void {
        this.keyboardService.onKeyDown(event);
    }

    public ngAfterViewInit(): void {
        this.splitToolbarItems();
        this.childrenSubscription = merge(
            this.groups.changes,
            this.items.changes
        )
            .pipe(debounceTime(20))
            .subscribe(() => {
                // timeout is needed for updating actual querylist. without it splitToolbarItems won't get new element in groups' arrays
                setTimeout(() => {
                    this.splitToolbarItems();
                }, 0);
            });
        this.ngZone.onStable
            .asObservable()
            .pipe(take(1))
            .subscribe(() => {
                this.moveToolbarItems();
            });
        this.destructiveItems = [];
        this.groups.forEach((group: ToolbarGroupComponent) => {
            const isDestructiveItem = group.items.filter(
                (item: ToolbarItemComponent) =>
                    item.displayStyle === ToolbarItemDisplayStyle.destructive
            );
            if (isDestructiveItem.length) {
                this.destructiveItems.push(isDestructiveItem);
                if (
                    (this.destructiveItems.length === 1 &&
                        this.destructiveIsLastItem) ||
                    this.destructiveItems.length > 1
                ) {
                    this.logger.error(
                        "Only one tool-bar-item with type destructive may be defined, and it must be the last item in last group"
                    );
                }
            }
        });
        this.subscribeToToolbarStepsChanges();
    }

    public ngOnDestroy(): void {
        this.childrenSubscription.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onClickToolbarBtn(
        event: MouseEvent,
        commandItem: ToolbarItemComponent
    ): void {
        event.stopPropagation();
        (event.target as HTMLButtonElement).focus();
        commandItem.actionDone.emit();
    }

    public moveToolbarItems(): void {
        this.makeAllItemsVisible();

        const containerBorder = Math.floor(
            this.toolbarContainer.nativeElement.getBoundingClientRect().right
        );
        this.lastChildBorder = Math.floor(
            this.toolbarContainer.nativeElement.lastElementChild.getBoundingClientRect()
                .right
        );

        while (
            containerBorder < this.lastChildBorder &&
            this.commandGroups.length > 0
        ) {
            this.commandGroups.forEach(
                (
                    group: IToolbarGroupContent,
                    index: number,
                    groups: IToolbarGroupContent[]
                ) => {
                    if (index === groups.length - 1) {
                        group.items.forEach(
                            (
                                item: ToolbarItemComponent,
                                index: number,
                                items: ToolbarItemComponent[]
                            ) => {
                                if (index === items.length - 1) {
                                    item.menuHidden = true;
                                }
                            }
                        );
                    }
                }
            );
            this.splitToolbarItems();
            this.lastChildBorder = Math.floor(
                this.toolbarContainer.nativeElement.lastElementChild.getBoundingClientRect()
                    .right
            );
        }
    }

    public splitToolbarItems(): void {
        this.commandGroups = [];
        this.menuGroups = [];
        this.groups.forEach((group: ToolbarGroupComponent) => {
            const commandGroupItems = group.items.filter(
                (item) => !item.menuHidden
            );
            const menuGroupItems = group.items.filter(
                (item) => !!item.menuHidden
            );

            if (commandGroupItems.length) {
                this.commandGroups.push({ items: commandGroupItems });
            }
            if (menuGroupItems.length) {
                this.menuGroups.push({
                    items: menuGroupItems,
                    title: group.title,
                });
            }
        });
        this.showMenu = this.menuGroups.length > 0;
        this.allItemsHidden = this.commandGroups.length === 0;
        this.changeDetector.detectChanges();
    }

    public makeAllItemsVisible(): void {
        this.groups.forEach((group: ToolbarGroupComponent) => {
            group.items.forEach((item: ToolbarItemComponent) => {
                if (item.type === ToolbarItemType.primary) {
                    item.menuHidden = false;
                }
            });
        });
        this.splitToolbarItems();
    }

    public handleSelectionState(): string {
        if (this.selectionEnabled) {
            if (!_isEmpty(this.selectedItems)) {
                const itemSelected = $localize`${this.selectedItems.current} of ${this.selectedItems.total} selected`;
                const allItemSelected = $localize`All ${this.selectedItems.total} selected`;
                return this.selectedItems.current === this.selectedItems.total
                    ? allItemSelected
                    : itemSelected;
            }
        }
        if (_isEmpty(this.selectedItems)) {
            return "";
        }
        return this.selectedItems.current === this.selectedItems.total
            ? $localize`All ${this.selectedItems.total} selected`
            : $localize`${this.selectedItems.current} of ${this.selectedItems.total} selected`;
    }

    public get menuTitle(): string {
        return this.allItemsHidden ? this.commandsTitle : this.moreTitle;
    }

    public get destructiveIsLastItem(): boolean {
        return (
            this.groups.last.items.last.displayStyle !==
            ToolbarItemDisplayStyle.destructive
        );
    }

    private subscribeToToolbarStepsChanges(): void {
        this.toolbarButtons.changes
            .pipe(takeUntil(this.destroy$))
            .subscribe((buttons: QueryList<ButtonComponent>) => {
                this.toolbarItems = buttons
                    .toArray()
                    .slice()
                    .map((b) => b["el"].nativeElement as HTMLElement)
                    .filter((el) => !!el);

                if (this.menu) {
                    // In case all buttons are hidden within the Commands menu we want this menu to receive the focus
                    // If at least one button is visible in the toolbar it should receive the focus first upon navigating onto the toolbar
                    const tabIndex = buttons.length ? "-1" : "0";

                    this.menu.menuToggle.nativeElement.setAttribute(
                        "tabindex",
                        tabIndex
                    );
                    this.toolbarItems.push(this.menu.menuToggle.nativeElement);
                }

                this.keyboardService.setToolbarItems(
                    this.toolbarItems,
                    this.menu
                );
            });
    }
}
