import { browser } from "protractor";
import { ILocation } from "selenium-webdriver";

import { ChartAtom } from "../atoms/chart.atom";

export class ZoomBooster {
    public static async zoom(chart: ChartAtom, from: ILocation, to: ILocation) {
        const target = await chart.getLayer("zoom-brush");
        if (target) {
            await browser.actions()
                .mouseMove(target, from)
                .perform();
            await browser.actions()
                .mouseDown()
                .mouseMove(target, to)
                .perform();
            return browser.actions()
                .mouseUp()
                .perform();
        }
    }
}
