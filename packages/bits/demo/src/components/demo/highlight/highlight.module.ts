import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDividerModule,
    NuiDocsModule,
    NuiCommonModule,
} from "@nova-ui/bits";

import { HighlightExampleComponent } from "./highlight.example.component";

const routes = [
    {
        path: "",
        component: HighlightExampleComponent,
    },
];

@NgModule({
    imports: [
        NuiDividerModule,
        FormsModule,
        ReactiveFormsModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
        NuiCommonModule,
    ],
    declarations: [HighlightExampleComponent],
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
export class HighlightModule {}
