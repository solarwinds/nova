import { TextBoxAtom } from "./textbox.atom";
import { Helpers, test } from "../../setup";

const rulesToDisable: string[] = [];

test.describe("a11y: textbox", () => {
    test.beforeEach(async ({ page }): Promise<void> => {
        await Helpers.prepareBrowser("textbox/textbox-visual-test", page);
    });

    test("should verify a11y of textbox", async ({ runA11yScan }) => {
        await runA11yScan(TextBoxAtom, rulesToDisable);
    });
});
