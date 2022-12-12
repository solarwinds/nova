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
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

// eslint-disable-next-line max-len
import {
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiMessageModule,
    NuiSelectV2Module,
    NuiSwitchModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
} from "@nova-ui/bits";
import { NuiDashboardsModule } from "@nova-ui/dashboards";

import { CustomDonutContentFormatterDocComponent } from "./donut-content-formatter-example/custom-donut-content-formatter-docs.component";
import {
    CustomDonutContentFormatterComponent,
    CustomDonutContentFormatterConfiguratorComponent,
    CustomDonutContentFormatterExampleComponent,
} from "./donut-content-formatter-example/custom-donut-content-formatter-example.component";
import { CustomFormatterDocComponent } from "./formatter-example/custom-formatter-docs.component";
import {
    CustomFormatterComponent,
    CustomFormatterConfiguratorComponent,
    CustomFormatterExampleComponent,
} from "./formatter-example/custom-formatter-example.component";

const routes: Routes = [
    {
        path: "table-formatter",
        component: CustomFormatterDocComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "donut-content-formatter",
        component: CustomDonutContentFormatterDocComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        NuiDocsModule,
        NuiButtonModule,
        NuiMessageModule,
        NuiDashboardsModule,
        NuiFormFieldModule,
        NuiTextboxModule,
        NuiSwitchModule,
        NuiSelectV2Module,
        NuiValidationMessageModule,
        NuiIconModule,
        ReactiveFormsModule,
    ],
    declarations: [
        CustomDonutContentFormatterComponent,
        CustomDonutContentFormatterExampleComponent,
        CustomDonutContentFormatterConfiguratorComponent,
        CustomDonutContentFormatterDocComponent,
        CustomFormatterDocComponent,
        CustomFormatterExampleComponent,
        CustomFormatterConfiguratorComponent,
        CustomFormatterComponent,
    ],
})
export default class CustomFormatterModuleRoute {}
