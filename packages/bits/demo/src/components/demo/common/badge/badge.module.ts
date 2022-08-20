import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiTextboxModule,
} from "@nova-ui/bits";

import { BadgeColorBlackComponent } from "./badge-color-black/badge-color-black.component";
import { BadgeCounterBasicComponent } from "./badge-counter-basic/badge-counter-basic.component";
import { BadgeCustomizationComponent } from "./badge-customization/badge-customization.component";
import { BadgeDocsComponent } from "./badge-docs/badge-docs.component";
import { BadgeEmptyBasicComponent } from "./badge-empty-basic/badge-empty-basic.component";
import { BadgeNovauiComponent } from "./badge-novaui/badge-novaui.component";
import { BadgeSystemStatusesComponent } from "./badge-system-statuses/badge-system-statuses.component";
import { BadgeVisualTestComponent } from "./badge-visual-test/badge-visual-test.component";

const routes = [
    {
        path: "",
        component: BadgeDocsComponent,
    },
    {
        path: "badge-visual-test",
        component: BadgeVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    declarations: [
        BadgeDocsComponent,
        BadgeCounterBasicComponent,
        BadgeEmptyBasicComponent,
        BadgeSystemStatusesComponent,
        BadgeColorBlackComponent,
        BadgeCustomizationComponent,
        BadgeNovauiComponent,
        BadgeVisualTestComponent,
    ],
    imports: [
        NuiButtonModule,
        NuiFormFieldModule,
        NuiDocsModule,
        NuiMessageModule,
        NuiTextboxModule,
        ScrollingModule,
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
export class BadgeModule {}
