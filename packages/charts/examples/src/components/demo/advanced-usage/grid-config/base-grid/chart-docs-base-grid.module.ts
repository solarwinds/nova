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
    NuiCheckboxModule,
    NuiDocsModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsBaseGridComponent } from "./chart-docs-base-grid.component";
import { BaseGridDisablingInteractionExampleComponent } from "./disabling-interaction/base-grid-disabling-interaction.example.component";
import { BaseGridHeightAndWidthExampleComponent } from "./height-and-width/base-grid-height-and-width.example.component";
import { BaseGridAutoMarginsExampleComponent } from "./margins/base-grid-auto-margins.example.component";
import { BaseGridMarginsExampleComponent } from "./margins/base-grid-margins.example.component";
import { BaseGridPaddingExampleComponent } from "./padding/base-grid-padding.example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsBaseGridComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "disabling-interaction",
        component: BaseGridDisablingInteractionExampleComponent,
    },
    {
        path: "margins",
        component: BaseGridMarginsExampleComponent,
    },
    {
        path: "padding",
        component: BaseGridPaddingExampleComponent,
    },
    {
        path: "height-and-width",
        component: BaseGridHeightAndWidthExampleComponent,
    },
];

@NgModule({
    declarations: [
        BaseGridDisablingInteractionExampleComponent,
        BaseGridAutoMarginsExampleComponent,
        BaseGridMarginsExampleComponent,
        BaseGridPaddingExampleComponent,
        BaseGridHeightAndWidthExampleComponent,
        ChartDocsBaseGridComponent,
    ],
    imports: [
        NuiCheckboxModule,
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [],
})
export class ChartDocsBaseGridModule {}
