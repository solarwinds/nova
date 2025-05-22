import { ButtonAtom } from "./button.atom";
import { Helpers, test } from "../../setup";

const rulesToDisable: string[] = ["duplicate-id-active"];

test.describe("a11y: button", () => {
    test.beforeEach(async ({ page }): Promise<void> => {
        await Helpers.prepareBrowser("button/button-visual-test", page);
    });

    test("should verify a11y of button", async ({ runA11yScan }) => {
        await runA11yScan(ButtonAtom, rulesToDisable);
    });
});
