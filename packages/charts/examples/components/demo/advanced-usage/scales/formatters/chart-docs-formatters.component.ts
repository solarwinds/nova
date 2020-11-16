import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-formatters",
    templateUrl: "./chart-docs-formatters.component.html",
})
export class ChartDocsFormattersComponent {
    public customTicks = `scales.x.formatters.tick = (value: Number) => (Number(value).toFixed(2));
scales.y.formatters.tick = (value: Number) => \`> $\{value\} %\`;
...`;
}
