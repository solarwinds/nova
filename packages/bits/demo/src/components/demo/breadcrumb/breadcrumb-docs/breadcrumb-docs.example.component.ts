import { Component } from "@angular/core";

@Component({
    selector: "nui-breadcrumb-docs-example",
    templateUrl: "./breadcrumb-docs.example.component.html",
})
export class BreadcrumbDocsExampleComponent {
    public routesExample = `{
        path: "breadcrumb",
        component: components.BreadcrumbDocsExampleComponent,
        data: { breadcrumb: "Root" },
        children: [
            {
                path: "first-subroute",
                component: components.BreadcrumbFirstSubviewComponent,
                data: {
                    breadcrumb: "First Level",
                    url: "https://spacex.com"
                },
                children: [
                    {
                        path: "second-subroute",
                        component: components.BreadcrumbSecondSubviewComponent,
                        data: { breadcrumb: "Second Level" },
                    },
                ],
            },
        ],
    }`;
}
