import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import {
    DEMO_PATH_TOKEN,
    NuiBreadcrumbModule,
    NuiButtonModule,
    NuiDocsModule,
    SrlcStage,
} from "@nova-ui/bits";

import {
    BreadcrumbBasicExampleComponent,
    BreadcrumbCountriesSubviewComponent,
    BreadcrumbDocsExampleComponent,
    BreadcrumbFirstSubviewLevelComponent,
    BreadcrumbOfficesSubviewComponent,
    BreadcrumbSecondSubviewLevelComponent,
    BreadcrumbSingleCountryComponent,
    BreadcrumbVisualTestComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: BreadcrumbDocsExampleComponent,
        data: {
            breadcrumb: "Root",
            srlc: {
                stage: SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
        children: [
            {
                path: "countries",
                component: BreadcrumbCountriesSubviewComponent,
                data: {
                    breadcrumb: "Countries",
                    url: "https://tesla.com",
                    showThemeSwitcher: true,
                },
                children: [
                    {
                        path: "usa",
                        component: BreadcrumbSingleCountryComponent,
                        data: {
                            breadcrumb: "USA",
                            showThemeSwitcher: true,
                        },
                    },
                    {
                        path: "ukraine",
                        component: BreadcrumbSingleCountryComponent,
                        data: {
                            breadcrumb: "Ukraine",
                            showThemeSwitcher: true,
                        },
                    },
                ],
            },
            {
                path: "offices",
                component: BreadcrumbOfficesSubviewComponent,
                data: {
                    breadcrumb: "Offices",
                    showThemeSwitcher: true,
                },
            },
        ],
    },
    {
        path: "breadcrumb-visual-test",
        component: BreadcrumbVisualTestComponent,
        data: {
            srlc: {
                hideIndicator: true,
            },
            breadcrumb: "Root",
        },
        children: [
            {
                path: "first-subroute",
                component: BreadcrumbFirstSubviewLevelComponent,
                data: {
                    breadcrumb: "First Level",
                    srlc: {
                        hideIndicator: true,
                    },
                },
                children: [
                    {
                        path: "second-subroute",
                        component: BreadcrumbSecondSubviewLevelComponent,
                        data: {
                            breadcrumb: "Second Level",
                            srlc: {
                                hideIndicator: true,
                            },
                        },
                    },
                ],
            },
        ],
    },
];

@NgModule({
    imports: [
        NuiDocsModule,
        NuiBreadcrumbModule,
        NuiButtonModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        BreadcrumbDocsExampleComponent,
        BreadcrumbBasicExampleComponent,
        BreadcrumbCountriesSubviewComponent,
        BreadcrumbSingleCountryComponent,
        BreadcrumbOfficesSubviewComponent,
        BreadcrumbVisualTestComponent,
        BreadcrumbFirstSubviewLevelComponent,
        BreadcrumbSecondSubviewLevelComponent,
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
export class BreadcrumbModule {}
