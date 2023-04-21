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

import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    NuiButtonModule,
    NuiCheckboxModule,
    NuiCommonModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiIconModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiOverlayAdditionsModule,
    NuiOverlayModule,
    NuiSearchModule,
    NuiSelectV2Module,
    SrlcStage,
} from "@nova-ui/bits";

import {
    CustomConfirmationInsideDialogComponent,
    OverlayArrowExampleComponent,
    OverlayCustomContainerExampleComponent,
    OverlayCustomDialogComponent,
    OverlayCustomStylesExampleComponent,
    OverlayDocsComponent,
    OverlayPopupStylesExampleComponent,
    OverlayShowHideToggleExampleComponent,
    OverlaySimpleExampleComponent,
    OverlayTestComponent,
    OverlayViewportMarginExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: OverlayDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: OverlaySimpleExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "with-popup-styles",
        component: OverlayPopupStylesExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "custom-styles",
        component: OverlayCustomStylesExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "arrow",
        component: OverlayArrowExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "custom-container",
        component: OverlayCustomContainerExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "toggle-examples",
        component: OverlayShowHideToggleExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "viewport-margin",
        component: OverlayViewportMarginExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "custom-dialog",
        component: OverlayCustomDialogComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "custom-confirmation-dialog",
        component: CustomConfirmationInsideDialogComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "overlay-test",
        component: OverlayTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiCommonModule,
        NuiSelectV2Module,
        NuiOverlayModule,
        NuiOverlayAdditionsModule,
        NuiMessageModule,
        NuiButtonModule,
        NuiExpanderModule,
        NuiDialogModule,
        NuiIconModule,
        ReactiveFormsModule,
        FormsModule,
        NuiCheckboxModule,
        NuiSearchModule,
        NuiDocsModule,
        NuiMenuModule,
        DragDropModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        OverlaySimpleExampleComponent,
        OverlayShowHideToggleExampleComponent,
        OverlayTestComponent,
        OverlayCustomStylesExampleComponent,
        OverlayCustomContainerExampleComponent,
        OverlayDocsComponent,
        OverlayViewportMarginExampleComponent,
        OverlayArrowExampleComponent,
        OverlayPopupStylesExampleComponent,
        OverlayCustomDialogComponent,
        CustomConfirmationInsideDialogComponent,
    ],
    exports: [RouterModule],
})
export default class OverlayModule {}
