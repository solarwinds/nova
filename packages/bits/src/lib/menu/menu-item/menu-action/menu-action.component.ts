// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    Input,
    Optional,
    ViewChild,
    ViewEncapsulation,
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
        <a
            class="nui-menu-item__action nui-menu-item__link"
            href="#"
            role="button"
            (click)="handleClick($event)"
            [ngClass]="'nui-menu-item__action-' + type"
            #menuAction
            tabindex="-1"
            title
        >
            <nui-icon
                *ngIf="icon"
                [icon]="icon"
                [iconColor]="getIconColor()"
            ></nui-icon>
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
    host: { role: "menuitem" },
    standalone: false,
})
export class MenuActionComponent extends MenuItemBaseComponent {
    /**
     * Adds icon by specified icon name
     */
    @Input() public icon: string;

    @Input() public type: MenuActionType;

    @ViewChild("menuAction") menuItem: ElementRef;

    constructor(
        @Optional() readonly group: MenuGroupComponent,
        cd: ChangeDetectorRef
    ) {
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
