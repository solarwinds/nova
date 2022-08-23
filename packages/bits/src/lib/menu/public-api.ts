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
