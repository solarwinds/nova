import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiMessageModule, NuiPaginatorModule, SrlcStage } from "@nova-ui/bits";

import {
    PaginatorAdjacentExampleComponent,
    PaginatorBasicExampleComponent,
    PaginatorCustomPageSetExampleComponent,
    PaginatorExampleComponent,
    PaginatorHiddenPrevNextExampleComponent,
    PaginatorStylingExampleComponent,
    PaginatorVirtualScrollExampleComponent,
    PaginatorVisibilityExampleComponent,
    PaginatorVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: PaginatorExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "paginator-visual-test",
        component: PaginatorVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiPaginatorModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        PaginatorAdjacentExampleComponent,
        PaginatorBasicExampleComponent,
        PaginatorCustomPageSetExampleComponent,
        PaginatorExampleComponent,
        PaginatorHiddenPrevNextExampleComponent,
        PaginatorStylingExampleComponent,
        PaginatorVirtualScrollExampleComponent,
        PaginatorVisibilityExampleComponent,
        PaginatorVisualTestComponent,
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
export class PaginatorModule {
}
