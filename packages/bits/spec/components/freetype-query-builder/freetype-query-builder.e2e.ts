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

import { Key } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { FreetypeQueryBuilderAtom, SelectV2OptionAtom } from "../public_api";

describe("USERCONTROL freetype-query-builder >", () => {
    const threeTypeInput = "a a1 123";
    let example1: FreetypeQueryBuilderAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser(
            "freetype-query/freetype-query-builder-test"
        );
        example1 = Atom.find(FreetypeQueryBuilderAtom, "example1");
    });

    it("Should correctly select an option", async () => {
        await example1.type(threeTypeInput);
        await example1
            .getFirstOption()
            .then(async (item: SelectV2OptionAtom) =>
                expect(item.isActive).toBeTruthy()
            );
    });

    describe("correctly show options", async () => {
        beforeEach(async () => {
            await example1.clearText();
            await example1.type(threeTypeInput);
        });
        it("should show valid options for test type 1", async () => {
            await Helpers.pressKey(Key.ARROW_DOWN);

            await example1
                .getOption(0)
                .then(async (item: SelectV2OptionAtom) =>
                    expect(item.getText()).toContain("111")
                );
            await example1
                .getOption(1)
                .then(async (item: SelectV2OptionAtom) =>
                    expect(item.getText()).toContain("123")
                );
            await example1
                .getOption(2)
                .then(async (item: SelectV2OptionAtom) =>
                    expect(item.getText()).toContain("222")
                );
        });

        it("should show valid options for test type 1", async () => {
            await Helpers.pressKey(Key.ARROW_LEFT, 5);

            await example1
                .getOption(0)
                .then(async (item: SelectV2OptionAtom) =>
                    expect(item.getText()).toContain("aaa1")
                );
            await example1
                .getOption(1)
                .then(async (item: SelectV2OptionAtom) =>
                    expect(item.getText()).toContain("ab1c")
                );
            await example1
                .getOption(2)
                .then(async (item: SelectV2OptionAtom) =>
                    expect(item.getText()).toContain("1bbb")
                );
        });

        it("should show valid options for test type 1", async () => {
            await Helpers.pressKey(Key.HOME);
            await example1
                .getOption(0)
                .then(async (item: SelectV2OptionAtom) =>
                    expect(item.getText()).toContain("aaa")
                );
            await example1
                .getOption(1)
                .then(async (item: SelectV2OptionAtom) =>
                    expect(item.getText()).toContain("abc")
                );
            await example1
                .getOption(2)
                .then(async (item: SelectV2OptionAtom) =>
                    expect(item.getText()).toContain("bbb")
                );
        });
    });

    describe("Correctly update text in query when option selected", () => {
        beforeEach(async () => {
            await example1.clearText();
            await example1.type(threeTypeInput);
            await Helpers.pressKey(Key.ESCAPE);
        });

        it("Should correctly replace text in query at the start of the query", async () => {
            await Helpers.pressKey(Key.HOME);
            await Helpers.pressKey(Key.ARROW_DOWN);
            await Helpers.pressKey(Key.ARROW_UP);
            await Helpers.pressKey(Key.ENTER);

            expect(await example1.getQueryText()).toBe("aaa a1 123");
        });

        it("Should correctly replace text in query in the middle of the query", async () => {
            await Helpers.pressKey(Key.HOME);
            await Helpers.pressKey(Key.ARROW_RIGHT);
            await Helpers.pressKey(Key.ARROW_RIGHT);
            await Helpers.pressKey(Key.ARROW_DOWN);
            await Helpers.pressKey(Key.ARROW_UP);
            await Helpers.pressKey(Key.ENTER);

            expect(await example1.getQueryText()).toBe("a aaa1 123");
        });

        it("Should correctly replace text in query at the end of the query", async () => {
            await Helpers.pressKey(Key.ARROW_DOWN);
            await Helpers.pressKey(Key.ARROW_UP);
            await Helpers.pressKey(Key.ENTER);

            expect(await example1.getQueryText()).toBe("a a1 111");
        });
    });

    it("Should correctly filter new lines on paste", async () => {
        await example1.clearText();
        await example1.type(threeTypeInput + " \n" + threeTypeInput);
        await Helpers.pressKey(Key.ESCAPE);

        expect(await example1.getQueryText()).toBe(
            threeTypeInput + " " + threeTypeInput
        );
    });
});
