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
    NuiMessageModule,
    NuiSwitchModule,
    NuiTextboxModule,
} from "@nova-ui/bits";
import {
    NuiDashboardConfiguratorModule,
    NuiDashboardsModule,
} from "@nova-ui/dashboards";

import { CustomConfiguratorSectionDocsComponent } from "./custom-configurator-section-docs.component";
import {
    CustomConfiguratorSectionExampleComponent,
    CustomKpiDescriptionConfigurationComponent,
} from "./custom-configurator-section.example.component";

const routes = [
    {
        path: "",
        component: CustomConfiguratorSectionDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: CustomConfiguratorSectionExampleComponent,
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
        NuiMessageModule,
        NuiSwitchModule,
        NuiTextboxModule,
        NuiButtonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        CustomConfiguratorSectionDocsComponent,
        CustomKpiDescriptionConfigurationComponent,
        CustomConfiguratorSectionExampleComponent,
    ],
})
export default class CustomConfiguratorSectionModule {}
