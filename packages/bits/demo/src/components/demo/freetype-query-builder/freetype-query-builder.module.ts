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
import { RouterModule } from "@angular/router";

import {
    NuiCommonModule,
    NuiDividerModule,
    NuiFormFieldModule,
    NuiToastModule,
    NuiLayoutModule,
    NuiIconModule,
    NuiMenuModule,
    NuiPopupModule,
    NuiSelectV2Module,
    NuiFreetypeQueryModule,
    SrlcStage,
    NuiDocsModule,
    NuiMessageModule,
} from "@nova-ui/bits";

import { ExampleFreetypeQueryBuilderComponent } from "./freetype-query-builder-visual-test/example-freetype-query-builder.component";
import {
    FreetypeQueryBuilderBasicExampleComponent,
    FreetypeQueryBuilderDocsExampleComponent,
    FreetypeQueryBuilderTestComponent,
    FreetypeQueryBuilderVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: FreetypeQueryBuilderDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "freetype-query-builder-test",
        component: FreetypeQueryBuilderTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "freetype-query-builder-visual-test",
        component: FreetypeQueryBuilderVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NuiCommonModule,
        NuiDividerModule,
        NuiFormFieldModule,
        NuiToastModule,
        NuiLayoutModule,
        NuiIconModule,
        NuiMenuModule,
        NuiPopupModule,
        NuiSelectV2Module,
        NuiFreetypeQueryModule,
        RouterModule.forChild(routes),
        NuiDocsModule,
        NuiMessageModule,
    ],
    declarations: [
        FreetypeQueryBuilderDocsExampleComponent,
        FreetypeQueryBuilderTestComponent,
        FreetypeQueryBuilderVisualTestComponent,
        FreetypeQueryBuilderBasicExampleComponent,
        ExampleFreetypeQueryBuilderComponent,
    ],
    providers: [],
    exports: [RouterModule],
})
export default class FreetypeQueryBuilderModule {}
