import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiMessageModule,
    NuiRepeatModule,
    NuiSorterModule,
    SrlcStage,
} from "@nova-ui/bits";

import { SorterBasicExampleComponent } from "./sorter-basic/sorter-basic.example.component";
import { SorterExampleComponent } from "./sorter-docs/sorter-docs.example.component";
import { SorterLegacyStringInputUsageVisualTestComponent } from "./sorter-visual-test/sorter-legacy-string-input-usage/sorter-legacy-string-input-usage-visual-test.component";
import { SorterRecommendedUsageVisualTestComponent } from "./sorter-visual-test/sorter-recommended-usage/sorter-recommended-usage-visual-test.component";
import { SorterVisualTestHarnessComponent } from "./sorter-visual-test/sorter-visual-test-harness.component";
import {SorterTestExampleComponent} from "./sorter-test/sorter-test.example.component"; 

const routes = [
    {
        path: "",
        component: SorterExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "sorter-test",
        component: SorterTestExampleComponent,
    },
    {
        path: "visual-test",
        component: SorterVisualTestHarnessComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiSorterModule,
        NuiRepeatModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        SorterBasicExampleComponent,
        SorterLegacyStringInputUsageVisualTestComponent,
        SorterExampleComponent,
        SorterRecommendedUsageVisualTestComponent,
        SorterVisualTestHarnessComponent,
        SorterTestExampleComponent,
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
export class SorterModule {
}
