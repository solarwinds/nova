import { Component } from "@angular/core";

@Component({
    selector: "nui-tabgroup-example",
    templateUrl: "./tabgroup-docs.example.component.html",
})
export class TabgroupDocsExampleComponent {
    public tabsRouteConfig: string = `
    children: [
        {
            path: "",
            redirectTo: "tab-settings",
            // pathMatch strategy is used here because we redirect to another route from an empty path.
            // For more info please refer to these docs: https://angular.io/api/router/Route#pathMatch
            pathMatch: "full",
        },
        {
            path: "tab-settings",
            component: TabContentSettingsExampleComponent,
        },
        {
            path: "tab-statistics",
            component: TabContentStatisticsExampleComponent,
        },
        {
            path: "tab-about",
            component: TabContentAboutExampleComponent,
        },
    ],`;
}
