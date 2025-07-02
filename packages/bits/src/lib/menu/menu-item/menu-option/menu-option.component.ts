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

import { ChangeDetectorRef, Component, ElementRef, forwardRef, HostBinding, HostListener, Input, ViewChild, ViewEncapsulation, inject } from "@angular/core";

import { MenuGroupComponent } from "../menu-group/menu-group.component";
import { MenuItemBaseComponent } from "../menu-item/menu-item-base";

/**
 * @ignore
 */

/**
 * Menu item component with check/uncheck option,
 * use (change) event to get state of this item
 */
@Component({
    selector: "nui-menu-option",
    template: `
        <div class="nui-menu-item__option" #menuOption tabindex="-1" title>
            <nui-checkbox
                class="nui-menu-item__checkbox"
                [name]="name"
                [value]="value"
                [checked]="checked"
                [disabled]="disabled"
            >
                <ng-content></ng-content>
            </nui-checkbox>
        </div>
    `,
    styleUrls: ["./menu-option.component.less"],
    providers: [
        {
            provide: MenuItemBaseComponent,
            useExisting: forwardRef(() => MenuOptionComponent),
        },
    ],
    encapsulation: ViewEncapsulation.None,
    host: { role: "menuitemcheckbox" },
    standalone: false,
})
export class MenuOptionComponent extends MenuItemBaseComponent {
    readonly group: MenuGroupComponent;

    /**
     * Sets inner input "name" attribute
     */
    @Input() public name: string;
    /**
     * Sets inner input "value" attribute
     */
    @Input() public value: string;
    /**
     * Is needed to predefine item state, sets nui-checkbox [checked] property
     */
    @Input() public checked: boolean;

    @ViewChild("menuOption") menuItem: ElementRef;

    @HostListener("click", ["$event"])
    public stopPropagationOfClick(event: MouseEvent): void {
        event.stopPropagation();
        if (!this.disabled) {
            event.preventDefault();
            this.checked = !this.checked;
            this.actionDone.emit(this.checked);
        }
    }

    @HostBinding("class.checked")
    public get checkedClass(): boolean {
        return this.checked;
    }

    constructor() {
        const group = inject(MenuGroupComponent, { optional: true })!;
        const cd = inject(ChangeDetectorRef);

        super(group, cd);
        this.group = group;


        this.name = "";
        this.value = "";
        this.checked = false;

        // Is needed to predefine item state, sets nui-checkbox [disabled] property
        this.disabled = false;
    }

    public doAction(): void {
        this.checked = !this.checked;
        this.actionDone.emit(this.checked);
    }
}
