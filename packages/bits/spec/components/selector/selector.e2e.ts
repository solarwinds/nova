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

import { browser, by, element, ElementFinder } from "protractor";

import { SelectorAtom } from "./selector.atom";
import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

export enum SelectionType {
    All = "Select all items on this page",
    UnselectAll = "Unselect all items on this page",
    None = "Unselect all items",
    AllPages = "Select all items on all pages",
}

describe("USERCONTROL Selector", () => {
    const demoElementId = "nui-demo-selector";

    let subject: SelectorAtom;
    let selectionElement: ElementFinder;
    let indeterminateElement: ElementFinder;

    const isIndeterminate = async (): Promise<boolean> =>
        (await indeterminateElement.getText()) === "indeterminate";

    const makeIndeterminate = async (): Promise<void> =>
        browser.element(by.id("nui-demo-make-indeterminate")).click();

    const makeAppendedToBody = async (): Promise<void> =>
        browser.element(by.id("nui-demo-make-appended-to-body")).click();

    beforeAll(() => {
        subject = Atom.find(SelectorAtom, demoElementId);
        selectionElement = element(by.id("nui-demo-selection-type"));
        indeterminateElement = element(by.id("nui-demo-indeterminate"));
    });

    beforeEach(async () => {
        await Helpers.prepareBrowser("selector");
    });

    it("should get appropriate 'SelectionType' state by clicking repeat item", async () => {
        await subject.select(SelectionType.All);
        expect(await selectionElement.getText()).toEqual(SelectionType.All);

        await subject.select(SelectionType.None);
        expect(await selectionElement.getText()).toEqual(SelectionType.None);

        await subject.select(SelectionType.All);
        await subject.select(SelectionType.AllPages);
        expect(await selectionElement.getText()).toEqual(
            SelectionType.AllPages
        );
    });

    it("should get 'SelectionType' (All, None) by changing checkbox state", async () => {
        const selectorCheckbox = subject.getCheckbox();

        await selectorCheckbox.toggle();
        expect(await selectionElement.getText()).toEqual(SelectionType.All);

        await selectorCheckbox.toggle();
        expect(await selectionElement.getText()).toEqual(
            SelectionType.UnselectAll
        );
    });

    it("should set 'Indeterminate'", async () => {
        await subject.select(SelectionType.AllPages);
        expect(await isIndeterminate()).toBe(false);

        await makeIndeterminate();
        expect(await isIndeterminate()).toBe(true);
    });

    it("should get 'SelectionType' (All, None) by clicking on selector button", async () => {
        const selectorButton = subject.getSelectorButton();

        await selectorButton.click();
        expect(await selectionElement.getText()).toEqual(SelectionType.All);

        await selectorButton.click();
        expect(await selectionElement.getText()).toEqual(
            SelectionType.UnselectAll
        );
    });

    describe("appended to body >", () => {
        it("should get appropriate 'SelectionType' state by clicking repeat item", async () => {
            await makeAppendedToBody();
            await subject.selectAppendedToBodyItem(SelectionType.All);
            expect(await selectionElement.getText()).toEqual(SelectionType.All);

            await subject.selectAppendedToBodyItem(SelectionType.None);
            expect(await selectionElement.getText()).toEqual(
                SelectionType.None
            );

            await subject.selectAppendedToBodyItem(SelectionType.AllPages);
            expect(await selectionElement.getText()).toEqual(
                SelectionType.AllPages
            );
        });
    });
});
