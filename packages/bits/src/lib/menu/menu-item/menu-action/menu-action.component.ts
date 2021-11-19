import {
    ChangeDetectorRef, Component, ElementRef, forwardRef, Input, Optional, ViewChild, ViewEncapsulation,
} from "@angular/core";

import { MenuActionType } from "../../public-api";
import { MenuGroupComponent } from "../menu-group/menu-group.component";
import { MenuItemBaseComponent } from "../menu-item/menu-item-base";

/**
 * @ignore
 */

/**
 * Menu item component which is needed to perform action on click event
 */
@Component({
    selector: "nui-menu-action",
    template: `
        <a class="nui-menu-item__action nui-menu-item__link" href="#"
           role="button" (click)="handleClick($event)" [ngClass]="'nui-menu-item__action-' + type" #menuAction tabindex="-1">
            <nui-icon *ngIf="icon" [icon]="icon" [iconColor]="getIconColor()"></nui-icon>
            <ng-content></ng-content>
        </a>
    `,
    providers: [
        {
            provide: MenuItemBaseComponent,
            useExisting: forwardRef(() => MenuActionComponent),
        },
    ],
    styleUrls: ["./menu-action.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: { "role": "menuitem" },
})
export class MenuActionComponent extends MenuItemBaseComponent {
    /**
     * Adds icon by specified icon name
     */
    @Input() public icon: string;

    @Input() public type: MenuActionType;

    @ViewChild("menuAction") menuItem: ElementRef;

    constructor(@Optional() readonly group: MenuGroupComponent, cd: ChangeDetectorRef) {
        super(group, cd);

        this.disabled = false;
    }

    public handleClick(event: MouseEvent): void {
        event.preventDefault();
        if (this.disabled) {
            event.stopPropagation();
        } else {
            this.actionDone.emit();
        }
    }

    public getIconColor(): string {
        return this.type === "destructive" ? "red" : "";
    }
    public doAction(event: any): void {
        this.handleClick(event);
    }
}
