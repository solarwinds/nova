import { by, ElementFinder } from "protractor";
import { ILocation } from "selenium-webdriver";

import { SeriesAtom } from "./series.atom";

export class LineSeriesAtom extends SeriesAtom {
    private path: ElementFinder = this.root.element(by.tagName("path"));

    public async getColor(): Promise<string> {
        return this.path.getAttribute("stroke");
    }

    public async getThickness(): Promise<string> {
        return this.path.getAttribute("stroke-width");
    }

    /*
     * This will work only for lines with `curveType: curveLinear`
     * It expects path to use absolute coordinates in `d` property
     */
    public async getPoints(): Promise<ILocation[]> {
        const d = await this.path.getAttribute("d");
        const dSegments = d // it will look like "M0,75L100,10L200,90L300,45L400,70"
            .substring(1) // trimming first "M"
            .split("L"); // splitting by "L"
        return dSegments.map((segment) => {
            const coords = segment.split(",");
            return {
                x: parseFloat(coords[0]),
                y: parseFloat(coords[1]),
            };
        });
    }
}
