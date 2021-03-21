import { browser } from "protractor";

import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { EyesLens } from "../../virtual-camera/EyesLens";

const testName: string = "Badge";
let camera: Camera;
let eyes: EyesLens;

fdescribe(`Visual tests: ${testName}`, () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("common/badge/badge-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        camera = new Camera().loadFilm(browser, testName);
        eyes = new EyesLens(browser, camera["cameraSettings"].currentSettings);
    });

    describe(`${testName} - Test suite`, () => {
        it(`${testName} test`, async () => {
            // await eyes.cameraON();

            // await eyes.takeSnapshot("cbhsdjcb djsh");
            await camera.turn.on();
            // await percySnapshot(`The ${testName} Default Look`);
            await camera.say.cheese(`${testName} - The Default Look`);
    
            await Helpers.switchDarkTheme("on");
            await camera.be.responsive([800, 640]);
            await camera.say.cheese("23432dwe");

            await camera.be.defaultResponsive();
            await camera.say.cheese("vndfsivndfksj");

            await camera.turn.off();

            // await eyes.cameraOFF();
        }, 200000);
    });
});
