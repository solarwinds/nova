import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiBusyModule,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiProgressModule,
    NuiSelectModule,
    NuiSpinnerModule,
    SrlcStage,
} from "@nova-ui/bits";

import { BusyDocsExampleComponent } from "./busy-docs/busy-docs.example.component";
import {
    BusyBasicExampleComponent,
    BusyProgressExampleComponent,
    BusySpinnerExampleComponent,
    BusyTestComponent,
    BusyVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: BusyDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "busy-visual-test",
        component: BusyVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "busy-test",
        component: BusyTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiBusyModule,
        NuiButtonModule,
        NuiMessageModule,
        NuiSpinnerModule,
        NuiCheckboxModule,
        NuiSelectModule,
        NuiProgressModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        BusyBasicExampleComponent,
        BusyDocsExampleComponent,
        BusySpinnerExampleComponent,
        BusyProgressExampleComponent,
        BusyTestComponent,
        BusyVisualTestComponent,
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
export class BusyModule {
}
