import { Atom } from "@nova-ui/bits/sdk/atoms";
import { by, ElementFinder } from "protractor";

export class LasagnaAtom extends Atom {
    public static CSS_CLASS = "lasagna-container";
    private layerPrefix = "lasagna-layer-";

    public layer(name: string): Promise<ElementFinder | undefined> {
        const matchingLayers = this.getElement().all(by.className(`${this.layerPrefix}${name}`));
        return new Promise<ElementFinder | undefined>(resolve => {
            matchingLayers.count().then(count => {
                resolve(count > 0 ? matchingLayers.first() : undefined);
            });
        });
    }
}
