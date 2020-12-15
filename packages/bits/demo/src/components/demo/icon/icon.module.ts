import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiExpanderModule, NuiIconModule, SrlcStage } from "@nova-ui/bits";

import {
    IconBasicExampleComponent,
    IconChildStatusExampleComponent,
    IconColorExampleComponent,
    IconCounterExampleComponent,
    IconDocsExampleComponent,
    IconHoverExampleComponent,
    IconListExampleComponent,
    IconSizeExampleComponent,
    IconStatusExampleComponent,
    IconVisualTestComponent,
    IconWithTextExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: IconDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "icon-visual-test",
        component: IconVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiIconModule,
        NuiExpanderModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        IconBasicExampleComponent,
        IconChildStatusExampleComponent,
        IconColorExampleComponent,
        IconCounterExampleComponent,
        IconDocsExampleComponent,
        IconListExampleComponent,
        IconSizeExampleComponent,
        IconStatusExampleComponent,
        IconHoverExampleComponent,
        IconWithTextExampleComponent,
        IconVisualTestComponent,
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
export class IconModule {
}
