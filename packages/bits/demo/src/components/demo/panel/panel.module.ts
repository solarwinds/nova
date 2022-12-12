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
    NuiIconModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiPanelModule,
    NuiSwitchModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    PanelBasicExampleComponent,
    PanelCollapseExampleComponent,
    PanelCollapseOutsideControlExampleComponent,
    PanelCollapseTopOrientedExampleComponent,
    PanelCustomStylesExampleComponent,
    PanelDocsExampleComponent,
    PanelEmbeddedContentExampleComponent,
    PanelFloatExampleComponent,
    PanelHideExampleComponent,
    PanelHideOutsideControlExampleComponent,
    PanelHoverableExampleComponent,
    PanelNestedExampleComponent,
    PanelPositionExampleComponent,
    PanelResizeExampleComponent,
    PanelSizeExampleComponent,
    PanelVisualTestComponent,
    PanelTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: PanelDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "panel-visual-test",
        component: PanelVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "panel-test",
        component: PanelTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "basic",
        component: PanelBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "collapsible",
        component: PanelCollapseExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "hidden",
        component: PanelHideExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "floating",
        component: PanelFloatExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "resize",
        component: PanelResizeExampleComponent,
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
        NuiPanelModule,
        NuiDocsModule,
        NuiMenuModule,
        NuiSwitchModule,
        NuiIconModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        PanelBasicExampleComponent,
        PanelCollapseExampleComponent,
        PanelCollapseOutsideControlExampleComponent,
        PanelSizeExampleComponent,
        PanelEmbeddedContentExampleComponent,
        PanelHoverableExampleComponent,
        PanelCustomStylesExampleComponent,
        PanelDocsExampleComponent,
        PanelFloatExampleComponent,
        PanelHideExampleComponent,
        PanelHideOutsideControlExampleComponent,
        PanelNestedExampleComponent,
        PanelPositionExampleComponent,
        PanelResizeExampleComponent,
        PanelCollapseTopOrientedExampleComponent,
        PanelVisualTestComponent,
        PanelTestComponent,
    ],
    exports: [RouterModule],
})
export default class PanelModule {}
