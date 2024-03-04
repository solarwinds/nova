import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiMessageModule,
} from "@nova-ui/bits";

import { getDemoFiles } from "../../../../../demo-files-factory";
import { CartesianDocsComponent } from "./cartesian-docs.component";
import { CartesianWidgetExampleModule } from "./cartesian-widget-example/cartesian-widget-example.module";

const routes = [
    {
        path: "",
        component: CartesianDocsComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CartesianWidgetExampleModule,
        NuiMessageModule,
        NuiDocsModule,
    ],
    declarations: [CartesianDocsComponent],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useValue: getDemoFiles("cartesian"),
        },
    ],
})
export default class CartesianDocsModule {}
