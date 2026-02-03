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
import { expect, Helpers, test } from "../../setup";

test.describe("USERCONTROL freetype-query-builder >", () => {
    const threeTypeInput = "a a1 123";
    let example1: FreetypeQueryBuilderAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser(
            "freetype-query/freetype-query-builder-test",
            page
        );
        example1 = Atom.find<FreetypeQueryBuilderAtom>(FreetypeQueryBuilderAtom, "example1");
    });

    test("Should correctly select an option", async () => {
        await example1.type(threeTypeInput);
        const firstOption = await example1.getFirstOption();
        expect(await firstOption.isActive()).toBeTruthy();
    });

    test.describe("correctly show options", () => {
        test.beforeEach(async () => {
            await example1.clearText();
            await example1.type(threeTypeInput);
        });

        test("should show valid options for test type 1", async () => {
            await Helpers.pressKey("ArrowDown");

            const option0 = await example1.getOption(0);
            const option1 = await example1.getOption(1);
            const option2 = await example1.getOption(2);

            expect(await option0.getText()).toContain("111");
            expect(await option1.getText()).toContain("123");
            expect(await option2.getText()).toContain("222");
        });

        test("should show valid options for test type 2", async () => {
            await Helpers.pressKey("ArrowLeft", 5);

            const option0 = await example1.getOption(0);
            const option1 = await example1.getOption(1);
            const option2 = await example1.getOption(2);

            expect(await option0.getText()).toContain("aaa1");
            expect(await option1.getText()).toContain("ab1c");
            expect(await option2.getText()).toContain("1bbb");
        });

        test("should show valid options for test type 3", async () => {
            await Helpers.pressKey("Home");

            const option0 = await example1.getOption(0);
            const option1 = await example1.getOption(1);
            const option2 = await example1.getOption(2);

            expect(await option0.getText()).toContain("aaa");
            expect(await option1.getText()).toContain("abc");
            expect(await option2.getText()).toContain("bbb");
        });
    });

    test.describe("Correctly update text in query when option selected", () => {
        test.beforeEach(async () => {
            await example1.clearText();
            await example1.type(threeTypeInput);
            await Helpers.pressKey("Escape");
        });

        test("Should correctly replace text in query at the start of the query", async () => {
            await Helpers.pressKey("Home");
            await Helpers.pressKey("ArrowDown");
            await Helpers.pressKey("ArrowUp");
            await Helpers.pressKey("Enter");

            await example1.toHaveQueryText("aaa a1 123");
        });

        test("Should correctly replace text in query in the middle of the query", async () => {
            await Helpers.pressKey("Home");
            await Helpers.pressKey("ArrowRight");
            await Helpers.pressKey("ArrowRight");
            await Helpers.pressKey("ArrowDown");
            await Helpers.pressKey("ArrowUp");
            await Helpers.pressKey("Enter");

            await example1.toHaveQueryText("a aaa1 123");
        });

        test("Should correctly replace text in query at the end of the query", async () => {
            await Helpers.pressKey("ArrowDown");
            await Helpers.pressKey("ArrowUp");
            await Helpers.pressKey("Enter");

            await example1.toHaveQueryText("a a1 111");
        });
    });

    test("Should correctly filter new lines on paste", async () => {
        await example1.clearText();
        await example1.type(threeTypeInput + " \n" + threeTypeInput);
        await Helpers.pressKey("Escape");

        await example1.toHaveQueryText(threeTypeInput + " " + threeTypeInput);
    });
});
