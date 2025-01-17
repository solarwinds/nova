import { browser, Key } from "protractor";

import { FreetypeQueryBuilderAtom } from "./freetype-query-builder.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Freetype Query Builder";

describe("FreeTypeQueryBuilder", () => {
    let camera: Camera;
    const longInputValue =
        "a a1 123 a a1 123 a a1 123 a a1 123 a a1 123 a a1a12dsdfsfdsfdsfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdsdfsdfsdfdfsdf 1231";
    const extraLongInputValue =
        longInputValue + longInputValue + longInputValue;
    const threeTypeValuesInput = "a a1 123";
    const threeTypeValueWithNotifInfo = "a a1 1234";
    const threeTypeValueWithNotifWarning = "a a1b2c 123";
    const threeTypeValueWithNotifError = "abcdef a1 123";

    let example1: FreetypeQueryBuilderAtom;
    let example2: FreetypeQueryBuilderAtom;
    let example3: FreetypeQueryBuilderAtom;
    let example4: FreetypeQueryBuilderAtom;
    let example5: FreetypeQueryBuilderAtom;
    let example6: FreetypeQueryBuilderAtom;
    let example7: FreetypeQueryBuilderAtom;

    beforeEach(async () => {
        await Helpers.prepareBrowser(
            "freetype-query/freetype-query-builder-visual-test"
        );

        example1 = Atom.find(FreetypeQueryBuilderAtom, "example1");
        example2 = Atom.find(FreetypeQueryBuilderAtom, "example2");
        example3 = Atom.find(FreetypeQueryBuilderAtom, "example3");
        example4 = Atom.find(FreetypeQueryBuilderAtom, "example4");
        example5 = Atom.find(FreetypeQueryBuilderAtom, "example5");
        example6 = Atom.find(FreetypeQueryBuilderAtom, "example6");
        example7 = Atom.find(FreetypeQueryBuilderAtom, "example7");

        camera = new Camera().loadFilm(browser, name);
    });

    xit(`${name} visual test`, async () => {
        await camera.turn.on();

        await example1.type(longInputValue);
        await Helpers.pressKey(Key.ARROW_DOWN)
        await camera.say.cheese("Example 1");

        await example2.type(extraLongInputValue)
        await Helpers.pressKey(Key.ESCAPE)
        await example2.scrollTo({ block: "end" });

        // await camera.say.cheese("Example 2");
        //
        // example3.type(threeTypeValuesInput).then(async () => {
        //     await Helpers.pressKey(Key.HOME);
        //     await Helpers.pressKey(Key.ARROW_DOWN);
        // });
        //
        // await camera.say.cheese("Example 3");
        //
        // example4
        //     .type(threeTypeValueWithNotifError)
        //     .then(async () => Helpers.pressKey(Key.ARROW_DOWN));
        //
        // await camera.say.cheese("Example 4");
        //
        // example5.type(threeTypeValueWithNotifWarning).then(() => {
        //     Helpers.pressKey(Key.ARROW_LEFT, 5);
        //     Helpers.pressKey(Key.ARROW_DOWN, 2);
        // });
        // await camera.say.cheese("Example 5");
        //
        // example6
        //     .type(threeTypeValueWithNotifError)
        //     .then(async () => Helpers.pressKey(Key.ARROW_DOWN));
        // await camera.say.cheese("Example 6");
        //
        // await example7.hover();
        // await camera.say.cheese("Example 7");
    });
});
