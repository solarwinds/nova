import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiTextboxModule,
    SrlcStage,
} from "@nova-ui/bits";

import { RuntimeI18NExampleComponent } from "./runtime-i18n-example.component";

const routes = [
    {
        path: "",
        component: RuntimeI18NExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiDocsModule,
        NuiFormFieldModule,
        NuiTextboxModule,
        RouterModule.forChild(routes),
    ],
    declarations: [RuntimeI18NExampleComponent],
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
export class RuntimeI18NModule {}
