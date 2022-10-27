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
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiLayoutModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    LayoutBasicExampleComponent,
    LayoutComplexExampleComponent,
    LayoutExampleComponent,
    LayoutFitContentComponent,
    LayoutInitSizeExampleComponent,
    LayoutPageContentExampleComponent,
    LayoutResizeExampleComponent,
    LayoutSeparateSheetsExampleComponent,
    LayoutTestComponent,
    LayoutVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: LayoutExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "layout-test",
        component: LayoutTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "layout-visual-test",
        component: LayoutVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiLayoutModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        LayoutExampleComponent,
        LayoutBasicExampleComponent,
        LayoutSeparateSheetsExampleComponent,
        LayoutFitContentComponent,
        LayoutResizeExampleComponent,
        LayoutTestComponent,
        LayoutVisualTestComponent,
        LayoutComplexExampleComponent,
        LayoutInitSizeExampleComponent,
        LayoutPageContentExampleComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () =>
                (<any>require).context(
                    `!!raw-loader!./`,
                    true,
                    /.*\.(ts|html|less)$/
                ),
        },
    ],
    exports: [RouterModule],
})
export class LayoutModule {}
