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

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { SearchAtom } from "./search.atom";
import { test, expect, Helpers } from "../../setup";

test.describe("USERCONTROL search", () => {
    const expectedFocusedDelay = 2000;
    let searchField: SearchAtom;
    let searchBtnAtom: ButtonAtom;
    let cancelBtnAtom: ButtonAtom;
    let setFocusBtnAtom: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("search/search-test", page);
        searchField = Atom.find<SearchAtom>(SearchAtom, "nui-demo-search", true);
        searchBtnAtom = searchField.getSearchButton();
        cancelBtnAtom = searchField.getCancelButton();
        setFocusBtnAtom = Atom.find<ButtonAtom>(ButtonAtom, "nui-demo-search-set-focus-btn");
    });

    test.afterEach(async () => {
        if (await cancelBtnAtom.isIconShown()) {
            await cancelBtnAtom.click();
        }
    });

    test("buttons should be disabled when 'disabled' prop is true", async () => {
        await searchBtnAtom.toBeDisabled();
        await cancelBtnAtom.toBeHidden();
        const input = "foo";
        await searchField.acceptInput(input);
        await cancelBtnAtom.toBeVisible();
        await searchBtnAtom.toBeVisible();
    });

    test("should search on enter key", async () => {
        await searchField.acceptInput("Lorem");
        await Helpers.pressKey("Enter");
        const highlighted = Helpers.page.locator(".nui-highlighted:text('Lorem')");
        await expect(highlighted).toBeVisible();
    });

    test("should have focus depending on 'captureFocus' prop", async () => {
        await setFocusBtnAtom.click();
        await searchField.isFocused();
        await Helpers.page.waitForTimeout(expectedFocusedDelay);
        await searchField.isNotFocused();
    });

    test("should get focus on cancel", async () => {
        const input = "foo";
        await searchField.acceptInput(input);
        await cancelBtnAtom.click();
        await searchField.isFocused();
    });

    test("should lose focus on search", async () => {
        const input = "foo";
        await searchField.acceptInput(input);
        await searchBtnAtom.click();
        await searchField.isNotFocused();
    });

    test("should reflect error when isInErrorState is true", async () => {
        await expect(searchField.hasError()).resolves.toBe(true);
    });
});
