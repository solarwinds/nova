import { Component } from "@angular/core";

@Component({
    selector: "nui-chart-docs-layout",
    templateUrl: "./chart-docs-layout.component.html",
    styleUrls: ["./chart-docs-layout.component.less"],
})
export class ChartDocsLayoutComponent {
    hasLegend = true;
    hasLegendBottom = true;
    hasAxisLabelLeft = true;
    hasAxisLabelRight = true;
    hasAxisLabelBottom = true;
    intro = `
    <div class="nui-chart-layout">
        <div class="chart">Chart</div>
    `;
    outro = `</div>`;
    overlay = `<div class="nui-chart-layout">
    <div class="chart has-overlay">
        ...
        <div class="overlay"> ... </div>
    </div>
</div>`;

    public getCodeLine(className: string, text: string): string {
        return `<div class="${className}">${text}</div>`;
    }
}
