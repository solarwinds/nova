import { ElementFinder } from "protractor";

import { Atom } from "../../atom";

export class ContentAtom extends Atom {
    public static CSS_CLASS = "nui-content";

    public hasScrollbar = async (element?: ElementFinder): Promise<boolean> => {
        if (!element) {
            throw new Error("element is not defined");
        }
        return element
            .getAttribute("clientHeight")
            .then(async (clientHeight: string) =>
                element
                    .getAttribute("scrollHeight")
                    .then(
                        (scrollHeight: string) =>
                            parseInt(scrollHeight, 10) >
                            parseInt(clientHeight, 10)
                    )
            );
    };
}
