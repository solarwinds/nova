import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiMessageModule,
    SrlcStage,
} from "@nova-ui/bits";
import { NuiChartsModule } from "@nova-ui/charts";

import { ChartDocsFormattersComponent } from "./chart-docs-formatters.component";
import { TickFormatterExampleComponent } from "./tick-formatter/tick-formatter.example.component";

const exampleRoutes: Routes = [
    {
        path: "",
        component: ChartDocsFormattersComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "tick",
        component: TickFormatterExampleComponent,
    },
];

@NgModule({
    declarations: [TickFormatterExampleComponent, ChartDocsFormattersComponent],
    imports: [
        NuiChartsModule,
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
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
})
export class ChartDocsFormattersModule {}
