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
    NuiBusyModule,
    NuiButtonModule,
    NuiDateTimePickerModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiIconModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiPopoverModule,
    NuiPopupModule,
    NuiSelectModule,
    NuiSelectV2Module,
    NuiSpinnerModule,
    NuiTimeFrameBarModule,
    NuiTimeFramePickerModule,
    NuiTooltipModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    ComponentAsContentExampleComponent,
    ConfirmationDialogExampleComponent,
    DialogActionBeforeClosureExampleComponent,
    DialogAfterOpenedExampleComponent,
    DialogContentExampleComponent,
    DialogCustomClassExampleComponent,
    DialogDocsComponent,
    DialogInsideOverlayExampleComponent,
    DialogInsideOverlayWithDateTimePickerExampleComponent,
    DialogPositionExampleComponent,
    DialogSeverityExampleComponent,
    DialogSizesExampleComponent,
    DialogTestComponent,
    DialogVisualTestComponent,
    DialogWithKeyboardExampleComponent,
    DialogWithStaticBackdropExampleComponent,
    DialogZIndexTestComponent,
    HeaderButtonsExampleComponent,
    SimpleDialogExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: DialogDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "dialog-test",
        component: DialogTestComponent,
        data: {
            showThemeSwitcher: true,
        },
    },
    {
        path: "zindex-test",
        component: DialogZIndexTestComponent,
    },
    {
        path: "dialog-overlay",
        component: DialogVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "dialog-actions-before-closure",
        component: DialogActionBeforeClosureExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "dialog-visual-test",
        component: DialogVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiDialogModule,
        NuiDocsModule,
        NuiButtonModule,
        NuiMessageModule,
        NuiSelectV2Module,
        RouterModule.forChild(routes),
        NuiSelectModule,
        NuiDialogModule,
        NuiDocsModule,
        NuiButtonModule,
        NuiMessageModule,
        NuiSelectModule,
        NuiPopoverModule,
        NuiTooltipModule,
        NuiDateTimePickerModule,
        NuiBusyModule,
        NuiSpinnerModule,
        NuiSelectV2Module,
        NuiMenuModule,
        NuiPopupModule,
        NuiTimeFrameBarModule,
        NuiTimeFramePickerModule,
        NuiIconModule,
    ],
    declarations: [
        DialogContentExampleComponent,
        ComponentAsContentExampleComponent,
        ConfirmationDialogExampleComponent,
        DialogCustomClassExampleComponent,
        DialogDocsComponent,
        DialogTestComponent,
        DialogWithKeyboardExampleComponent,
        DialogPositionExampleComponent,
        DialogSeverityExampleComponent,
        DialogSizesExampleComponent,
        DialogInsideOverlayExampleComponent,
        DialogVisualTestComponent,
        HeaderButtonsExampleComponent,
        SimpleDialogExampleComponent,
        DialogWithStaticBackdropExampleComponent,
        DialogZIndexTestComponent,
        DialogInsideOverlayWithDateTimePickerExampleComponent,
        DialogActionBeforeClosureExampleComponent,
        DialogAfterOpenedExampleComponent,
    ],
    exports: [RouterModule],
})
export default class DialogModule {}
