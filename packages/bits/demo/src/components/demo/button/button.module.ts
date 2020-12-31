import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiButtonModule, NuiDocsModule, NuiMessageModule, SrlcStage } from "@nova-ui/bits";

import {
    ButtonBasicExampleComponent,
    ButtonBusyExampleComponent,
    ButtonDisplayStyleActionExampleComponent,
    ButtonDisplayStyleDestructiveExampleComponent,
    ButtonDisplayStylePrimaryExampleComponent,
    ButtonDocsComponent,
    ButtonGroupExampleComponent,
    ButtonRepeatableExampleComponent,
    ButtonSizeExampleComponent,
    ButtonTestComponent,
    ButtonVisualTestComponent,
    ButtonWithIconCustomColorExampleComponent,
    ButtonWithIconExampleComponent,
    ButtonWithIconOnlyExampleComponent,
    ButtonWithIconRightExampleComponent,
    ButtonWithLongTextExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: ButtonDocsComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "button-test",
        component: ButtonTestComponent,
    },
    {
        path: "button-visual-test",
        component: ButtonVisualTestComponent,
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
        FormsModule,
        ReactiveFormsModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ButtonDocsComponent,
        ButtonDisplayStyleActionExampleComponent,
        ButtonDisplayStyleDestructiveExampleComponent,
        ButtonDisplayStylePrimaryExampleComponent,
        ButtonGroupExampleComponent,
        ButtonRepeatableExampleComponent,
        ButtonBasicExampleComponent,
        ButtonBusyExampleComponent,
        ButtonSizeExampleComponent,
        ButtonTestComponent,
        ButtonVisualTestComponent,
        ButtonWithIconExampleComponent,
        ButtonWithIconRightExampleComponent,
        ButtonWithIconCustomColorExampleComponent,
        ButtonWithIconOnlyExampleComponent,
        ButtonWithLongTextExampleComponent,
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
export class ButtonModule {
}
