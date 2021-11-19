import { ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class ContentAtom extends Atom {
    public static CSS_CLASS = "nui-content";

    public hasScrollbar = async (element?: ElementFinder): Promise<boolean> => {
        if (!element) {
            throw new Error("element is not defined");
        }
        const clientHeight = await element.getAttribute("clientHeight");
        const scrollHeight = await element.getAttribute("scrollHeight");
        return parseInt(scrollHeight, 10) > parseInt(clientHeight, 10);
    }
}
