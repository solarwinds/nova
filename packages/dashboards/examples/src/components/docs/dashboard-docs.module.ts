import { Apollo } from "apollo-angular";
import { HttpLink } from "apollo-angular/http";
import { InMemoryCache } from "@apollo/client/core";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiMessageModule } from "@nova-ui/bits";




import { APOLLO_API_NAMESPACE } from "./types";

const COUNTRIES_API = "https://countries-274616.ew.r.appspot.com/";

const exampleRoutes: Routes = [
    {
        path: "overview",
        loadChildren: async () => import("components/docs/overview/overview.module").then(m => m.OverviewModule),
    },
    {
        path: "tutorials",
        loadChildren: async () => import("components/docs/tutorials/tutorials.module").then(m => m.TutorialsModule),
    },
    {
        path: "widget-types",
        loadChildren: async () => import("components/docs/widget-types/widget-types.module").then(m => m.WidgetTypesModule),
    },
];

@NgModule({
    imports: [
        NuiDocsModule,
        NuiMessageModule,
        RouterModule.forChild(exampleRoutes),
    ],
    providers: [
        { provide: DEMO_PATH_TOKEN, useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/) },
    ],
})
export class DashboardDocsModule {
    constructor(httpLink: HttpLink,
                apollo: Apollo) {
        apollo.createNamed(APOLLO_API_NAMESPACE.COUNTRIES, {
            link: httpLink.create({ uri: COUNTRIES_API }),
            cache: new InMemoryCache(),
        });
    }
}
