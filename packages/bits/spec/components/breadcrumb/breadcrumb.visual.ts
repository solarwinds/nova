import { browser, by, element, ElementFinder } from "protractor";

import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Breadcrumb";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let showSecondViewButton: ElementFinder;
    let showThirdViewButton: ElementFinder;

    beforeAll(async () => {
        showSecondViewButton = element(by.id("nui-demo-breadcrumb-show-second-view"));
        showThirdViewButton = element(by.id("nui-demo-breadcrumb-show-third-view"));

        await Helpers.prepareBrowser("breadcrumb/breadcrumb-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await showSecondViewButton.click();
        await showThirdViewButton.click();
        await camera.say.cheese(`Default breadcrumb styles`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");

        await camera.turn.off();
    }, 100000);
});
