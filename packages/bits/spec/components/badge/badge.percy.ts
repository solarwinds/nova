import percySnapshot from "@percy/protractor";
import { browser } from "protractor";
import fs from "fs";

import { Animations, Helpers } from "../../helpers";

const name: string = "Badge";
const snapPath: string = "./spec/.snapshots/";

describe(`Visual tests: PERCY ${name}`, () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("common/badge/badge-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);

        // if (!fs.existsSync(snapPath)) {
        //     fs.mkdirSync(snapPath);
        // }
    });

    afterAll(() => {

    });

    describe(`${name} - Test suite`, () => {
        it(`${name} test`, async () => {
            await percySnapshot(`The ${name} Default Look`);
    
            await Helpers.switchDarkTheme("on");
            await percySnapshot(`The ${name} Dark Theme Look`);
            // const png = await browser.takeScreenshot();
            // fs.writeFileSync(snapPath + "badge-main.png", png, {encoding: "base64"});

            // await Helpers.switchDarkTheme("on");
            // fs.writeFileSync(snapPath + "badge-2.png", await browser.takeScreenshot(), {encoding: "base64"});
        });
    });
});
