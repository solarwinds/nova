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

import { CdkTreeModule } from "@angular/cdk/tree";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    NuiBusyModule,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiCommonModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiIconModule,
    NuiMenuModule,
    NuiPaginatorModule,
    NuiRepeatModule,
    NuiSpinnerModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    TreeBasicExampleComponent,
    TreeCheckboxExampleComponent,
    TreeDialogContentExampleComponent,
    TreeDocsExampleComponent,
    TreeLazyExampleComponent,
    TreeLeafPaginationExampleComponent,
    TreeLoadMoreExampleComponent,
    TreeShowAllDialogExampleComponent,
    TreeStylingExampleComponent,
    TreeVisualTestComponent,
    TreeWithAdditionalContentExampleComponent,
} from "./index";
import { TreeCheckboxLazyComponent } from "./tree-checkbox-lazy/tree-checkbox-lazy.component";
import { TreeBasicTestComponent } from "./tree-visual-test/tree-basic-test/tree-basic-test.component";
import { TreeCheckboxTestComponent } from "./tree-visual-test/tree-checkbox-test/tree-checkbox-test.component";
import { TreePaginatorTestComponent } from "./tree-visual-test/tree-paginator-test/tree-paginator-test.component";

const routes = [
    {
        path: "",
        component: TreeDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: TreeBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "lazy",
        component: TreeLazyExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "leaf-pagination",
        component: TreeLeafPaginationExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "show-all-dialog",
        component: TreeShowAllDialogExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "styling",
        component: TreeStylingExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "with-additional-content",
        component: TreeWithAdditionalContentExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "checkbox",
        component: TreeCheckboxExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "checkbox-lazy",
        component: TreeCheckboxLazyComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "load-more",
        component: TreeLoadMoreExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "tree-visual-test",
        component: TreeVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        CdkTreeModule,
        NuiDocsModule,
        NuiCommonModule,
        NuiIconModule,
        NuiButtonModule,
        NuiExpanderModule,
        NuiButtonModule,
        NuiMenuModule,
        NuiSpinnerModule,
        NuiCheckboxModule,
        NuiPaginatorModule,
        NuiDialogModule,
        NuiRepeatModule,
        NuiBusyModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TreeBasicExampleComponent,
        TreeDocsExampleComponent,
        TreeStylingExampleComponent,
        TreeVisualTestComponent,
        TreeLazyExampleComponent,
        TreeCheckboxExampleComponent,
        TreeLeafPaginationExampleComponent,
        TreeWithAdditionalContentExampleComponent,
        TreeShowAllDialogExampleComponent,
        TreeDialogContentExampleComponent,
        TreeLoadMoreExampleComponent,
        TreeBasicTestComponent,
        TreeCheckboxTestComponent,
        TreePaginatorTestComponent,
        TreeCheckboxLazyComponent,
    ],
    exports: [RouterModule],
})
export class TreeModule {}
