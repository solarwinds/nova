import { ChipsAtom } from "./chips.atom";
import { Helpers, test } from "../../setup";

const rulesToDisable: string[] = ["color-contrast"];

test.describe("a11y: chips", () => {
    test.beforeEach(async ({ page }): Promise<void> => {
        await Helpers.prepareBrowser("chips/chips-visual-test", page);
    });

    test("should verify a11y of button", async ({ runA11yScan }) => {
        await runA11yScan(ChipsAtom, rulesToDisable);
    });
});
