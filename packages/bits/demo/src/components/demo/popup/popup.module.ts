import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDocsModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiPopupModule,
    NuiSearchModule,
    NuiTextboxModule,
    SrlcStage,
} from "@solarwinds/nova-bits";

import {
    PopupAppendToBodyExampleComponent,
    PopupDifferentDirectionsExampleComponent,
    PopupExampleComponent,
    PopupSimpleExampleComponent,
    PopupTestComponent,
    PopupWithCustomContentComponent,
    PopupWithCustomStylingComponent,
    PopupWithCustomWidthComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: PopupExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.support,
                "eolDate": new Date("2020-07-09"),
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "popup-test",
        component: PopupTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "basic",
        component: PopupSimpleExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiPopupModule,
        NuiMessageModule,
        NuiButtonModule,
        ReactiveFormsModule,
        FormsModule,
        NuiCheckboxModule,
        NuiSearchModule,
        NuiDocsModule,
        NuiMenuModule,
        RouterModule.forChild(routes),
        NuiTextboxModule,
    ],
    declarations: [
        PopupSimpleExampleComponent,
        PopupDifferentDirectionsExampleComponent,
        PopupWithCustomStylingComponent,
        PopupWithCustomWidthComponent,
        PopupWithCustomContentComponent,
        PopupTestComponent,
        PopupAppendToBodyExampleComponent,
        PopupExampleComponent,
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
export class PopupModule {
}
