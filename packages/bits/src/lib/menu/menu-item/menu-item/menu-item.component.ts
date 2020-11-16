import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    Optional,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";

import { MenuGroupComponent } from "../menu-group/menu-group.component";

import { MenuItemBaseComponent } from "./menu-item-base";

/**
 * @ignore
 */

/**
 * Represents default menu item if type of menu-item is not set.
 */
@Component({
    selector: "nui-menu-item",
    template: `
        <span class="nui-menu-item__default" (click)="handleClick($event)" #menuItemDefault tabIndex="-1">
            <ng-content></ng-content>
        </span>
    `,
    styleUrls: ["./menu-item.less"],
    providers: [
        {
            provide: MenuItemBaseComponent,
            useExisting: forwardRef(() => MenuItemComponent),
        },
    ],
    encapsulation: ViewEncapsulation.None,
})
export class MenuItemComponent extends MenuItemBaseComponent {
    @ViewChild("menuItemDefault") menuItem: ElementRef;

    constructor(@Optional() readonly group: MenuGroupComponent, cd: ChangeDetectorRef) {
        super(group, cd);

        this.disabled = false;
    }

    public handleClick(event: MouseEvent): void {
        event.preventDefault();
        if (this.disabled) {
            event.stopPropagation();
        }
        this.actionDone.emit();
    }

    public doAction(event: any): void {
        this.handleClick(event);
    }
}
