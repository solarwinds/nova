import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiChipsModule,
    NuiDocsModule,
    NuiIconModule,
    NuiPopoverModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    AutohideChipsExampleComponent,
    BasicChipsExampleComponent,
    ChipsCustomCssExampleComponent,
    ChipsDocsExampleComponent,
    ChipsOverflowExampleComponent,
    ChipsVisualTestComponent,
    ChipsTestComponent,
    GroupedChipsExampleComponent,
    VerticalFlatChipsExampleComponent,
    VerticalGroupedChipsExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: ChipsDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "overflow",
        component: ChipsOverflowExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "chips-visual-test",
        component: ChipsVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "chips-test",
        component: ChipsTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "custom-css",
        component: ChipsCustomCssExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiChipsModule,
        NuiPopoverModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
        NuiIconModule,
    ],
    declarations: [
        AutohideChipsExampleComponent,
        BasicChipsExampleComponent,
        ChipsDocsExampleComponent,
        ChipsVisualTestComponent,
        ChipsTestComponent,
        GroupedChipsExampleComponent,
        VerticalFlatChipsExampleComponent,
        VerticalGroupedChipsExampleComponent,
        ChipsOverflowExampleComponent,
        ChipsCustomCssExampleComponent,
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
export class ChipsModule {}
