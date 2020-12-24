import { browser, by, element } from "protractor";

import { Animations, Helpers } from "../../helpers";
import { ButtonAtom } from "../button/button.atom";

describe("Visual tests: Progress", async () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any,
        startProgressBasic: ButtonAtom;

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("progress/progress-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        startProgressBasic = new ButtonAtom(element(by.id("nui-demo-start-basic-progress")));
    });

    afterEach(async () => {
        await eyes.abortIfNotClosed();
    });

    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Progress");

        await startProgressBasic.click();
        await eyes.checkWindow("Default");

        await Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    });
});
