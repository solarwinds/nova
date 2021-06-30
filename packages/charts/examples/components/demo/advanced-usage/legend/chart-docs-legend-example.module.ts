import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiButtonModule, NuiDocsModule, NuiIconModule, NuiMessageModule, SrlcStage } from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { DemoCommonModule } from "../../common/demo-common.module";

import { LegendActiveExampleComponent } from "./legend-active/legend-active.example.component";
import { LegendBasicExampleComponent } from "./legend-basic/legend-basic.example.component";
import { LegendCompactExampleComponent } from "./legend-compact/legend-compact.example.component";
import { LegendDescriptionProjectionExampleComponent } from "./legend-description-content-projection/legend-description-projection.example.component";
import { LegendDocsExampleComponent } from "./legend-docs/legend-docs.example.component";
import { LegendHorizontalExampleComponent } from "./legend-horizontal/legend-horizontal.example.component";
import { LegendInteractiveExampleComponent } from "./legend-interactive/legend-interactive.example.component";
import { LegendRichTileContentProjectionExampleComponent } from "./legend-rich-tile-content-projection/legend-rich-tile-content-projection.example.component";
import { LegendRichTileExampleComponent } from "./legend-rich-tile/legend-rich-tile.example.component";
import { LegendTestExampleComponent } from "./legend-test/legend-test.component";
import { LegendTextColorExampleComponent } from "./legend-text-color/legend-text-color.example.component";
import { LegendVisualTestComponent } from "./legend-visual-test/legend-visual-test.component";
import { LegendMetadataExampleComponent } from "./legend-metadata/legend-metadata-example.component";

const legendRoutes: Routes = [
    {
        path: "",
        component: LegendDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
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
            "srlc": {
                "hideIndicator": true,
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
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class ChartDocsLegendExampleModule {
}
