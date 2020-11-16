import { browser } from "protractor";

import { Helpers } from "../../helpers";

describe("Visual tests: Message", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("message/message-visual-test");
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Message");
        await eyes.checkWindow("Default");
        await eyes.close();
    });
});
