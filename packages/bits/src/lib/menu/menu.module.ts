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

import { NgModule } from "@angular/core";

import { MenuComponent } from "./menu/menu.component";
import { MenuActionComponent } from "./menu-item/menu-action/menu-action.component";
import { MenuGroupComponent } from "./menu-item/menu-group/menu-group.component";
import { MenuItemComponent } from "./menu-item/menu-item/menu-item.component";
import { MenuLinkComponent } from "./menu-item/menu-link/menu-link.component";
import { MenuOptionComponent } from "./menu-item/menu-option/menu-option.component";
import { MenuSwitchComponent } from "./menu-item/menu-switch/menu-switch.component";
import { MenuPopupComponent } from "./menu-popup/menu-popup.component";
import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiCheckboxModule } from "../checkbox/checkbox.module";
import { NuiDividerModule } from "../divider/divider.module";
import { NuiIconModule } from "../icon/icon.module";
import { NuiPopupModule } from "../popup/popup.module";
import { NuiSwitchModule } from "../switch/switch.module";

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
export class NuiMenuModule {}
