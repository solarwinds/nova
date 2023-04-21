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

import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiImageModule,
    NuiMessageModule,
    NuiSelectV2Module,
    NuiSwitchModule,
} from "@nova-ui/bits";
import {
    NuiDashboardConfiguratorModule,
    NuiDashboardsModule,
} from "@nova-ui/dashboards";

import { CustomWidgetDocsComponent } from "./custom-widget-docs.component";
import {
    CustomConfiguratorSectionComponent,
    CustomWidgetBodyContentComponent,
    CustomWidgetComponent,
} from "./custom-widget.component";

const routes = [
    {
        path: "",
        component: CustomWidgetDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: CustomWidgetComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        NuiDashboardsModule,
        NuiDashboardConfiguratorModule,
        NuiDocsModule,
        NuiFormFieldModule,
        NuiIconModule,
        NuiImageModule,
        NuiMessageModule,
        NuiSelectV2Module,
        NuiSwitchModule,
        NuiButtonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        CustomWidgetDocsComponent,
        CustomConfiguratorSectionComponent,
        CustomWidgetBodyContentComponent,
        CustomWidgetComponent,
    ],
})
export default class CustomWidgetModule {}
