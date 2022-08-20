import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiCommonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiTextboxModule,
    SrlcStage,
} from "@nova-ui/bits";

import { UnitConversionPipeDocsComponent } from "./docs/unit-conversion-pipe-docs.component";
import { UnitConversionPipeBasicExampleComponent } from "./unit-conversion-basic/unit-conversion-pipe-basic.example.component";

const routes = [
    {
        path: "",
        component: UnitConversionPipeDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: UnitConversionPipeBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        UnitConversionPipeDocsComponent,
        UnitConversionPipeBasicExampleComponent,
    ],
    imports: [
        FormsModule,
        NuiCommonModule,
        NuiDocsModule,
        NuiFormFieldModule,
        NuiMessageModule,
        NuiTextboxModule,
        RouterModule.forChild(routes),
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
    exports: [RouterModule],
})
export class UnitConversionPipeExampleModule {}
