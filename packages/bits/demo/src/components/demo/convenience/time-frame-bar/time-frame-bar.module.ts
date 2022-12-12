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
    NuiCommonModule,
    NuiDatePickerModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
    NuiPopoverModule,
    NuiTimeFrameBarModule,
    NuiTimeFramePickerModule,
    NuiTimePickerModule,
    NuiTooltipModule,
    SrlcStage,
} from "@nova-ui/bits";

import { TimeFrameBarBasicExampleComponent } from "./time-frame-bar-basic/time-frame-bar-basic.example.component";
import { TimeFrameBarDocsExampleComponent } from "./time-frame-bar-docs/time-frame-bar-docs.example.component";
import { TimeFrameBarTestComponent } from "./time-frame-bar-test/time-frame-bar-test.component";
import { TimeFrameBarVisualTestComponent } from "./time-frame-bar-visual/time-frame-bar-visual.component";
import { TimeFrameBarZoomExampleComponent } from "./time-frame-bar-zoom/time-frame-bar-zoom.example.component";

const routes = [
    {
        path: "",
        component: TimeFrameBarDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: TimeFrameBarBasicExampleComponent,
    },
    {
        path: "zoom",
        component: TimeFrameBarZoomExampleComponent,
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
    {
        path: "visual",
        component: TimeFrameBarVisualTestComponent,
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
        NuiCommonModule,
        NuiDatePickerModule,
        NuiDialogModule,
        NuiIconModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiPopoverModule,
        NuiTimeFramePickerModule,
        NuiTimePickerModule,
        NuiTooltipModule,
        NuiTimeFrameBarModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TimeFrameBarBasicExampleComponent,
        TimeFrameBarZoomExampleComponent,
        TimeFrameBarDocsExampleComponent,
        TimeFrameBarTestComponent,
        TimeFrameBarVisualTestComponent,
    ],
    exports: [RouterModule],
})
export default class TimeFrameBarModule {}
