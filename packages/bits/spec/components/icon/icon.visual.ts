import { percySnapshot } from "@percy/protractor";
import fs from "fs";
import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { IconAtom } from "../icon/icon.atom";

const name: string = "Icon";

fdescribe("Visual tests: Icon", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let regionSize: any,
        iconBasic: IconAtom;

    beforeEach(async () => {
        await Helpers.prepareBrowser("icon/icon-visual-test");

        regionSize = {left: 0, top: 0, width: 230, height: 150};
        iconBasic = Atom.find(IconAtom, "nui-icon-test-basic-usage");
    });

    afterAll(async () => {
    });

    it("Default look", async () => {
        await iconBasic.hover();
        await percySnapshot(`All ${name}s`);
        /**
         * "Any" is used here because of a mistake in typings delivered by Applitools (checkRegion() method parameters
         * are declared in different and incorrect order).
         */
        // const el1: ElementFinder = element(by.tagName("body"));
        // const png = await (iconBasic.getElement()).takeScreenshot();
        // fs.writeFileSync("./spec/icon.png", png, {encoding: "base64"});
        // await percySnapshot(`${name} is hovered`);
        // await eyes.checkRegion(regionSize, "Icon is hovered" as any);

        await Helpers.switchDarkTheme("on");
        await percySnapshot(`The ${name} Dark Theme Look`);

    }, 100000);
});
