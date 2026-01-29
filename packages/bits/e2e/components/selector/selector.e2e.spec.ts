import { Locator } from "@playwright/test";

import { SelectorAtom, SelectionType } from "./selector.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";

test.describe("USERCONTROL Selector", () => {
    const demoElementId = "nui-demo-selector";

    let subject: SelectorAtom;
    let selectionElement: Locator;
    let indeterminateElement: Locator;

    const isIndeterminate = async (): Promise<void> =>
        (await indeterminateElement.textContent()) === "indeterminate";

    const makeIndeterminate = async (): Promise<void> =>
        Helpers.page.locator("#nui-demo-make-indeterminate").click();

    const makeAppendedToBody = async (): Promise<void> =>
        Helpers.page.locator("#nui-demo-make-appended-to-body").click();

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("selector", page);
    });

    test.beforeEach(() => {
        subject = Atom.find<SelectorAtom>(SelectorAtom, demoElementId);
        selectionElement = Helpers.page.locator("#nui-demo-selection-type");
        indeterminateElement = Helpers.page.locator("#nui-demo-indeterminate");
    });

    test("should get appropriate 'SelectionType' state by clicking repeat item", async () => {
        await subject.select(SelectionType.All);
        await expect(selectionElement).toContainText(SelectionType.All);

        await subject.select(SelectionType.None);
        await expect(selectionElement).toContainText(SelectionType.None);

        await subject.select(SelectionType.All);
        await subject.select(SelectionType.AllPages);
        await expect(selectionElement).toContainText(SelectionType.AllPages);
    });

    test("should get 'SelectionType' (All, None) by changing checkbox state", async () => {
        const selectorCheckbox = subject.getCheckbox;

        await selectorCheckbox.toggle();
        await expect(selectionElement).toContainText(SelectionType.All);

        await selectorCheckbox.toggle();
        await expect(selectionElement).toContainText(SelectionType.UnselectAll);
    });

    test("should set 'Indeterminate'", async () => {
        await subject.select(SelectionType.AllPages);
        expect(await isIndeterminate()).toBe(false);

        await makeIndeterminate();
        expect(await isIndeterminate()).toBe(true);
    });

    test("should get 'SelectionType' (All, None) by clicking on selector button", async () => {
        const selectorButton = subject.getSelectorButton;

        await selectorButton.click();
        await expect(selectionElement).toContainText(SelectionType.All);

        await selectorButton.click();
        await expect(selectionElement).toContainText(SelectionType.UnselectAll);
    });

    test.describe("appended to body >", () => {
        test("should get appropriate 'SelectionType' state by clicking repeat item", async () => {
            await makeAppendedToBody();
            await subject.selectAppendedToBodyItem(SelectionType.All);
            await expect(selectionElement).toHaveText(SelectionType.All);

            await subject.selectAppendedToBodyItem(SelectionType.None);
            await expect(selectionElement).toHaveText(SelectionType.None);

            await subject.selectAppendedToBodyItem(SelectionType.AllPages);
            await expect(selectionElement).toHaveText(SelectionType.AllPages);
        });
    });
});
