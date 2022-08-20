import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiSelectorModule,
} from "@nova-ui/bits";

import { SelectorExampleComponent } from "./selector.example.component";

const routes = [
    {
        path: "",
        component: SelectorExampleComponent,
    },
];

@NgModule({
    imports: [NuiSelectorModule, NuiDocsModule, RouterModule.forChild(routes)],
    declarations: [SelectorExampleComponent],
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
export class SelectorModule {}
