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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import {
    NuiButtonModule,
    NuiContentModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiFormFieldModule,
    NuiIconModule,
    NuiMessageModule,
    NuiSwitchModule,
    NuiTabsModule,
    NuiTextboxModule,
    NuiValidationMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    TabContentAboutExampleComponent,
    TabContentSettingsExampleComponent,
    TabContentStatisticsExampleComponent,
    TabgroupDocsExampleComponent,
    TabHeadingGroupDynamicExampleComponent,
    TabHeadingGroupHorizontalExampleComponent,
    TabHeadingGroupHorizontalWithIconsExampleComponent,
    TabHeadingGroupHorizontalWithIconsOnlyExampleComponent,
    TabHeadingGroupResponsiveExampleComponent,
    TabHeadingGroupTestComponent,
    TabHeadingGroupVerticalExampleComponent,
    TabHeadingGroupVerticalWithIconsExampleComponent,
    TabHeadingGroupWithContentExampleComponent,
    TabHeadingGroupWithIconsExampleComponent,
    TabHeadingGroupWithRouterExampleComponent,
} from "./index";

const routes: Routes = [
    {
        path: "",
        component: TabgroupDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
        children: [
            {
                path: "",
                redirectTo: "tab-settings",
                pathMatch: "full",
                data: {
                    srlc: {
                        stage: SrlcStage.ga,
                    },
                },
            },
            {
                path: "tab-settings",
                component: TabContentSettingsExampleComponent,
                data: {
                    srlc: {
                        stage: SrlcStage.ga,
                    },
                    showThemeSwitcher: true,
                },
            },
            {
                path: "tab-statistics",
                component: TabContentStatisticsExampleComponent,
                data: {
                    srlc: {
                        stage: SrlcStage.ga,
                    },
                    showThemeSwitcher: true,
                },
            },
            {
                path: "tab-about",
                component: TabContentAboutExampleComponent,
                data: {
                    srlc: {
                        stage: SrlcStage.ga,
                    },
                    showThemeSwitcher: true,
                },
            },
        ],
    },
    {
        path: "tabgroup-test",
        component: TabHeadingGroupTestComponent,
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
        NuiTabsModule,
        NuiSwitchModule,
        NuiContentModule,
        NuiValidationMessageModule,
        NuiTextboxModule,
        NuiFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NuiMessageModule,
        NuiExpanderModule,
        NuiDocsModule,
        NuiIconModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TabgroupDocsExampleComponent,
        TabContentAboutExampleComponent,
        TabContentSettingsExampleComponent,
        TabContentStatisticsExampleComponent,
        TabHeadingGroupTestComponent,
        TabHeadingGroupDynamicExampleComponent,
        TabHeadingGroupWithIconsExampleComponent,
        TabHeadingGroupHorizontalExampleComponent,
        TabHeadingGroupHorizontalWithIconsExampleComponent,
        TabHeadingGroupWithContentExampleComponent,
        TabHeadingGroupWithRouterExampleComponent,
        TabHeadingGroupVerticalExampleComponent,
        TabHeadingGroupVerticalWithIconsExampleComponent,
        TabHeadingGroupHorizontalWithIconsOnlyExampleComponent,
        TabHeadingGroupResponsiveExampleComponent,
    ],
    exports: [RouterModule],
})
export default class TabgroupModule {}
