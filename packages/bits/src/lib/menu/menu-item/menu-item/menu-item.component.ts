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
    Optional,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";

import { MenuItemBaseComponent } from "./menu-item-base";
import { MenuGroupComponent } from "../menu-group/menu-group.component";

/**
 * @ignore
 */

/**
 * Represents default menu item if type of menu-item is not set.
 */
@Component({
    selector: "nui-menu-item",
    template: `
        <span
            class="nui-menu-item__default"
            (click)="handleClick($event)"
            #menuItemDefault
        >
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
    host: {
        role: "menuitem",
        tabindex: "-1",
    },
    standalone: false,
})
export class MenuItemComponent extends MenuItemBaseComponent {
    @ViewChild("menuItemDefault") menuItem: ElementRef;

    public propagateClose = true;

    constructor(
        @Optional() readonly group: MenuGroupComponent,
        cd: ChangeDetectorRef,
        private el: ElementRef
    ) {
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
        const clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        // We use a global listener to detect if propagation was stopped by a user's handler
        let propagated = false;
        const listener = () => { propagated = true; };

        // Listen on window to catch bubbling
        window.addEventListener("click", listener);

        // Try to find the inner interactive element to click
        const targetElement = this.menuItem.nativeElement.querySelector("a, button") || this.menuItem.nativeElement;
        targetElement.dispatchEvent(clickEvent);

        window.removeEventListener("click", listener);

        // If propagation did NOT reach window, it means it was stopped (likely by user wanting to keep menu open)
        this.propagateClose = propagated;
    }
}
