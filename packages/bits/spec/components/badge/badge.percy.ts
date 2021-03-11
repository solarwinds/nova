import percySnapshot from "@percy/protractor";
import { by, element, ElementFinder } from "protractor";

import { Animations, Helpers } from "../../helpers";

const name: string = "Badge";

describe(`Visual tests: PERCY ${name}`, () => {

    beforeAll(async () => {
        await Helpers.prepareBrowser("common/badge/badge-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
    });

    afterAll(() => {

    });

    describe(`${name} - Test suite`, () => {
        const el1: ElementFinder = element(by.tagName("body"));

        it(`Default look`, async () => {
            await percySnapshot(`The ${name} Default Look`);
        });

        it(`Dark theme`, async () => {
            await Helpers.switchDarkTheme("on");
            await percySnapshot(`The ${name} Dark Theme Look`);
        });
    });
});
