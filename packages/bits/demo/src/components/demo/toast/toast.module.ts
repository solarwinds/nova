import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDividerModule,
    NuiDocsModule,
    NuiMessageModule,
    NuiRadioModule,
    NuiToastModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    ToastBasicExampleComponent,
    ToastConfigExampleComponent,
    ToastEventsExampleComponent,
    ToastExampleComponent,
    ToastPositionExampleComponent,
    ToastStickyErrorExampleComponent,
    ToastTestComponent,
    ToastTypeExampleComponent,
    ToastVisualTestComponent,
} from "./index";
import { ToastBasicHtmlExampleComponent } from "./toast-basic-html/toast-basic-html.example.component";

const routes = [
    {
        path: "",
        component: ToastExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "toast-visual-test",
        component: ToastVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "test",
        component: ToastTestComponent,
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
        NuiToastModule,
        FormsModule,
        ReactiveFormsModule,
        NuiMessageModule,
        NuiRadioModule,
        NuiDividerModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ToastBasicExampleComponent,
        ToastBasicHtmlExampleComponent,
        ToastConfigExampleComponent,
        ToastEventsExampleComponent,
        ToastExampleComponent,
        ToastPositionExampleComponent,
        ToastStickyErrorExampleComponent,
        ToastTestComponent,
        ToastTypeExampleComponent,
        ToastVisualTestComponent,
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
export class ToastModule {
}
