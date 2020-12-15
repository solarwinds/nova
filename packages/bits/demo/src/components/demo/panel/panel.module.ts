import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
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
} from "./index";

const routes = [
    {
        path: "",
        component: PanelDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "panel-visual-test",
        component: PanelVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "basic",
        component: PanelBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "collapsible",
        component: PanelCollapseExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "hidden",
        component: PanelHideExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "floating",
        component: PanelFloatExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "resize",
        component: PanelResizeExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
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
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/),
        },
    ],
    exports: [
        RouterModule,
    ],
})
export class PanelModule {
}
