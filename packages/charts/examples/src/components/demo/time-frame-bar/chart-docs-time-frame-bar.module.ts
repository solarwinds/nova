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
import { RouterModule, Routes } from "@angular/router";

import {
    NuiBusyModule,
    NuiButtonModule,
    NuiCommonModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiIconModule,
    NuiLayoutModule,
    NuiPopoverModule,
    NuiTimeFrameBarModule,
    NuiTimeFramePickerModule,
    NuiTooltipModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../common/demo-common.module";
import { ChartDocsTimeFrameBarComponent } from "./chart-docs-time-frame-bar.component";
import { TimeFrameBarBasicExampleComponent } from "./time-frame-bar-basic/time-frame-bar-basic.example.component";
import { TimeFrameBarTestComponent } from "./time-frame-bar-test/time-frame-bar-test.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsTimeFrameBarComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "example",
        component: TimeFrameBarBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "test",
        component: TimeFrameBarTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        ChartDocsTimeFrameBarComponent,
        TimeFrameBarBasicExampleComponent,
        TimeFrameBarTestComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiButtonModule,
        NuiBusyModule,
        NuiChartsModule,
        NuiCommonModule,
        NuiDialogModule,
        NuiDocsModule,
        NuiIconModule,
        NuiLayoutModule,
        NuiPopoverModule,
        NuiTimeFramePickerModule,
        NuiTimeFrameBarModule,
        NuiTooltipModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [],
})
export default class ChartDocsTimeFrameBarModule {}
