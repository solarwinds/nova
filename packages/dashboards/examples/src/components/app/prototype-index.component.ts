import { Component } from "@angular/core";

/**
 * Navigation helper
 */
@Component({
    template: `
        <h1>Dashboard Developer Links</h1>
        <h2>Prototypes</h2>
        <ul>
            <li *ngFor="let link of prototypes">
                <a [routerLink]="link.path">{{ link.title }}</a>
            </li>
        </ul>
        <h2>Visual Tests</h2>
        <ul>
            <li *ngFor="let link of visualTests">
                <a [routerLink]="link.path">{{ link.title }}</a>
            </li>
        </ul>
    `,
})
export class DeveloperQuickLinksComponent {
    public prototypes = [
        {
            title: "Prototype 1",
            path: "/prototypes/prototype-1",
        },
        {
            title: "Table",
            path: "/prototypes/table",
        },
        {
            title: "Timeseries",
            path: "/prototypes/timeseries",
        },
        {
            title: "Many Widgets",
            path: "/prototypes/many-widgets",
        },
    ];

    public visualTests = [
        {
            title: "Overview",
            path: "/test/overview",
        },
        {
            title: "Proportional",
            path: "/test/proportional",
        },
        {
            title: "Configurator",
            path: "/test/configurator",
        },
        {
            title: "Timeseries",
            path: "/test/timeseries",
        },
        {
            title: "Table",
            path: "/test/table",
        },
        {
            title: "KPI",
            path: "/test/kpi",
        },
        {
            title: "Drilldown",
            path: "/test/drilldown",
        },
    ];
}
