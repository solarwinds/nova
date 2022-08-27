import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiDocsModule,
    NuiPopoverModule,
    NuiSelectModule,
    NuiSelectV2Module,
    SrlcStage,
} from "@nova-ui/bits";

import {
    PopoverBasicUsageExampleComponent,
    PopoverClickTriggerExampleComponent,
    PopoverDebounceExampleComponent,
    PopoverDisabledExampleComponent,
    PopoverExampleComponent,
    PopoverFocusTriggerExampleComponent,
    PopoverIconExampleComponent,
    PopoverModalExampleComponent,
    PopoverMouseenterTriggerExampleComponent,
    PopoverNoPaddingExampleComponent,
    PopoverOpenAndCloseProgrammaticallyExampleComponent,
    PopoverOutputsExampleComponent,
    PopoverPlacementExampleComponent,
    PopoverPreventCloseOnClickExampleComponent,
    PopoverStatusExampleComponent,
    PopoverUnlimitedExampleComponent,
    PopoverVisualTestComponent,
    PopoverWithContainerExampleComponent,
    PopoverWithTitleExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: PopoverExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "popover-test",
        component: PopoverExampleComponent,
    },
    {
        path: "popover-visual-test",
        component: PopoverVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiPopoverModule,
        NuiCheckboxModule,
        NuiSelectModule,
        NuiSelectV2Module,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        PopoverBasicUsageExampleComponent,
        PopoverClickTriggerExampleComponent,
        PopoverDisabledExampleComponent,
        PopoverExampleComponent,
        PopoverFocusTriggerExampleComponent,
        PopoverIconExampleComponent,
        PopoverModalExampleComponent,
        PopoverMouseenterTriggerExampleComponent,
        PopoverNoPaddingExampleComponent,
        PopoverOutputsExampleComponent,
        PopoverOpenAndCloseProgrammaticallyExampleComponent,
        PopoverPlacementExampleComponent,
        PopoverPreventCloseOnClickExampleComponent,
        PopoverWithContainerExampleComponent,
        PopoverWithTitleExampleComponent,
        PopoverVisualTestComponent,
        PopoverUnlimitedExampleComponent,
        PopoverStatusExampleComponent,
        PopoverDebounceExampleComponent,
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
export class PopoverModule {}
