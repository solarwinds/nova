import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiSearchModule,
    NuiTextboxModule,
    NuiToolbarModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    ToolbarBasicExampleComponent,
    ToolbarDocsExampleComponent,
    ToolbarEmbeddedContentExampleComponent,
    ToolbarItemTypesExampleComponent,
    ToolbarSelectionExampleComponent,
    ToolbarTestExampleComponent,
    ToolbarVisualTestExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: ToolbarDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "toolbar-test",
        component: ToolbarTestExampleComponent,
    },
    {
        path: "toolbar-visual-test",
        component: ToolbarVisualTestExampleComponent,
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
        NuiToolbarModule,
        NuiMenuModule,
        NuiSearchModule,
        NuiTextboxModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ToolbarBasicExampleComponent,
        ToolbarDocsExampleComponent,
        ToolbarEmbeddedContentExampleComponent,
        ToolbarSelectionExampleComponent,
        ToolbarItemTypesExampleComponent,
        ToolbarTestExampleComponent,
        ToolbarVisualTestExampleComponent,
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
export class ToolbarModule {
}
