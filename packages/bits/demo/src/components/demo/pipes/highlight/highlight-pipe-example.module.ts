import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiCommonModule,
    NuiDocsModule,
    NuiSearchModule,
    SrlcStage,
} from "@nova-ui/bits";

import { HighlightPipeDocsExampleComponent } from "./highlight-pipe-docs/highlight-pipe-docs.example.component";
import { HighlightPipeExampleComponent } from "./highlight-pipe/highlight-pipe.example.component";

const routes = [
    {
        path: "",
        component: HighlightPipeDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "highlight-pipe",
        component: HighlightPipeExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    declarations: [
        HighlightPipeDocsExampleComponent,
        HighlightPipeExampleComponent,
    ],
    imports: [
        NuiCommonModule,
        NuiDocsModule,
        NuiSearchModule,
        RouterModule.forChild(routes),
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
export class HighlightPipeExampleModule { }
