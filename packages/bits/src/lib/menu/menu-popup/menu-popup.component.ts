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
  Component,
  HostBinding,
  Input,
  QueryList,
  ViewChildren,
  ViewEncapsulation,
  output
} from "@angular/core";
import _isFunction from "lodash/isFunction";
import moment from "moment/moment";

import { MenuItemBaseComponent } from "../menu-item/menu-item/menu-item-base";
import { IMenuGroup, IMenuItem } from "../public-api";

/**
 * @ignore
 */

/**
 * Examples: <example-url>./../../../demo/index.html#/menu</example-url><br />
 * "nui-menu" provides simple dropdown menu option with custom items:
 * "nui-header", "nui-divider", "nui-action", "nui-link", "nui-option"
 */
@Component({
    selector: "nui-menu-popup",
    host: {
        class: "nui-menu-popup",
        role: "menu",
    },
    templateUrl: "./menu-popup.component.html",
    styleUrls: ["./menu-popup.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
})
export class MenuPopupComponent {
    @Input() public itemsSource: IMenuGroup[];
    @Input() public size?: string;
    @ViewChildren(MenuItemBaseComponent)
    menuItems: QueryList<MenuItemBaseComponent>;

    @HostBinding("class.nui-menu-popup--sm")
    public get smCssClass(): boolean {
        return this.size === "small";
    }

    @HostBinding("class.nui-menu-popup--lg")
    public get lgCssClass(): boolean {
        return this.size === "large";
    }

    public readonly menuItemClicked = output<IMenuItem>();

    public handleClick(item: IMenuItem): void {
        if (!item.disabled) {
            this.menuItemClicked?.emit(item);
            if (_isFunction(item.action)) {
                item.action();
            }
        }
    }

    public getDisplayValue(item: IMenuItem): string {
        return item.displayFormat
            ? moment(item.title).format(item.displayFormat)
            : item.title;
    }

    public stopClickPropagation(event: MouseEvent): void {
        event.stopImmediatePropagation();
    }
}
