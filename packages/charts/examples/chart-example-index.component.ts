import { Component } from "@angular/core";

/**
 * Navigation helper
 * Temporary
 * TODO: Remove after documentation will be done
 */
@Component({
    selector: "nui-chart-example-index",
    template: `
        <h1>Prototypes</h1>
        <ul>
            <li *ngFor="let link of prototypes"><a [routerLink]="link.path">{{link.title}}</a></li>
        </ul>
        <nui-expander header="Archive">
            <ul>
                <li *ngFor="let link of archivedLinks"><a [routerLink]="link.path">{{link.title}}</a></li>
            </ul>
        </nui-expander>
        <hr>
        <h1>Visual Tests</h1>
        <h2>Chart Types</h2>
        <ul>
            <li *ngFor="let link of chartTypesVisualTests"><a [routerLink]="link.path">{{link.title}}</a></li>
        </ul>
        <h2>Other</h2>
        <ul>
            <li *ngFor="let link of otherVisualTests"><a [routerLink]="link.path">{{link.title}}</a></li>
        </ul>
    `,
})
export class ChartExampleIndexComponent {
    public prototypes = [
        {
            title: "Gauge",
            path: "/development/gauge",
        },
    ];

    public chartTypesVisualTests = [
        {
            title: "Area",
            path: "/chart-types/area/test",
        },
        {
            title: "Bar",
            path: "/chart-types/bar/test",
        },
        {
            title: "Bucketed Bar",
            path: "/chart-types/bucketed-bar/test",
        },
        {
            title: "Gauge",
            path: "/chart-types/gauge/visual-test",
        },
        {
            title: "Line",
            path: "/chart-types/line/visual-test",
        },
        {
            title: "Spark",
            path: "/chart-types/spark/test",
        },
        {
            title: "Status",
            path: "/chart-types/status/test",
        },
        {
            title: "Waterfall",
            path: "/chart-types/waterfall/test",
        },
    ];

    public otherVisualTests = [
        {
            title: "Legend",
            path: "/advanced-usage/legend/visual-test",
        },
        {
            title: "Popovers",
            path: "/plugins/popovers/visual-test",
        },
        {
            title: "Tooltips",
            path: "/plugins/tooltips/visual-test",
        },
        {
            title: "Thresholds",
            path: "/thresholds/summary-visual-test",
        },
        {
            title: "Timeframe Bar",
            path: "/time-frame-bar/test",
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
            path: "/development/bar/stacked-bar",
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
