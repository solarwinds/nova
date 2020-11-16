import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiCommonModule, NuiDocsModule } from "@solarwinds/nova-bits";
import { NuiDividerModule } from "@solarwinds/nova-bits";
import { SrlcStage } from "@solarwinds/nova-bits";
import { NuiIconModule } from "@solarwinds/nova-bits";
import { NuiMessageModule } from "@solarwinds/nova-bits";
import { NuiToastModule } from "@solarwinds/nova-bits";
import { NuiExpanderModule } from "@solarwinds/nova-bits";
import { NuiFormFieldModule } from "@solarwinds/nova-bits";
import { NuiTextboxModule } from "@solarwinds/nova-bits";
import { NuiValidationMessageModule } from "@solarwinds/nova-bits";
import { NuiButtonModule } from "@solarwinds/nova-bits";

import { FrameworkColorsDarkExampleComponent } from "./framework-colors-dark/framework-colors-dark.example.component";
import { FrameworkColorsExampleComponent } from "./framework-colors/framework-colors-example.component";
import { LinksExampleComponent } from "./links/links.example.component";
import { RuntimeI18NExampleComponent } from "./runtime-i18n/runtime-i18n-example.component";
import { SemanticVariablesExampleComponent } from "./semantic-variables/semantic-variables.example.component";
import { TypographyExampleComponent } from "./typography/typography-example.component";


const staticRoutes: Routes = [
    {
        path: "typography",
        component: TypographyExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "semantic-variables",
        component: SemanticVariablesExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "framework-colors",
        component: FrameworkColorsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "framework-colors-dark",
        component: FrameworkColorsDarkExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "links",
        component: LinksExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
        },
    },
    {
        path: "runtime-i18n",
        component: RuntimeI18NExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.alpha,
            },
        },
    },
];

@NgModule({
    declarations: [
        TypographyExampleComponent,
        SemanticVariablesExampleComponent,
        FrameworkColorsExampleComponent,
        FrameworkColorsDarkExampleComponent,
        LinksExampleComponent,
        RuntimeI18NExampleComponent,
    ],
    imports: [
        NuiIconModule,
        CommonModule,
        NuiDocsModule,
        NuiCommonModule,
        NuiDividerModule,
        NuiMessageModule,
        NuiToastModule,
        NuiExpanderModule,
        NuiFormFieldModule,
        NuiTextboxModule,
        NuiButtonModule,
        NuiValidationMessageModule,
        RouterModule.forChild(staticRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () =>  (<any> require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/)},
    ],
})
export class StaticExampleModule { }
