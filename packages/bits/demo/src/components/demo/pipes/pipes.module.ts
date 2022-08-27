import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DEMO_PATH_TOKEN, NuiDocsModule } from "@nova-ui/bits";

const routes = [
    {
        path: "highlight",
        loadChildren: async () =>
            import("./highlight/highlight-pipe-example.module").then(
                (m) => m.HighlightPipeExampleModule
            ),
    },
    {
        path: "unit-conversion",
        loadChildren: async () =>
            import(
                "./unit-conversion/unit-conversion-pipe-example.module"
            ).then((m) => m.UnitConversionPipeExampleModule),
    },
];

@NgModule({
    imports: [NuiDocsModule, RouterModule.forChild(routes)],
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
export class PipesModule {}
