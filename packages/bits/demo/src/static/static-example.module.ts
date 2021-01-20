import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiCommonModule, NuiDocsModule } from "@nova-ui/bits";
import { NuiDividerModule } from "@nova-ui/bits";
import { SrlcStage } from "@nova-ui/bits";
import { NuiIconModule } from "@nova-ui/bits";
import { NuiMessageModule } from "@nova-ui/bits";
import { NuiToastModule } from "@nova-ui/bits";
import { NuiExpanderModule } from "@nova-ui/bits";
import { NuiFormFieldModule } from "@nova-ui/bits";
import { NuiTextboxModule } from "@nova-ui/bits";
import { NuiValidationMessageModule } from "@nova-ui/bits";
import { NuiButtonModule } from "@nova-ui/bits";

import { FrameworkColorsDarkExampleComponent } from "./framework-colors-dark/framework-colors-dark.example.component";
import { FrameworkColorsExampleComponent } from "./framework-colors/framework-colors-example.component";
import { LinksExampleComponent } from "./links/links.example.component";
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
];

@NgModule({
    declarations: [
        TypographyExampleComponent,
        SemanticVariablesExampleComponent,
        FrameworkColorsExampleComponent,
        FrameworkColorsDarkExampleComponent,
        LinksExampleComponent,
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
