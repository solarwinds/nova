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

import { browser, by, ElementFinder } from "protractor";
import { ILocation } from "selenium-webdriver";

import { Atom } from "@nova-ui/bits/sdk/atoms";
import { IAtomClass } from "@nova-ui/bits/sdk/atoms/atom";

import { LasagnaAtom } from "./lasagna.atom";
import { MarkerSeriesAtom } from "./marker-series.atom";
import { SeriesAtom } from "./series.atom";

export class ChartAtom extends Atom {
    public static CSS_CLASS = "nui-chart";
    private SERIES_CLASS = "data-series-container";

    private grid: ElementFinder; // grid container
    private lasagna: LasagnaAtom;

    constructor(rootElement: ElementFinder) {
        super(rootElement);
        this.grid = rootElement.element(by.className("nui-chart-grid"));
        this.lasagna = Atom.findIn(LasagnaAtom, this.grid);
    }
    public async getLayer(name: string): Promise<ElementFinder[]> {
        return this.lasagna.layer(name);
    }

    public async getNumberOfVisibleBackgroundSeries(): Promise<number> {
        return await this.getNumberOfVisibleSeriesInLayer("background");
    }

    public async getNumberOfVisibleDataSeries(): Promise<number> {
        return await this.getNumberOfVisibleSeriesInLayer("data");
    }

    public async getNumberOfSeriesWithMarkers(): Promise<number> {
        return await this.getNumberOfVisibleSeriesInLayer("foreground");
    }

    public async getNumberOfVisibleSeriesInLayer(
        layerName: string
    ): Promise<number> {
        const [layer] = await this.getLayer(layerName);
        if (!layer) {
            return 0;
        }
        return await layer
            .all(by.className(this.SERIES_CLASS))
            .filter(this.isVisible)
            .count();
    }

    public async getMarkerSeriesById(
        seriesId: string
    ): Promise<MarkerSeriesAtom | undefined> {
        const [layer] = await this.getLayer("foreground");
        return layer
            ? Atom.findIn(
                  MarkerSeriesAtom,
                  layer.element(by.id(`foreground-${seriesId}`))
              )
            : undefined;
    }

    public async getAllVisibleDataSeries<T extends SeriesAtom>(
        atomClass: IAtomClass<T>
    ): Promise<T[]> {
        return this.getAllVisibleSeriesInLayer("data", atomClass);
    }

    public async getAllVisibleBackgroundSeries<T extends SeriesAtom>(
        atomClass: IAtomClass<T>
    ): Promise<T[]> {
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
        const visibleSeries = layer
            .all(Atom.getLocator(atomClass))
            .filter(async (e) => this.isVisible(e));
        const seriesIds: string[] = await visibleSeries.map(
            (series: ElementFinder | undefined) => series?.getAttribute("id")
        );
        return seriesIds.map((seriesId: string) =>
            Atom.findIn(atomClass, layer.element(by.id(seriesId)))
        );
    }

    public async getDataSeriesById<T extends SeriesAtom>(
        atomClass: IAtomClass<T>,
        seriesId: string
    ): Promise<T | undefined> {
        return this.getSeriesInLayerById(atomClass, "data", seriesId);
    }

    public async getBackgroundSeriesById<T extends SeriesAtom>(
        atomClass: IAtomClass<T>,
        seriesId: string
    ): Promise<T | undefined> {
        return this.getSeriesInLayerById(atomClass, "background", seriesId);
    }

    public async getSeriesInLayerById<T extends SeriesAtom>(
        atomClass: IAtomClass<T>,
        layerName: string,
        seriesId: string
    ): Promise<T | undefined> {
        const [layer] = await this.getLayer(layerName);
        if (layer) {
            return Atom.findIn(
                atomClass,
                layer.element(by.id(`${layerName}-${seriesId}`))
            );
        }
    }

    public async clickElementByCoordinates(
        coordinates: ILocation
    ): Promise<void> {
        return browser.actions().mouseMove(coordinates).click().perform();
    }

    private async isVisible(el: ElementFinder) {
        const visibility = await el.getCssValue("visibility");
        const opacity = parseFloat(await el.getCssValue("opacity"));
        return visibility !== "hidden" && opacity > 0;
    }
}
