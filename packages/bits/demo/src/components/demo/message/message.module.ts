import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiButtonModule, NuiDocsModule, NuiMessageModule, SrlcStage } from "@solarwinds/nova-bits";

import {
    MessageBasicExampleComponent,
    MessageCriticalExampleComponent,
    MessageDocsComponent,
    MessageInfoExampleComponent,
    MessageManualControlExampleComponent,
    MessageNotDismissableExampleComponent,
    MessageOkExampleComponent,
    MessageTestComponent,
    MessageVisualTestComponent,
    MessageWarningExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: MessageDocsComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "message-test",
        component: MessageTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "message-visual-test",
        component: MessageVisualTestComponent,
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
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        MessageBasicExampleComponent,
        MessageCriticalExampleComponent,
        MessageDocsComponent,
        MessageInfoExampleComponent,
        MessageManualControlExampleComponent,
        MessageNotDismissableExampleComponent,
        MessageOkExampleComponent,
        MessageTestComponent,
        MessageVisualTestComponent,
        MessageWarningExampleComponent,
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
export class MessageModule {
}
