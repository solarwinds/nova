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
    NuiMessageModule,
    NuiRadioModule,
    NuiSwitchModule,
    NuiTooltipModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    TooltipBasicExampleComponent,
    TooltipDisabledExampleComponent,
    TooltipDocsExampleComponent,
    TooltipPositionExampleComponent,
    TooltipTriggerExampleComponent,
    TooltipVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: TooltipDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "tooltip-basic",
        component: TooltipBasicExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "tooltip-disabled",
        component: TooltipDisabledExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "tooltip-position",
        component: TooltipPositionExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "tooltip-trigger",
        component: TooltipTriggerExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
        },
    },
    {
        path: "tooltip-visual-test",
        component: TooltipVisualTestComponent,
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
        NuiTooltipModule,
        NuiSwitchModule,
        NuiRadioModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TooltipBasicExampleComponent,
        TooltipDocsExampleComponent,
        TooltipDisabledExampleComponent,
        TooltipPositionExampleComponent,
        TooltipTriggerExampleComponent,
        TooltipVisualTestComponent,
    ],
    exports: [RouterModule],
})
export default class TooltipDemoModule {}
