import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiSearchModule, NuiSelectModule } from "@solarwinds/nova-bits";

import { HighlightPipeDocsExampleComponent, HighlightPipeExampleComponent } from "./index";

const routes = [
    {
        path: "",
        component: HighlightPipeDocsExampleComponent,
    },
    {
        path: "highlight-pipe",
        component: HighlightPipeDocsExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    imports: [
        NuiDocsModule,
        NuiSearchModule,
        NuiSelectModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        HighlightPipeExampleComponent,
        HighlightPipeDocsExampleComponent,
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
export class PipesModule {
}
