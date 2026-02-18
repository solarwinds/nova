// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Locator } from "@playwright/test";

import { Atom, IAtomClass } from "@nova-ui/bits/sdk/atoms-playwright";

import { LasagnaAtom } from "./lasagna.atom";
import { MarkerSeriesAtom } from "./marker-series.atom";
import { SeriesAtom } from "./series.atom";

export class ChartAtom extends Atom {
    public static CSS_CLASS = "nui-chart";
    private SERIES_CLASS = "data-series-container";

    private grid: Locator; // grid container
    private lasagna: LasagnaAtom;

    constructor(rootElement: Locator) {
        super(rootElement);
        this.grid = rootElement.locator(".nui-chart-grid");
        this.lasagna = Atom.findIn<LasagnaAtom>(LasagnaAtom, this.grid);
    }

    public async getLayer(name: string): Promise<Locator[]> {
        return this.lasagna.layer(name);
    }

    public async getNumberOfVisibleBackgroundSeries(): Promise<number> {
        return this.getNumberOfVisibleSeriesInLayer("background");
    }

    public async getNumberOfVisibleDataSeries(): Promise<number> {
        return this.getNumberOfVisibleSeriesInLayer("data");
    }

    public async getNumberOfSeriesWithMarkers(): Promise<number> {
        return this.getNumberOfVisibleSeriesInLayer("foreground");
    }

    public async getNumberOfVisibleSeriesInLayer(layerName: string): Promise<number> {
        const [layer] = await this.getLayer(layerName);
        if (!layer) {
            return 0;
        }
        // NOTE: legacy logic filtered by computed visibility+opacity; keep it close by filtering opacity>0.
        const series = layer.locator(`.${this.SERIES_CLASS}`);
        const count = await series.count();
        let visibleCount = 0;
        for (let i = 0; i < count; i++) {
            if (await this.isVisible(series.nth(i))) {
                visibleCount++;
            }
        }
        return visibleCount;
    }

    public async getMarkerSeriesById(seriesId: string): Promise<MarkerSeriesAtom | undefined> {
        const [layer] = await this.getLayer("foreground");
        return layer
            ? Atom.findIn<MarkerSeriesAtom>(
                  MarkerSeriesAtom,
                  layer.locator(`#foreground-${seriesId}`),
                  true
              )
            : undefined;
    }

    public async getAllVisibleDataSeries<T extends SeriesAtom>(atomClass: IAtomClass<T>): Promise<T[]> {
        return this.getAllVisibleSeriesInLayer("data", atomClass);
    }

    public async getAllVisibleBackgroundSeries<T extends SeriesAtom>(atomClass: IAtomClass<T>): Promise<T[]> {
        return this.getAllVisibleSeriesInLayer("background", atomClass);
    }

    public async getAllVisibleSeriesInLayer<T extends SeriesAtom>(
        layerName: string,
        atomClass: IAtomClass<T>
    ): Promise<T[]> {
        const [layer] = await this.getLayer(layerName);
        if (!layer) {
            return [];
        }

        const selector = Atom.getSelector(atomClass);
        if (!selector) {
            return [];
        }

        const allSeries = layer.locator(selector);
        const count = await allSeries.count();
        const result: T[] = [];

        for (let i = 0; i < count; i++) {
            const candidate = allSeries.nth(i);
            if (await this.isVisible(candidate)) {
                result.push(Atom.findIn<T>(atomClass, candidate, true));
            }
        }

        return result;
    }

    public async getDataSeriesById<T extends SeriesAtom>(atomClass: IAtomClass<T>, seriesId: string): Promise<T | undefined> {
        return this.getSeriesInLayerById(atomClass, "data", seriesId);
    }

    public async getBackgroundSeriesById<T extends SeriesAtom>(atomClass: IAtomClass<T>, seriesId: string): Promise<T | undefined> {
        return this.getSeriesInLayerById(atomClass, "background", seriesId);
    }

    public async getSeriesInLayerById<T extends SeriesAtom>(atomClass: IAtomClass<T>, layerName: string, seriesId: string): Promise<T | undefined> {
        const [layer] = await this.getLayer(layerName);
        if (!layer) {
            return undefined;
        }

        return Atom.findIn(atomClass, layer.locator(`#${layerName}-${seriesId}`), true);
    }

    public async clickElementByCoordinates(coordinates: { x: number; y: number }): Promise<void> {
        await this.getLocator().page().mouse.click(coordinates.x, coordinates.y);
    }

    private async isVisible(el: Locator): Promise<boolean> {
        const visibility = await el.evaluate((e) => getComputedStyle(e).visibility);
        const opacity = await el.evaluate((e) => parseFloat(getComputedStyle(e).opacity || "0"));
        return visibility !== "hidden" && opacity > 0;
    }
}
