import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-scales",
    templateUrl: "./chart-docs-scales.component.html",
})
export class ChartDocsScalesComponent {
    scaleDefinition = `const xScale = new LinearScale();
...`;

    scaleWithId = `const yScale = new LinearScale("percentile");
...`;

}
