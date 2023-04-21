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
    NuiDocsModule,
    NuiMessageModule,
    NuiRepeatModule,
    NuiSorterModule,
    SrlcStage,
} from "@nova-ui/bits";

import { SorterBasicExampleComponent } from "./sorter-basic/sorter-basic.example.component";
import { SorterExampleComponent } from "./sorter-docs/sorter-docs.example.component";
import { SorterTestExampleComponent } from "./sorter-test/sorter-test.example.component";
import { SorterLegacyStringInputUsageVisualTestComponent } from "./sorter-visual-test/sorter-legacy-string-input-usage/sorter-legacy-string-input-usage-visual-test.component";
import { SorterRecommendedUsageVisualTestComponent } from "./sorter-visual-test/sorter-recommended-usage/sorter-recommended-usage-visual-test.component";
import { SorterVisualTestHarnessComponent } from "./sorter-visual-test/sorter-visual-test-harness.component";

const routes = [
    {
        path: "",
        component: SorterExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "sorter-test",
        component: SorterTestExampleComponent,
    },
    {
        path: "visual-test",
        component: SorterVisualTestHarnessComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiSorterModule,
        NuiRepeatModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        SorterBasicExampleComponent,
        SorterLegacyStringInputUsageVisualTestComponent,
        SorterExampleComponent,
        SorterRecommendedUsageVisualTestComponent,
        SorterVisualTestHarnessComponent,
        SorterTestExampleComponent,
    ],
    exports: [RouterModule],
})
export default class SorterModule {}
