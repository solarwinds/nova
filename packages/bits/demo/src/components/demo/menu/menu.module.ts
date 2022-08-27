import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiSwitchModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    BasicMenuExampleComponent,
    MenuAppendToBodyExampleComponent,
    MenuCustomItemExampleComponent,
    MenuExampleComponent,
    MenuItemVariationsExampleComponent,
    MenuTestComponent,
    MenuVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: MenuExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: BasicMenuExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "menu-visual-test",
        component: MenuVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "menu-test",
        component: MenuTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiMenuModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiSwitchModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        BasicMenuExampleComponent,
        MenuExampleComponent,
        MenuAppendToBodyExampleComponent,
        MenuItemVariationsExampleComponent,
        MenuCustomItemExampleComponent,
        MenuTestComponent,
        MenuVisualTestComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () =>
                (<any>require).context(
                    `!!raw-loader!./`,
                    true,
                    /.*\.(ts|html|less)$/
                ),
        },
    ],
    exports: [RouterModule],
})
export class MenuModule {}
