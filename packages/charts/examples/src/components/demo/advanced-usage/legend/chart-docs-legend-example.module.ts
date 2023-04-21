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
    NuiButtonModule,
    NuiDocsModule,
    NuiIconModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";
import { LegendActiveExampleComponent } from "./legend-active/legend-active.example.component";
import { LegendBasicExampleComponent } from "./legend-basic/legend-basic.example.component";
import { LegendCompactExampleComponent } from "./legend-compact/legend-compact.example.component";
import { LegendDescriptionProjectionExampleComponent } from "./legend-description-content-projection/legend-description-projection.example.component";
import { LegendDocsExampleComponent } from "./legend-docs/legend-docs.example.component";
import { LegendHorizontalExampleComponent } from "./legend-horizontal/legend-horizontal.example.component";
import { LegendInteractiveExampleComponent } from "./legend-interactive/legend-interactive.example.component";
import { LegendMetadataExampleComponent } from "./legend-metadata/legend-metadata-example.component";
import { LegendRichTileContentProjectionExampleComponent } from "./legend-rich-tile-content-projection/legend-rich-tile-content-projection.example.component";
import { LegendRichTileExampleComponent } from "./legend-rich-tile/legend-rich-tile.example.component";
import { LegendTestExampleComponent } from "./legend-test/legend-test.component";
import { LegendTextColorExampleComponent } from "./legend-text-color/legend-text-color.example.component";
import { LegendVisualTestComponent } from "./legend-visual-test/legend-visual-test.component";

const legendRoutes: Routes = [
    {
        path: "",
        component: LegendDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: LegendBasicExampleComponent,
    },
    {
        path: "interactive",
        component: LegendInteractiveExampleComponent,
    },
    {
        path: "test",
        component: LegendTestExampleComponent,
    },
    {
        path: "rich-tile-content-projection",
        component: LegendRichTileContentProjectionExampleComponent,
    },
    {
        path: "metadata",
        component: LegendMetadataExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "visual-test",
        component: LegendVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        LegendActiveExampleComponent,
        LegendBasicExampleComponent,
        LegendCompactExampleComponent,
        LegendDocsExampleComponent,
        LegendHorizontalExampleComponent,
        LegendInteractiveExampleComponent,
        LegendRichTileExampleComponent,
        LegendTestExampleComponent,
        LegendTextColorExampleComponent,
        LegendVisualTestComponent,
        LegendDescriptionProjectionExampleComponent,
        LegendRichTileContentProjectionExampleComponent,
        LegendMetadataExampleComponent,
    ],
    imports: [
        DemoCommonModule,
        NuiChartsModule,
        RouterModule.forChild(legendRoutes),
        NuiDocsModule,
        NuiIconModule,
        NuiButtonModule,
        NuiMessageModule,
    ],
    providers: [],
})
export default class ChartDocsLegendExampleModule {}
