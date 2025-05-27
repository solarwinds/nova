import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/button/button.atom";
import { TextboxAtom } from "../../components/textbox/textbox.atom";
import { Helpers, test, expect } from "../../setup";

let buttonAtom: ButtonAtom;
let textbox: TextboxAtom;

test.describe("USERCONTROL Clipboard", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("common/clipboard", page);
        buttonAtom = Atom.find<ButtonAtom>(ButtonAtom, "clipboardButton", true);
        textbox = Atom.find<TextboxAtom>(TextboxAtom, "inputTextbox");
    });

    test("should copy text to clipboard", async () => {
        const textToCopy = "text to copy";

        await textbox.acceptText(textToCopy);
        await buttonAtom.click();
        await textbox.clearText();
        await textbox.toHaveValue("");
        await expect(textbox.input).toHaveValue("");


        await textbox.input.press("Control+V");
        await textbox.toHaveValue(textToCopy);
        await expect(textbox.input).toHaveValue(textToCopy);
    });
});
