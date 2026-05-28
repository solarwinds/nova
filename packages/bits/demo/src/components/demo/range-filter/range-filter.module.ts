import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiMessageModule,
    NuiRangeFilterModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    RangeFilterBasicExampleComponent,
    RangeFilterDocsExampleComponent,
    RangeFilterGuidesExampleComponent,
    RangeFilterVerticalExampleComponent,
} from "./index";
import { getDemoFiles } from "../../../static/demo-files-factory";

const routes = [
    {
        path: "",
        component: RangeFilterDocsExampleComponent,
        data: {
            srlc: {
                stage: SrlcStage.beta,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "basic",
        component: RangeFilterBasicExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "guides",
        component: RangeFilterGuidesExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
    {
        path: "vertical",
        component: RangeFilterVerticalExampleComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiDocsModule,
        NuiMessageModule,
        NuiRangeFilterModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        RangeFilterBasicExampleComponent,
        RangeFilterDocsExampleComponent,
        RangeFilterGuidesExampleComponent,
        RangeFilterVerticalExampleComponent,
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useValue: getDemoFiles("range-filter"),
        },
    ],
    exports: [RouterModule],
})
export default class RangeFilterModule {}
