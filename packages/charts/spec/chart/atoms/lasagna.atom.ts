import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { by, ElementFinder } from "protractor";

export class LasagnaAtom extends Atom {
    public static CSS_CLASS = "lasagna-container";
    private layerPrefix = "lasagna-layer-";

    public async layer(name: string): Promise<ElementFinder | null> {
        const matchingLayers = this.getElement().all(by.className(`${this.layerPrefix}${name}`));
        return await matchingLayers.count() > 0 ? matchingLayers.first() : null;
    }
}
