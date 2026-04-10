import { ChipsAtom } from "./chips.atom";
import { Helpers, test } from "../../setup";

// target-size disabled: chip remove icon is 16px by design — WCAG 2.5.8 manual review required
const rulesToDisable: string[] = ["color-contrast", "target-size"];

test.describe("a11y: chips", () => {
    test.beforeEach(async ({ page }): Promise<void> => {
        await Helpers.prepareBrowser("chips/chips-visual-test", page);
    });

    test("should verify a11y of button", async ({ runA11yScan }) => {
        await runA11yScan(ChipsAtom, rulesToDisable);
    });
});
