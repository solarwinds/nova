import { by } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { ImageAtom } from "../public_api";

describe("USERCONTROL image", () => {
    let floatImage: ImageAtom;
    let marginImage: ImageAtom;
    let customSizeImage: ImageAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("image/image-test");
        floatImage = Atom.find(ImageAtom, "image-float");
        marginImage = Atom.find(ImageAtom, "image-margin");
        customSizeImage = Atom.find(ImageAtom, "image-svg-auto-dimensions");
    });

    it("should render images with predefined float", async () => {
        expect(await floatImage.getFloatings()).toEqual("right");
    });

    it("should render images with predefined margins", async () => {
        expect(await marginImage.hasClass("nui-image__margin-centered")).toBe(true);
    });

    it("should render custom size images with correct dimensions", async () => {
        expect(await customSizeImage.getWidth()).toBe("100px");
        expect(await customSizeImage.getHeight()).toBe("100px");
    });

    it("should change svg dimensions to 'auto' if 'autoFill' input is used", async () => {
        const svg = customSizeImage.getElement().element(by.tagName("svg"));
        expect(await svg.getAttribute("height")).toEqual("100%");
        expect(await svg.getAttribute("width")).toEqual("100%");
        expect(await svg.getCssValue("height")).toEqual("100px");
        expect(await svg.getCssValue("width")).toEqual("100px");
    });
});
