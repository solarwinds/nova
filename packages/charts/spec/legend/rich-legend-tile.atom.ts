import { Atom } from "@nova-ui/bits/sdk/atoms";
import { by } from "protractor";

export class RichLegendTileAtom extends Atom {
    public static CSS_CLASS = "nui-rich-legend-tile";

    public async getValue(): Promise<string> {
        const valueElements = this.getElement().all(
            by.className("nui-rich-legend-tile__tilebox-value")
        );
        if ((await valueElements.count()) > 0) {
            return valueElements.first().getText();
        }

        // fall back to projected value
        return this.getElement().element(by.css("[value]")).getText();
    }

    public async getUnitLabel(): Promise<string> {
        const unitLabelElements = this.getElement().all(
            by.className("nui-rich-legend-tile__tilebox-unit")
        );
        if ((await unitLabelElements.count()) > 0) {
            return unitLabelElements.first().getText();
        }

        // fall back to projected unit label
        return this.getElement().element(by.css("[unitLabel]")).getText();
    }

    public async isMarkerVisible(): Promise<boolean> {
        const marker = this.getElement().element(
            by.className("nui-rich-legend-tile__point-marker")
        );
        return marker.isDisplayed();
    }

    public async isIconVisible(): Promise<boolean> {
        const icon = this.getElement().element(
            by.className("nui-rich-legend-tile__icon")
        );
        return icon.isDisplayed();
    }

    public async getBackgroundColor(): Promise<string> {
        return this.getElement()
            .element(by.className("nui-rich-legend-tile__tilebox"))
            .getCssValue("background-color");
    }
}
