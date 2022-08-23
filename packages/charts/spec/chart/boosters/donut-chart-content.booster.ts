import { by, ElementFinder } from "protractor";

import { ChartAtom } from "../atoms/chart.atom";

export class DonutChartContentBooster {
    public static getContentElement(chart: ChartAtom): ElementFinder {
        return chart
            .getElement()
            .element(by.xpath("//following-sibling::nui-chart-donut-content"));
    }

    public static async getContent(chart: ChartAtom): Promise<string> {
        return this.getContentElement(chart).getText();
    }
}
