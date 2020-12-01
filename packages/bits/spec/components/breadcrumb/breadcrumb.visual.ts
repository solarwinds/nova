import { browser, by, element, ElementFinder } from "protractor";

import { Animations, Helpers } from "../../helpers";

fdescribe("Visual tests: Breadcrumb", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any;
    let showSecondViewButton: ElementFinder;
    let showThirdViewButton: ElementFinder;

    beforeAll(() => {
        showSecondViewButton = element(by.id("nui-demo-breadcrumb-show-second-view"));
        showThirdViewButton = element(by.id("nui-demo-breadcrumb-show-third-view"));
    });

    beforeEach(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("breadcrumb/breadcrumb-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
    });

    afterAll(async () => {
        await eyes.abortIfNotClosed();
    });

    fit("Default look", async () => {
        await eyes.open(browser, "NUI", "Breadcrumb");
        await eyes.checkWindow("Default");

        await showSecondViewButton.click();
        await showThirdViewButton.click();
        await eyes.checkWindow("Breadcrumb in the third level");

        await eyes.close();
    }, 100000);
});
