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

import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    NuiButtonModule,
    NuiDocsModule,
    NuiIconModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiProgressModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSwitchModule,
    NuiTabsModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    RepeatDisabledMultiSelectionExampleComponent,
    RepeatDragHandleExampleComponent,
    RepeatDragPreviewExampleComponent,
    RepeatDragSimpleExampleComponent,
    RepeatExampleComponent,
    RepeatItemExampleComponent,
    RepeatMultiSelectionExampleComponent,
    RepeatRadioSelectionModeExampleComponent,
    RepeatRadioWithNonRequiredSelectionModeExampleComponent,
    RepeatReorderItemConfigExampleComponent,
    RepeatReorderSimpleExampleComponent,
    RepeatSimpleExampleComponent,
    RepeatSingleSelectionModeExampleComponent,
    RepeatSingleWithRequiredSelectionModeExampleComponent,
    RepeatTestComponent,
    RepeatVisualTestComponent,
    RepeatVirtualScrollComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: RepeatExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "repeat-item",
        component: RepeatItemExampleComponent,
    },
    {
        path: "repeat-test",
        component: RepeatTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "repeat-visual-test",
        component: RepeatVisualTestComponent,
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
        NuiDocsModule,
        NuiFormFieldModule,
        NuiIconModule,
        NuiMessageModule,
        NuiProgressModule,
        NuiRepeatModule,
        NuiSearchModule,
        NuiSwitchModule,
        NuiTabsModule,
        RouterModule.forChild(routes),
        ScrollingModule,
    ],
    declarations: [
        RepeatExampleComponent,
        RepeatItemExampleComponent,
        RepeatDisabledMultiSelectionExampleComponent,
        RepeatMultiSelectionExampleComponent,
        RepeatRadioSelectionModeExampleComponent,
        RepeatRadioWithNonRequiredSelectionModeExampleComponent,
        RepeatSimpleExampleComponent,
        RepeatDragSimpleExampleComponent,
        RepeatReorderSimpleExampleComponent,
        RepeatDragPreviewExampleComponent,
        RepeatSingleSelectionModeExampleComponent,
        RepeatSingleWithRequiredSelectionModeExampleComponent,
        RepeatTestComponent,
        RepeatVisualTestComponent,
        RepeatReorderItemConfigExampleComponent,
        RepeatDragHandleExampleComponent,
        RepeatVirtualScrollComponent,
    ],
    exports: [RouterModule],
})
export default class RepeatModule {}
