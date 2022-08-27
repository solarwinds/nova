import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { LayoutSheetGroupAtom } from "./layout-sheet-group.atom";

const name: string = "Layout";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let separatedSheets: LayoutSheetGroupAtom;
    let joinedSheets: LayoutSheetGroupAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("layout/layout-visual-test");
        separatedSheets = Atom.find(
            LayoutSheetGroupAtom,
            "nui-visual-test-layout-separated-sheet-group"
        );
        joinedSheets = Atom.find(
            LayoutSheetGroupAtom,
            "nui-visual-test-layout-joined-sheet-group"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        camera.lens.configure()?.setStitchMode("CSS");

        await camera.say.cheese(`Default`);

        await separatedSheets.hover(
            separatedSheets.getVerticalResizerByIndex(0)
        );
        await camera.say.cheese(`Hovered HorizontalResizer`);

        await separatedSheets.mouseDownVerticalResizerByIndex(0);
        await camera.say.cheese(`HorizontalResizer on MouseDown`);

        await separatedSheets.mouseUp();
        await joinedSheets.hover(joinedSheets.getHorizontalResizerByIndex(1));
        await camera.say.cheese(`Hovered VerticalResizer`);

        await joinedSheets.mouseDownHorizontalResizerByIndex(1);
        await camera.say.cheese(`VerticalResizer on MouseDown`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 200000);
});
