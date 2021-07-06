import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule,
    NuiProgressModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSwitchModule,
    NuiTabsModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    RepeatDisabledMultiSelectionExampleComponent,
    RepeatDragHandleExampleComponent,
    RepeatDragPreviewExampleComponent,
    RepeatDragSimpleExampleComponent,
    RepeatExampleComponent,
    RepeatItemExampleComponent,
    RepeatMultiSelectionExampleComponent,
    RepeatRadioSelectionModeExampleComponent,
    RepeatRadioWithNonRequiredSelectionModeExampleComponent,
    RepeatReorderItemConfigExampleComponent,
    RepeatReorderSimpleExampleComponent,
    RepeatSimpleExampleComponent,
    RepeatSingleSelectionModeExampleComponent,
    RepeatSingleWithRequiredSelectionModeExampleComponent,
    RepeatTestComponent,
    RepeatVisualTestComponent,
    RepeatVirtualScrollComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: RepeatExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "repeat-item",
        component: RepeatItemExampleComponent,
    },
    {
        path: "repeat-test",
        component: RepeatTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "repeat-visual-test",
        component: RepeatVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiButtonModule,
        NuiRepeatModule,
        NuiSwitchModule,
        NuiMessageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
        ScrollingModule,
        NuiProgressModule,
        NuiSearchModule,
        NuiFormFieldModule,
        NuiTabsModule,
    ],
    declarations: [
        RepeatExampleComponent,
        RepeatItemExampleComponent,
        RepeatDisabledMultiSelectionExampleComponent,
        RepeatMultiSelectionExampleComponent,
        RepeatRadioSelectionModeExampleComponent,
        RepeatRadioWithNonRequiredSelectionModeExampleComponent,
        RepeatSimpleExampleComponent,
        RepeatDragSimpleExampleComponent,
        RepeatReorderSimpleExampleComponent,
        RepeatDragPreviewExampleComponent,
        RepeatSingleSelectionModeExampleComponent,
        RepeatSingleWithRequiredSelectionModeExampleComponent,
        RepeatTestComponent,
        RepeatVisualTestComponent,
        RepeatReorderItemConfigExampleComponent,
        RepeatDragHandleExampleComponent,
        RepeatVirtualScrollComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/),
        },
    ],
    exports: [
        RouterModule,
    ],
})
export class RepeatModule {
}
