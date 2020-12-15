import { Atom } from "@nova-ui/bits/sdk/atoms";
import { IAtomClass } from "@nova-ui/bits/sdk/atoms/atom";
import { browser, by, ElementFinder } from "protractor";
import { ILocation } from "selenium-webdriver";

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

    public async getLayer(name: string): Promise<ElementFinder | null> {
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

    public async getNumberOfVisibleSeriesInLayer(layerName: string) {
        const layer = await this.getLayer(layerName);
        return !layer ? 0 : layer
            .all(by.className(this.SERIES_CLASS))
            .filter(this.isVisible)
            .count();
    }

    public async getMarkerSeriesById(seriesId: string): Promise<MarkerSeriesAtom | undefined> {
        const layer = await this.getLayer("foreground");
        if (layer) {
            return Atom.findIn(MarkerSeriesAtom, layer.element(by.id(`foreground-${seriesId}`)));
        }
    }

    public async getAllVisibleDataSeries<T extends SeriesAtom>(atomClass: IAtomClass<T>): Promise<T[] | undefined> {
        return this.getAllVisibleSeriesInLayer("data", atomClass);
    }

    public async getAllVisibleBackgroundSeries<T extends SeriesAtom>(atomClass: IAtomClass<T>): Promise<T[]  | undefined> {
        return this.getAllVisibleSeriesInLayer("background", atomClass);
    }

    public async getAllVisibleSeriesInLayer<T extends SeriesAtom>(layerName: string, atomClass: IAtomClass<T>): Promise<T[] | undefined> {
        const layer: ElementFinder | null = await this.getLayer(layerName);
        if (layer) {
            const visibleSeries = layer.all(by.className(atomClass.CSS_CLASS)).filter(this.isVisible);
            const seriesIds = await visibleSeries.map<string>(async (series) => await series?.getAttribute("id"));
            return seriesIds.map(seriesId => Atom.findIn(atomClass, layer.element(by.id(seriesId))));
        }
    }

    public async getDataSeriesById<T extends SeriesAtom>(atomClass: IAtomClass<T>, seriesId: string): Promise<T | undefined> {
        return this.getSeriesInLayerById(atomClass, "data", seriesId);
    }

    public async getBackgroundSeriesById<T extends SeriesAtom>(atomClass: IAtomClass<T>, seriesId: string): Promise<T | undefined> {
        return this.getSeriesInLayerById(atomClass, "background", seriesId);
    }

    public async getSeriesInLayerById<T extends SeriesAtom>(atomClass: IAtomClass<T>, layerName: string, seriesId: string): Promise<T | undefined> {
        const layer = await this.getLayer(layerName);
        if (layer) {
            return Atom.findIn(atomClass, layer.element(by.id(`${layerName}-${seriesId}`)));
        }
    }

    public async clickElementByCoordinates(coordinates: ILocation): Promise<void> {
        return browser.actions().mouseMove(coordinates).click().perform();
    }

    private async isVisible(el: ElementFinder) {
        const visibility = await el.getCssValue("visibility");
        const opacity = parseFloat((await el.getCssValue("opacity")));
        return visibility !== "hidden" && opacity > 0;
    }
}
