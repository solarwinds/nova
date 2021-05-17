import { NgModule } from "@angular/core";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiCheckboxModule } from "../checkbox/checkbox.module";
import { NuiDividerModule } from "../divider/divider.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiPopupModule } from "../popup/popup.module";
import { NuiSwitchModule } from "../switch/switch.module";

import { MenuActionComponent } from "./menu-item/menu-action/menu-action.component";
import { MenuGroupComponent } from "./menu-item/menu-group/menu-group.component";
import { MenuItemComponent} from "./menu-item/menu-item/menu-item.component";
import { MenuLinkComponent } from "./menu-item/menu-link/menu-link.component";
import { MenuOptionComponent } from "./menu-item/menu-option/menu-option.component";
import { MenuSwitchComponent } from "./menu-item/menu-switch/menu-switch.component";
import { MenuPopupComponent } from "./menu-popup/menu-popup.component";
import { MenuComponent } from "./menu/menu.component";

/**
 * @ignore
 */
@NgModule({
    imports: [
        NuiCommonModule,
        NuiButtonModule,
        NuiCheckboxModule,
        NuiIconModule,
        NuiPopupModule,
        NuiDividerModule,
        NuiSwitchModule,
    ],
    exports: [
        MenuActionComponent,
        MenuComponent,
        MenuGroupComponent,
        MenuItemComponent,
        MenuLinkComponent,
        MenuOptionComponent,
        MenuPopupComponent,
        MenuSwitchComponent,
    ],
    declarations: [
        MenuActionComponent,
        MenuComponent,
        MenuGroupComponent,
        MenuItemComponent,
        MenuLinkComponent,
        MenuOptionComponent,
        MenuPopupComponent,
        MenuSwitchComponent,
    ],
})
export class NuiMenuModule { }
