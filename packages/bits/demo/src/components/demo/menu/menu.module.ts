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
import { RouterModule } from "@angular/router";

import {
    NuiButtonModule,
    NuiDocsModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiSwitchModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    BasicMenuExampleComponent,
    MenuAppendToBodyExampleComponent,
    MenuCustomItemExampleComponent,
    MenuExampleComponent,
    MenuItemVariationsExampleComponent,
    MenuTestComponent,
    MenuVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: MenuExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: BasicMenuExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "menu-visual-test",
        component: MenuVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "menu-test",
        component: MenuTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiMenuModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiSwitchModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        BasicMenuExampleComponent,
        MenuExampleComponent,
        MenuAppendToBodyExampleComponent,
        MenuItemVariationsExampleComponent,
        MenuCustomItemExampleComponent,
        MenuTestComponent,
        MenuVisualTestComponent,
    ],
    exports: [RouterModule],
})
export default class MenuModule {}
