import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiDocsModule,
    NuiFormFieldModule,
    NuiMessageModule, NuiProgressModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSwitchModule,
    SrlcStage,
} from "@solarwinds/nova-bits";

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
} from "./index";
import { RepeatTestComponent } from "./repeat-select-test/repeat-test.component";

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
        RepeatReorderItemConfigExampleComponent,
        RepeatDragHandleExampleComponent,
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
