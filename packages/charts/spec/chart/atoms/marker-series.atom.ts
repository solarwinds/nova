import { Atom } from "@solarwinds/nova-bits/sdk/atoms";
import { ElementFinder } from "protractor";

import { MarkerAtom } from "./marker.atom";
import { SeriesAtom } from "./series.atom";

export class MarkerSeriesAtom extends SeriesAtom {
    public async getMarkerCount(): Promise<number> {
        return Atom.findCount(MarkerAtom, this.root);
    }
    public getMarker(index: number): MarkerAtom {
        return Atom.findIn(MarkerAtom, this.root, index);
    }
}
