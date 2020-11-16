import { Key } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/button/button.atom";
import { TextboxAtom } from "../../components/textbox/textbox.atom";
import { Helpers } from "../../helpers";

describe("USERCONTROL Clipboard", () => {
    const buttonAtom: ButtonAtom = Atom.find(ButtonAtom, "clipboardButton");
    const textbox: TextboxAtom = Atom.find(TextboxAtom, "inputTextbox");

    beforeAll(async () => {
        await Helpers.prepareBrowser("common/clipboard");
    });

    it("should copy text to clipboard", async () => {
        const textToCopy = "text to copy";

        await textbox.acceptText(textToCopy);
        await buttonAtom.click();
        await textbox.clearText();
        expect(await textbox.getValue()).toBe("");

        await textbox.input.sendKeys(Key.CONTROL, "v");
        expect(await textbox.getValue()).toBe(textToCopy, "Text wasn't pasted");
    });
});
