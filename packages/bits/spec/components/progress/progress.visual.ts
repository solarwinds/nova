import { browser, by, element } from "protractor";

import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { ButtonAtom } from "../button/button.atom";

const name: string = "Progress";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera,
        startProgressBasic: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("progress/progress-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        startProgressBasic = new ButtonAtom(element(by.id("nui-demo-start-basic-progress")));
        
        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await startProgressBasic.click();
        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 100000);
});
