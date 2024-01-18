import {
    BreadcrumbBasicExampleComponent,
    BreadcrumbCountriesSubviewComponent,
    BreadcrumbOfficesSubviewComponent,
    BreadcrumbSingleCountryComponent,
} from "./breadcrumb-basic.example.component";

export const ROUTES = [
    {
        path: "",
        component: BreadcrumbBasicExampleComponent,
        data: {
            breadcrumb: "Root",
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
]
