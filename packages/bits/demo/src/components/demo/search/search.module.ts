import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiButtonModule,
    NuiCommonModule,
    NuiDocsModule,
    NuiSearchModule,
    NuiSelectModule,
    NuiTextboxModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    SearchBasicExampleComponent,
    SearchDocsExampleComponent,
    SearchFocusChangeExampleComponent,
    SearchInputChangeExampleComponent,
    SearchOnSearchCancelExampleComponent,
    SearchPlaceholderExampleComponent,
    SearchTestExampleComponent,
    SearchVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: SearchDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "search-test",
        component: SearchTestExampleComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "search-visual-test",
        component: SearchVisualTestComponent,
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
        NuiSearchModule,
        NuiTextboxModule,
        NuiDocsModule,
        NuiCommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        NuiSelectModule,
    ],
    declarations: [
        SearchTestExampleComponent,
        SearchBasicExampleComponent,
        SearchDocsExampleComponent,
        SearchFocusChangeExampleComponent,
        SearchInputChangeExampleComponent,
        SearchOnSearchCancelExampleComponent,
        SearchPlaceholderExampleComponent,
        SearchVisualTestComponent,
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
export class SearchModule {
}
