// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { FreetypeQueryBuilderAtom } from "./freetype-query-builder.atom";
import { Atom } from "../../atom";
import { Animations, Helpers, test } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Freetype Query Builder";

test.describe(`Visual tests: ${name}`, () => {
    const longInputValue =
        "a a1 123 a a1 123 a a1 123 a a1 123 a a1 123 a a1a12dsdfsfdsfdsfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdsdfsdfsdfdfsdf 1231";
    const extraLongInputValue =
        longInputValue + longInputValue + longInputValue;
    const threeTypeValuesInput = "a a1 123";
    const threeTypeValueWithNotifWarning = "a a1b2c 123";
    const threeTypeValueWithNotifError = "abcdef a1 123";

    let example1: FreetypeQueryBuilderAtom;
    let example2: FreetypeQueryBuilderAtom;
    let example3: FreetypeQueryBuilderAtom;
    let example4: FreetypeQueryBuilderAtom;
    let example5: FreetypeQueryBuilderAtom;
    let example6: FreetypeQueryBuilderAtom;
    let example7: FreetypeQueryBuilderAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser(
            "freetype-query/freetype-query-builder-visual-test",
            page
        );
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        example1 = Atom.find<FreetypeQueryBuilderAtom>(FreetypeQueryBuilderAtom, "example1");
        example2 = Atom.find<FreetypeQueryBuilderAtom>(FreetypeQueryBuilderAtom, "example2");
        example3 = Atom.find<FreetypeQueryBuilderAtom>(FreetypeQueryBuilderAtom, "example3");
        example4 = Atom.find<FreetypeQueryBuilderAtom>(FreetypeQueryBuilderAtom, "example4");
        example5 = Atom.find<FreetypeQueryBuilderAtom>(FreetypeQueryBuilderAtom, "example5");
        example6 = Atom.find<FreetypeQueryBuilderAtom>(FreetypeQueryBuilderAtom, "example6");
        example7 = Atom.find<FreetypeQueryBuilderAtom>(FreetypeQueryBuilderAtom, "example7");
    });

    test.skip(`${name} visual test`, async ({ page }) => {
        const camera = new Camera().loadFilm(page, name, "Bits");
        await camera.turn.on();

        await example1.type(longInputValue);
        await Helpers.pressKey("ArrowDown");
        await camera.say.cheese("Example 1");

        await example2.type(extraLongInputValue);
        await Helpers.pressKey("Escape");
        await example2.getLocator().evaluate((el) => el.scrollTo({ top: el.scrollHeight }));
        await camera.say.cheese("Example 2");

        await example3.type(threeTypeValuesInput);
        await Helpers.pressKey("Home");
        await Helpers.pressKey("ArrowDown");
        await camera.say.cheese("Example 3");

        await example4.type(threeTypeValueWithNotifError);
        await Helpers.pressKey("ArrowDown");
        await camera.say.cheese("Example 4");

        await example5.type(threeTypeValueWithNotifWarning);
        await Helpers.pressKey("ArrowLeft", 5);
        await Helpers.pressKey("ArrowDown", 2);
        await camera.say.cheese("Example 5");

        await example6.type(threeTypeValueWithNotifError);
        await Helpers.pressKey("ArrowDown");
        await camera.say.cheese("Example 6");

        await example7.hover();
        await camera.say.cheese("Example 7");

        await camera.turn.off();
    });
});
