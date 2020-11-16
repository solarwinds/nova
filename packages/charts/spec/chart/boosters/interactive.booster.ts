import { by } from "protractor";
import { ILocation } from "selenium-webdriver";

import { ChartAtom } from "../atoms/chart.atom";

export class InteractiveBooster {
    public static async hover(chart: ChartAtom, location: ILocation): Promise<void> {
        const layer = await chart.getLayer("rendering-area");
        const element = layer ? layer.element(by.className("mouse-interactive-area")) : chart.getElement();
        return chart.hover(element, location);
    }
}
