import { CdkTreeModule } from "@angular/cdk/tree";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiBusyModule,
    NuiButtonModule,
    NuiCheckboxModule,
    NuiCommonModule,
    NuiDialogModule,
    NuiDocsModule,
    NuiExpanderModule,
    NuiIconModule,
    NuiMenuModule,
    NuiPaginatorModule,
    NuiRepeatModule,
    NuiSpinnerModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    TreeBasicExampleComponent,
    TreeCheckboxExampleComponent,
    TreeDialogContentExampleComponent,
    TreeDocsExampleComponent,
    TreeLazyExampleComponent,
    TreeLeafPaginationExampleComponent,
    TreeLoadMoreExampleComponent,
    TreeShowAllDialogExampleComponent,
    TreeStylingExampleComponent,
    TreeVisualTestComponent,
    TreeWithAdditionalContentExampleComponent
} from "./index";
import { TreeCheckboxLazyComponent } from "./tree-checkbox-lazy/tree-checkbox-lazy.component";
import { TreeBasicTestComponent } from "./tree-visual-test/tree-basic-test/tree-basic-test.component";
import { TreeCheckboxTestComponent } from "./tree-visual-test/tree-checkbox-test/tree-checkbox-test.component";
import { TreePaginatorTestComponent } from "./tree-visual-test/tree-paginator-test/tree-paginator-test.component";

const routes = [
    {
        path: "",
        component: TreeDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: TreeBasicExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "lazy",
        component: TreeLazyExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "leaf-pagination",
        component: TreeLeafPaginationExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "show-all-dialog",
        component: TreeShowAllDialogExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "styling",
        component: TreeStylingExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "with-additional-content",
        component: TreeWithAdditionalContentExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "checkbox",
        component: TreeCheckboxExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "checkbox-lazy",
        component: TreeCheckboxLazyComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "load-more",
        component: TreeLoadMoreExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "tree-visual-test",
        component: TreeVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        CdkTreeModule,
        NuiDocsModule,
        NuiCommonModule,
        NuiIconModule,
        NuiButtonModule,
        NuiExpanderModule,
        NuiButtonModule,
        NuiMenuModule,
        NuiSpinnerModule,
        NuiCheckboxModule,
        NuiPaginatorModule,
        NuiDialogModule,
        NuiRepeatModule,
        NuiBusyModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        TreeBasicExampleComponent,
        TreeDocsExampleComponent,
        TreeStylingExampleComponent,
        TreeVisualTestComponent,
        TreeLazyExampleComponent,
        TreeCheckboxExampleComponent,
        TreeLeafPaginationExampleComponent,
        TreeWithAdditionalContentExampleComponent,
        TreeShowAllDialogExampleComponent,
        TreeDialogContentExampleComponent,
        TreeLoadMoreExampleComponent,
        TreeBasicTestComponent,
        TreeCheckboxTestComponent,
        TreePaginatorTestComponent,
        TreeCheckboxLazyComponent,
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
    entryComponents: [
        TreeDialogContentExampleComponent,
    ],
})
export class TreeModule {
}

