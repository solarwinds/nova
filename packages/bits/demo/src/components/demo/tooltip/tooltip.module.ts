import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiRadioModule,
    NuiSwitchModule,
    NuiTooltipModule,
    SrlcStage,
} from "@solarwinds/nova-bits";

import {
    TooltipBasicExampleComponent,
    TooltipDisabledExampleComponent,
    TooltipDocsExampleComponent,
    TooltipPositionExampleComponent,
    TooltipTriggerExampleComponent,
    TooltipVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: TooltipDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "tooltip-basic",
        component: TooltipBasicExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "tooltip-disabled",
        component: TooltipDisabledExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "tooltip-position",
        component: TooltipPositionExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "tooltip-trigger",
        component: TooltipTriggerExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "tooltip-visual-test",
        component: TooltipVisualTestComponent,
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
        NuiTooltipModule,
        NuiSwitchModule,
        NuiRadioModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TooltipBasicExampleComponent,
        TooltipDocsExampleComponent,
        TooltipDisabledExampleComponent,
        TooltipPositionExampleComponent,
        TooltipTriggerExampleComponent,
        TooltipVisualTestComponent,
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
export class TooltipDemoModule {
}
