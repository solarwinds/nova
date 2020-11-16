import {
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    QueryList,
    ViewChildren,
    ViewEncapsulation
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
        "class": "nui-menu-popup",
    },
    templateUrl: "./menu-popup.component.html",
    styleUrls: ["./menu-popup.component.less"],
    encapsulation: ViewEncapsulation.None,
})

export class MenuPopupComponent {
    @Input() public itemsSource: IMenuGroup[];
    @Input() public size?: string;
    @ViewChildren(MenuItemBaseComponent) menuItems: QueryList<MenuItemBaseComponent>;

    @HostBinding("class.nui-menu-popup--sm")
    public get smCssClass() {
        return this.size === "small";
    }

    @HostBinding("class.nui-menu-popup--lg")
    public get lgCssClass() {
        return this.size === "large";
    }

    @Output() public menuItemClicked ? = new EventEmitter<IMenuItem>();

    public handleClick(item: IMenuItem) {
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

    public stopClickPropagation(event: MouseEvent) {
        event.stopImmediatePropagation();
    }
}
