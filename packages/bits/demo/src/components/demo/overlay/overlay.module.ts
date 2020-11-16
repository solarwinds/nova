import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiCommonModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiIconModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiOverlayAdditionsModule,
    NuiOverlayModule,
    NuiSearchModule,
    NuiSelectV2Module,
    SrlcStage
} from "@solarwinds/nova-bits";

import {
    CustomConfirmationInsideDialogComponent,
    OverlayArrowExampleComponent,
    OverlayCustomContainerExampleComponent,
    OverlayCustomDialogComponent,
    OverlayCustomStylesExampleComponent,
    OverlayDocsComponent,
    OverlayPopupStylesExampleComponent,
    OverlayShowHideToggleExampleComponent,
    OverlaySimpleExampleComponent,
    OverlayTestComponent,
    OverlayViewportMarginExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: OverlayDocsComponent,
        data: {
            "srlc": {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: OverlaySimpleExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "with-popup-styles",
        component: OverlayPopupStylesExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "custom-styles",
        component: OverlayCustomStylesExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "arrow",
        component: OverlayArrowExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "custom-container",
        component: OverlayCustomContainerExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "toggle-examples",
        component: OverlayShowHideToggleExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "viewport-margin",
        component: OverlayViewportMarginExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "custom-dialog",
        component: OverlayCustomDialogComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "custom-confirmation-dialog",
        component: CustomConfirmationInsideDialogComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "overlay-test",
        component: OverlayTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiCommonModule,
        NuiSelectV2Module,
        NuiOverlayModule,
        NuiOverlayAdditionsModule,
        NuiMessageModule,
        NuiButtonModule,
        NuiExpanderModule,
        NuiDialogModule,
        NuiIconModule,
        ReactiveFormsModule,
        FormsModule,
        NuiCheckboxModule,
        NuiSearchModule,
        NuiDocsModule,
        NuiMenuModule,
        DragDropModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        OverlaySimpleExampleComponent,
        OverlayShowHideToggleExampleComponent,
        OverlayTestComponent,
        OverlayCustomStylesExampleComponent,
        OverlayCustomContainerExampleComponent,
        OverlayDocsComponent,
        OverlayViewportMarginExampleComponent,
        OverlayArrowExampleComponent,
        OverlayPopupStylesExampleComponent,
        OverlayCustomDialogComponent,
        CustomConfirmationInsideDialogComponent,
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
export class OverlayModule {
}
