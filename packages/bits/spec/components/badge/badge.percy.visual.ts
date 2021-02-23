import { percySnapshot } from "@percy/protractor";
import fs from "fs";
import { browser, by, element, ElementFinder, ExpectedConditions, WebElement } from "protractor";

import { Animations, Helpers } from "../../helpers";

const name: string = "Badge";
const snapPath: string = "./spec/.snapshots/";

fdescribe(`Visual tests: PERCY ${name}`, () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("common/badge/badge-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        // if (!fs.existsSync(snapPath)) {
        //     fs.mkdirSync(snapPath);
        // }
    });

    afterAll(() => {

    });

    describe(`${name} Test suite`, () => {
        const el1: ElementFinder = element(by.tagName("body"));

        it(`Default look`, async () => {
            await percySnapshot(`The ${name} Default Look`);
            // const png = await (el1).takeScreenshot();
            // fs.writeFileSync("./spec/badge.png", png, {encoding: "base64"});
            // const png = await (el1).takeScreenshot();
            // fs.writeFileSync(snapPath + "badge-main.png", png, {encoding: "base64"});
        });

        it(`Dark theme`, async () => {
            await Helpers.switchDarkTheme("on");
            await percySnapshot(`The ${name} Dark Theme Look`);
            // const png = await (el1).takeScreenshot();
            // fs.writeFileSync(snapPath + "badge-main-2.png", png, {encoding: "base64"});
            // await Helpers.switchDarkTheme("off");
        });
    });
});
