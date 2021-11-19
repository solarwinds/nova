import { browser, by, element, ElementFinder } from "protractor";
import { assertA11y, Helpers } from "../../helpers";
import { PanelAtom } from "../public_api";

describe("a11y: panel", () => {
    const rulesToDisable: string[] = [];
    let expanders: { [key: string]: ElementFinder };

    beforeAll(async () => {
        await Helpers.prepareBrowser("panel/panel-visual-test");

        expanders = {
            detailsBasicPanel: element(by.id("nui-visual-basic-panel-details")),
            detailsCustomSizes: element(by.id("nui-visual-custom-size-panel-details")),
            detailsHoverable: element(by.id("nui-visual-hoverable-panel-details")),
            detailsClosable: element(by.id("nui-visual-closable-panel-details")),
            detailsWithEmbeddedContent: element(by.id("nui-visual-with-embedded-details")),
            detailsCustomStyles: element(by.id("nui-visual-custom-style-panel-details")),
            detailsResizable: element(by.id("nui-visual-resizable-details")),
            detailsTopOriented: element(by.id("nui-visual-top-oriented-panel-details")),
            detailsNested: element(by.id("nui-visual-nested-panel-details")),
        };
    });

    it("should check a11y of panel", async () => {
        for (const key of Object.keys(expanders)) { await expanders[key].click(); }
        await assertA11y(browser, PanelAtom.CSS_CLASS, rulesToDisable);
    });
});
