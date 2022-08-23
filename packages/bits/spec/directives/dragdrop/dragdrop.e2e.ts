import { browser, by, element } from "protractor";

import { Helpers } from "../../helpers";

describe("USERCONTROL drag & drop", () => {
    beforeAll(async () => {
        await Helpers.prepareBrowser("dragdrop");
    });

    // Chromedriver still does not support html 5 drag/drop. 29.11.2017
    xit("should be able to drop object", async () => {
        const dragElement = element(by.id("nui-demo-src-object"));
        const dropElement = element(by.id("nui-demo-dest-object"));

        await browser
            .actions()
            .dragAndDrop(
                await dragElement.getWebElement(),
                await dropElement.getWebElement()
            )
            .perform();
    });
});
