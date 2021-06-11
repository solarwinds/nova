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
    ViewEncapsulation,
} from "@angular/core";
import _isEmpty from "lodash/isEmpty";
import { merge, Subscription } from "rxjs";
import { debounceTime, take } from "rxjs/operators";

import { LoggerService } from "../../services/log-service";

import {
    IToolbarGroupContent,
    IToolbarSelectionState,
    ToolbarItemDisplayStyle,
    ToolbarItemType,
} from "./public-api";
import { ToolbarGroupComponent } from "./toolbar-group.component";
import { ToolbarItemComponent } from "./toolbar-item.component";
import { KEYBOARD_CODE } from "../../constants";
import { MenuComponent } from "../menu";

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
    encapsulation: ViewEncapsulation.None,
})

export class ToolbarComponent implements AfterViewInit, OnDestroy {

    @ContentChildren(ToolbarGroupComponent)
    public groups: QueryList<ToolbarGroupComponent>;

    @ContentChildren(ToolbarItemComponent, {descendants: true})
    public items: QueryList<ToolbarItemComponent>;

    @ViewChild("menuComponent") menuComponent: MenuComponent;

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
    public commandGroups: IToolbarGroupContent[] = [];
    public menuGroups: IToolbarGroupContent[] = [];
    public showMenu = true;
    public allItemsHidden = false;
    public commandsTitle = $localize `Commands`;
    public moreTitle = $localize `More`;

    private lastChildBorder: number;
    private childrenSubscription: Subscription;
    private destructiveItems: any[];
    private isFocusFromOutside = true;

    constructor(public element: ElementRef,
                private changeDetector: ChangeDetectorRef,
                private logger: LoggerService,
                private ngZone: NgZone) {}

    @HostListener("keydown", ["$event"])
    onKeyDown(event: KeyboardEvent): void {
        const { code } = event;

        if (code === KEYBOARD_CODE.ARROW_LEFT || code === KEYBOARD_CODE.ARROW_RIGHT) {
            this.isFocusFromOutside = false;
            event.preventDefault();
            this.navigateByArrow(code);
        }
    }

    ngAfterViewInit() {
        this.splitToolbarItems();
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
        this.disableFocusForMoreBtn();
    }

    ngOnDestroy() {
        this.childrenSubscription.unsubscribe();
    }

    public onClickToolbarBtn(event: MouseEvent, commandItem: any): void {
        event.stopPropagation();
        (event.target as HTMLButtonElement).focus();
        commandItem.actionDone.emit();
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

    private navigateByArrow(code: string): void {
        const buttons = this.getButtons();
        const length = buttons.length;

        if (!length) {
            return;
        }

        const moreButton = this.menuActivatorBtn;
        const direction = code === KEYBOARD_CODE.ARROW_RIGHT ? 1 : -1;
        let nextIndex = buttons.findIndex((button) => button === document.activeElement) + direction;

        if (document.activeElement === moreButton && moreButton) {
            this.navigateFormMoreBtn(moreButton, buttons as HTMLButtonElement[], direction);

            return;
        }

        if ((nextIndex >= length || nextIndex < 0) && moreButton) {
            moreButton.focus();

            return;
        }

        if (nextIndex < 0 && !moreButton) {
            nextIndex = length - 1;
        }

        if (nextIndex >= length && !moreButton) {
            nextIndex = 0;
        }

        const button: HTMLButtonElement = buttons[nextIndex];

        button.focus();
    }

    private navigateFormMoreBtn(button: HTMLButtonElement, buttons: HTMLButtonElement[], dir: number): void {
        if (this.menuComponent && this.menuComponent.popup) {
            this.menuComponent.popup.isOpen = false;
        }

        if (button && dir === 1) {
            buttons[0].focus();

            return;
        }

        buttons[buttons.length - 1].focus();
    }

    private getButtons(): HTMLButtonElement[] {
        const node = this.dynamicContainer;

        if (!node) {
            return [];
        }

        return Array.from(node.childNodes).filter((node) => (node as any).tagName === "BUTTON") as HTMLButtonElement[];
    }

    private get dynamicContainer(): HTMLElement {
        return this.toolbarContainer.nativeElement.querySelector(".nui-toolbar-content__dynamic");
    }

    private get menuActivatorBtn(): HTMLButtonElement | null {
        return this.dynamicContainer.querySelector(".nui-button.btn.menu-button");
    }

    private disableFocusForMoreBtn(): void {
        if (this.menuActivatorBtn) {
            this.menuActivatorBtn.setAttribute("tabindex", "-1");
        }
    }
}
