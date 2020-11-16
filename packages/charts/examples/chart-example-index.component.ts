import { Component } from "@angular/core";

/**
 * Navigation helper
 * Temporary
 * TODO: Remove after documentation will be done
 */
@Component({
    selector: "nui-chart-example-index",
    template: `
        <h1>Chart Prototypes</h1>
        <ul>
            <li *ngFor="let link of links"><a [routerLink]="link.path">{{link.title}}</a></li>
        </ul>
        <nui-expander header="Archive">
            <ul>
                <li *ngFor="let link of archivedLinks"><a [routerLink]="link.path">{{link.title}}</a></li>
            </ul>
        </nui-expander>
    `,
})
export class ChartExampleIndexComponent {
    public links = [
        {
            title: "Chart Gauge",
            path: "/development/gauge/chart",
        },
        {
            title: "Component Gauge",
            path: "/development/gauge/component",
        },
    ];

    public archivedLinks = [
        {
            title: "Legend",
            path: "/advanced-usage/legend",
        },
        {
            title: "Core Chart",
            path: "/development/core/chart",
        },
        {
            title: "Data Point Selection",
            path: "/development/data-point-selection",
        },
        {
            title: "Stacked Vertical Bar",
            path: "/development/bar/stacked-vertical",
        },
        {
            title: "Data Point Popovers",
            path: "/development/popovers/data-point",
        },
        {
            title: "Popover Performance",
            path: "/development/popovers/performance",
        },
        {
            title: "Tooltips Performance",
            path: "/development/tooltips/performance",
        },
        {
            title: "Thresholds",
            path: "/development/thresholds",
        },
        {
            title: "Domain",
            path: "/development/core/domain",
        },
        {
            title: "Event Bus",
            path: "/development/core/event-bus",
        },
        {
            title: "Markers",
            path: "/development/core/markers",
        },
        {
            title: "Formatters",
            path: "/advanced-usage/scales/formatters/tick",
        },
        {
            title: "Axes label",
            path: "chart-types/line/axis-labels",
        },
        {
            title: "Chart Collection",
            path: "/development/collection",
        },
        {
            title: "Pie Renderer (ultra experimental)",
            path: "/development/pie",
        },
        {
            title: "Spark",
            path: "/development/spark",
        },
        {
            title: "Time Bands",
            path: "/development/time-bands/line",
        },
        {
            title: "Type switch - 1d",
            path: "/development/type-switch/1d",
        },
        {
            title: "Type switch - 2d",
            path: "/development/type-switch/2d",
        },
        {
            title: "Status",
            path: "/development/status",
        },
        {
            title: "Waterfall",
            path: "/development/status/waterfall",
        },
    ];
}
