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
    NuiExpanderModule,
    NuiMenuModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    ExpanderBasicExampleComponent,
    ExpanderCustomHeaderExampleComponent,
    ExpanderDocsExampleComponent,
    ExpanderHeaderTextExampleComponent,
    ExpanderInitiallyExpandedExampleComponent,
    ExpanderOpenChangeExampleComponent,
    ExpanderTextAndIconExampleComponent,
    ExpanderVisualTestComponent,
    ExpanderWithoutBorderExampleComponent,
    ExpanderTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: ExpanderDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "expander-visual-test",
        component: ExpanderVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "expander-test",
        component: ExpanderTestComponent,
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
        NuiExpanderModule,
        NuiMenuModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ExpanderBasicExampleComponent,
        ExpanderCustomHeaderExampleComponent,
        ExpanderDocsExampleComponent,
        ExpanderHeaderTextExampleComponent,
        ExpanderInitiallyExpandedExampleComponent,
        ExpanderTextAndIconExampleComponent,
        ExpanderOpenChangeExampleComponent,
        ExpanderWithoutBorderExampleComponent,
        ExpanderVisualTestComponent,
        ExpanderTestComponent,
    ],
    exports: [RouterModule],
})
export default class ExpanderModule {}
