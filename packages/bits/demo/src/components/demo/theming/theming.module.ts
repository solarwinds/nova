import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiMessageModule,
    NuiSwitchModule,
    SrlcStage,
} from "@solarwinds/nova-bits";

import { CustomThemeExampleComponent } from "./custom-theme/custom-theme.example.component";
import { ThemeSwitchServiceExampleComponent } from "./theme-switch-service/theme-switch-service.example.component";
import { ThemingDocsExampleComponent } from "./theming-docs/theming-docs.example.component";

const routes = [
    {
        path: "",
        component: ThemingDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "theme-switch-service",
        component: ThemeSwitchServiceExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "custom-theme",
        component: CustomThemeExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiMessageModule,
        NuiDocsModule,
        NuiSwitchModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        CustomThemeExampleComponent,
        ThemingDocsExampleComponent,
        ThemeSwitchServiceExampleComponent,
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
export class ThemingModule {
}
