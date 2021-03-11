import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiBusyModule,
    NuiButtonModule,
    NuiDateTimePickerModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiIconModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiPopoverModule,
    NuiPopupModule,
    NuiSelectModule,
    NuiSelectV2Module,
    NuiSpinnerModule,
    NuiTimeFrameBarModule,
    NuiTimeFramePickerModule,
    NuiTooltipModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    ComponentAsContentExampleComponent,
    ConfirmationDialogExampleComponent,
    DialogActionBeforeClosureExampleComponent,
    DialogAfterOpenedExampleComponent,
    DialogContentExampleComponent,
    DialogCustomClassExampleComponent,
    DialogDocsComponent,
    DialogInsideOverlayExampleComponent,
    DialogInsideOverlayWithDateTimePickerExampleComponent,
    DialogPositionExampleComponent,
    DialogSeverityExampleComponent,
    DialogSizesExampleComponent,
    DialogTestComponent,
    DialogVisualTestComponent,
    DialogWithKeyboardExampleComponent,
    DialogWithStaticBackdropExampleComponent,
    DialogZIndexTestComponent,
    HeaderButtonsExampleComponent,
    SimpleDialogExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: DialogDocsComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "dialog-test",
        component: DialogTestComponent,
        data: {
            showThemeSwitcher: true,
        },
    },
    {
        path: "zindex-test",
        component: DialogZIndexTestComponent,
    },
    {
        path: "dialog-overlay",
        component: DialogVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "dialog-actions-before-closure",
        component: DialogActionBeforeClosureExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "dialog-visual-test",
        component: DialogVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiDialogModule,
        NuiDocsModule,
        NuiButtonModule,
        NuiMessageModule,
        NuiSelectV2Module,
        RouterModule.forChild(routes),
        NuiSelectModule,
        NuiDialogModule,
        NuiDocsModule,
        NuiButtonModule,
        NuiMessageModule,
        NuiSelectModule,
        NuiPopoverModule,
        NuiTooltipModule,
        NuiDateTimePickerModule,
        NuiBusyModule,
        NuiSpinnerModule,
        NuiSelectV2Module,
        NuiMenuModule,
        NuiPopupModule,
        NuiTimeFrameBarModule,
        NuiTimeFramePickerModule,
        NuiIconModule,
    ],
    declarations: [
        DialogContentExampleComponent,
        ComponentAsContentExampleComponent,
        ConfirmationDialogExampleComponent,
        DialogCustomClassExampleComponent,
        DialogDocsComponent,
        DialogTestComponent,
        DialogWithKeyboardExampleComponent,
        DialogPositionExampleComponent,
        DialogSeverityExampleComponent,
        DialogSizesExampleComponent,
        DialogInsideOverlayExampleComponent,
        DialogVisualTestComponent,
        HeaderButtonsExampleComponent,
        SimpleDialogExampleComponent,
        DialogWithStaticBackdropExampleComponent,
        DialogZIndexTestComponent,
        DialogInsideOverlayWithDateTimePickerExampleComponent,
        DialogActionBeforeClosureExampleComponent,
        DialogAfterOpenedExampleComponent,
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
    entryComponents: [DialogContentExampleComponent],
})
export class DialogModule {
}
