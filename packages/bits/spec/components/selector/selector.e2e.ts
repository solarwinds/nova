import {
    browser,
    by,
    element,
    ElementFinder
} from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";

import { SelectorAtom } from "./selector.atom";

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
        expect(await selectionElement.getText()).toEqual(SelectionType.AllPages);
    });

    it("should get 'SelectionType' (All, None) by changing checkbox state", async () => {
        const selectorCheckbox = subject.getCheckbox();

        await selectorCheckbox.toggle();
        expect(await selectionElement.getText()).toEqual(SelectionType.All);

        await selectorCheckbox.toggle();
        expect(await selectionElement.getText()).toEqual(SelectionType.UnselectAll);
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
        expect(await selectionElement.getText()).toEqual(SelectionType.UnselectAll);
    });

    describe("appended to body >", () => {
        it("should get appropriate 'SelectionType' state by clicking repeat item", async () => {
            await makeAppendedToBody();
            await subject.selectAppendedToBodyItem(SelectionType.All);
            expect(await selectionElement.getText()).toEqual(SelectionType.All);

            await subject.selectAppendedToBodyItem(SelectionType.None);
            expect(await selectionElement.getText()).toEqual(SelectionType.None);

            await subject.selectAppendedToBodyItem(SelectionType.AllPages);
            expect(await selectionElement.getText()).toEqual(SelectionType.AllPages);
        });
    });
});
