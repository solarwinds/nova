import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiTextboxModule,
    SrlcStage,
} from "@nova-ui/bits";

import { UnitConversionServiceDocsComponent } from "./docs/unit-conversion-service-docs.component";
import { UnitConversionServiceBasicExampleComponent } from "./unit-conversion-service-basic/unit-conversion-service-basic.example.component";
import { UnitConversionServiceSeparateUnitDisplayExampleComponent } from "./unit-conversion-service-separate-unit-display/unit-conversion-service-separate-unit-display.example.component";

const routes = [
    {
        path: "",
        component: UnitConversionServiceDocsComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: UnitConversionServiceBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "separate-unit-display",
        component: UnitConversionServiceSeparateUnitDisplayExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    declarations: [
        UnitConversionServiceDocsComponent,
        UnitConversionServiceBasicExampleComponent,
        UnitConversionServiceSeparateUnitDisplayExampleComponent,
    ],
    imports: [
        FormsModule,
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
export class UnitConversionServiceExampleModule {}
