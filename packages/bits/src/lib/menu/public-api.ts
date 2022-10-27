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

import { ElementRef, QueryList } from "@angular/core";

import { MenuGroupComponent } from "./menu-item/menu-group/menu-group.component";
import { MenuItemBaseComponent } from "./menu-item/menu-item/menu-item-base";

export enum MenuActionType {
    destructive = "destructive",
    default = "default",
}

export interface IMenuItem {
    // input json data used this interface
    checked?: boolean;
    disabled?: boolean;
    title: any;
    value?: any; // used for selector value, allowing its title to be i18n
    itemType?: string;
    url?: string;
    action?: Function;
    itemClass?: MenuActionType;
    isSelected?: boolean;
    icon?: string;
    displayFormat?: string;
}

export interface IMenuGroup {
    itemsSource: IMenuItem[];
    header?: string;
}

export interface IPopupActiveOptions {
    scrollContainer: ElementRef;
    menuItemHeight: number;
    activeOptionIndex: number;
    menuItems: QueryList<MenuItemBaseComponent>;
    menuGroups: QueryList<MenuGroupComponent>;
}
