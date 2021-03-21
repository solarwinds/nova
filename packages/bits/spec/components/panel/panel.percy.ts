import percySnapshot from "@percy/protractor";
import { browser, by, element, ElementFinder } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { PanelAtom } from "./panel.atom";

describe("Visual tests: Panel", () => {
    let camera: Camera;
    let closablePanel: PanelAtom;
    let collapsiblePanel: PanelAtom;
    let customStylesPanel: PanelAtom;
    let hoverablePanel: PanelAtom;
    let topOrientedPanel: PanelAtom;
    let nestedPanelOuter: PanelAtom;
    let resizablePanel: PanelAtom;
    let expanders: {[key: string]: ElementFinder};

    beforeEach(async (done) => {
        await Helpers.prepareBrowser("panel/panel-visual-test");
        camera = new Camera().loadFilm(browser, "Panel");

        collapsiblePanel = Atom.find(PanelAtom, "nui-visual-test-embedded-content-panel");
        closablePanel = Atom.find(PanelAtom, "nui-visual-test-hidden-panel");
        customStylesPanel = Atom.find(PanelAtom, "nui-visual-test-custom-styles-panel");
        hoverablePanel = Atom.find(PanelAtom, "nui-visual-test-hoverable-panel");
        topOrientedPanel = Atom.find(PanelAtom, "nui-visual-test-top-oriented-panel");
        nestedPanelOuter = Atom.find(PanelAtom, "nui-visual-test-nested-panel-outer");
        resizablePanel = Atom.find(PanelAtom, "nui-visual-test-resizable-panel");

        expanders = {
            detailsBasicPanel : element(by.id("nui-visual-basic-panel-details")),
            detailsCustomSizes : element(by.id("nui-visual-custom-size-panel-details")),
            detailsHoverable : element(by.id("nui-visual-hoverable-panel-details")),
            detailsClosable : element(by.id("nui-visual-closable-panel-details")),
            detailsWithEmbeddedContent : element(by.id("nui-visual-with-embedded-details")),
            detailsCustomStyles : element(by.id("nui-visual-custom-style-panel-details")),
            detailsResizable : element(by.id("nui-visual-resizable-details")),
            detailsTopOriented : element(by.id("nui-visual-top-oriented-panel-details")),
            detailsNested : element(by.id("nui-visual-nested-panel-details")),
        };

        done();
    });

    it("Default look", async (done) => {
        await camera.turn.on();
        // First we expand all expanders to check the default state of all panel cases
        for (const key of Object.keys(expanders)) { await expanders[key].click(); }
        await camera.say.cheese("Basic view with hover on top orienter arrow button");

        await camera.turn.off();

        done();
    }, 300000);
});
