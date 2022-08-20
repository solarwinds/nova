import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiContentModule,
    NuiDocsModule,
    SrlcStage,
} from "@nova-ui/bits";

import { ContentExampleComponent } from "./content.example.component";

const routes = [
    {
        path: "",
        component: ContentExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.alpha,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiContentModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [ContentExampleComponent],
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
export class ContentModule {}
