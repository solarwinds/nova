import { by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class OverlayContentAtom extends Atom {

    public static CSS_CLASS = "nui-overlay";

    private body = element(by.tagName("body"));

    public count = async (context?: ElementFinder): Promise<number> => await Atom.findCount(OverlayContentAtom, context || this.body);

}
