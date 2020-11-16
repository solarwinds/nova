import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { by, ElementFinder } from "protractor";

import { RichLegendTileAtom } from "./rich-legend-tile.atom";

export class LegendSeriesAtom extends Atom {
    public static CSS_CLASS = "nui-legend-series";
    public richTile = Atom.findIn(RichLegendTileAtom, this.root.element(by.className(RichLegendTileAtom.CSS_CLASS)));

    private readonly deemphasizedOpacity = 0.3;
    private tile = this.root.element(by.className(`${LegendSeriesAtom.CSS_CLASS}__tile`));
    private checkbox = this.root.element(by.className(`${LegendSeriesAtom.CSS_CLASS}__checkbox-wrapper`));

    constructor(private root: ElementFinder) {
        super(root);
    }

    public async getPrimaryDescriptionText(): Promise<string> {
        return this.root.element(by.className("description-primary")).getText();
    }

    public async getSecondaryDescriptionText(): Promise<string> {
        return this.root.element(by.className("description-secondary")).getText();
    }

    public async getProjectedDescriptionText(): Promise<string> {
        return this.root.element(by.css("[description]")).getText();
    }

    public clickTile = async (): Promise<void> => this.tile.click();

    public hoverTile = async (): Promise<void> => this.hover(this.tile);

    public isTileVisible = async (): Promise<boolean> => this.tile.isDisplayed();

    public isCheckboxVisible = async (): Promise<boolean> => this.checkbox.isDisplayed();

    public async isCheckboxChecked(): Promise<boolean> {
        const elementClassList = await this.checkbox.getAttribute("class");
        return elementClassList.includes("nui-legend-series__checkbox--checked");
    }

    public isActive = async (): Promise<boolean> => this.hasClass("inverse");

    public async isDeemphasized(): Promise<boolean> {
        const deemphasizedElements = this.root.all(by.className(`${LegendSeriesAtom.CSS_CLASS}--state-deemphasized`));
        if (await deemphasizedElements.count() === 0) {
            return false;
        }

        return parseFloat(await deemphasizedElements.first().getCssValue("opacity")) === this.deemphasizedOpacity;
    }

    public async isDescriptionDeemphasized(): Promise<boolean> {
        return parseFloat(await this.root.element(by.className("description-container")).getCssValue("opacity")) === this.deemphasizedOpacity;
    }
}
