import { Highlightable } from "@angular/cdk/a11y";
import {
    ChangeDetectorRef,
    Directive,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnChanges,
    Optional,
    Output,
    SimpleChanges,
} from "@angular/core";

import { MenuGroupComponent } from "../menu-group/menu-group.component";

/**
 * @ignore
 */

/**
 * Base class for menu items. Adds styles to host element
 */
@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class MenuItemBaseComponent implements OnChanges, Highlightable {
    /**
     * Disables action, link and option components
     */
    @Input() public disabled?: boolean;

    @HostBinding("class.nui-menu-item") public setDefaultClass = true;

    @HostBinding("class.nui-menu-item--disabled") public setDisabledClass: boolean;

    @HostBinding("class.nui-menu-item--active") get active(): boolean {
        return this.isActive;
    }

    @Output() public actionDone = new EventEmitter<boolean|undefined>();

    public isActive: boolean;

    abstract menuItem: ElementRef;

    constructor(@Optional() readonly group: MenuGroupComponent, private cd: ChangeDetectorRef) {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        const disabled = changes["disabled"] && changes["disabled"].currentValue || false;

        this.setDisabledClass = disabled;
    }

    public setActive(val: boolean): void {
        this.isActive = val;
    }

    public setActiveStyles(): void {
        this.cd.markForCheck();
        this.isActive = true;
    }

    public setInactiveStyles(): void {
        this.cd.markForCheck();
        this.isActive = false;
    }

    abstract doAction(event?: any): void;
}
