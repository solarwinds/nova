import { browser } from "protractor";

import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

import { ToolbarAtom } from "./toolbar.atom";

const name: string = "Toolbar";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let toolbarBasic: ToolbarAtom;
    let toolbarSelected: ToolbarAtom;
    let toolbarNoMenuSelected: ToolbarAtom;

    const id = {
        toolbarBasic: "nui-toolbar-test",
        toolbarWithEmbeddedContent: "nui-toolbar-test-embedded",
        toolbarSelected: "nui-toolbar-test-selected",
        toolbarNoMenuWithSearch: "nui-toolbar-no-menu-with-search",
        toolbarNoMenuSelectedWithSearch: "nui-toolbar-with-selection-no-menu-with-search",
        toolbarNoMenu: "nui-toolbar-no-menu",
        toolbarNoMenuSelected: "nui-toolbar-with-selection-no-menu",
    };

    beforeAll(async () => {
        await Helpers.prepareBrowser("toolbar/toolbar-visual-test");
        await Helpers.disableCSSAnimations(Animations.TRANSITIONS_AND_ANIMATIONS);

        toolbarBasic = Atom.find(ToolbarAtom, id.toolbarBasic);
        toolbarSelected = Atom.find(ToolbarAtom, id.toolbarSelected);
        toolbarNoMenuSelected = Atom.find(ToolbarAtom, id.toolbarNoMenuSelected);

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await camera.be.responsive([1280, 1024, 800, 640, 320]);
        await camera.say.cheese("Checking responsivity");

        await camera.be.responsive([1024], async () => await toolbarBasic.getToolbarMenu().toggleMenu());
        await camera.say.cheese("Toggle menu in toolbar With screen width 1024");
        await toolbarBasic.getToolbarMenu().toggleMenu();

        await camera.be.responsive([800]);
        await camera.say.cheese("With screen width 800");

        await toolbarSelected.getToolbarMenu().toggleMenu();
        await camera.say.cheese("Toggle menu in selected toolbar With screen width 800");
        await toolbarSelected.getToolbarMenu().toggleMenu();

        await camera.be.defaultResponsive();
        await Helpers.setCustomWidth("200px", id.toolbarBasic);
        await Helpers.setCustomWidth("350px", id.toolbarWithEmbeddedContent);
        await Helpers.setCustomWidth("450px", id.toolbarSelected);
        await Helpers.setCustomWidth("360px", id.toolbarNoMenuWithSearch);
        await Helpers.setCustomWidth("450px", id.toolbarNoMenuSelectedWithSearch);
        await Helpers.setCustomWidth("200px", id.toolbarNoMenu);
        await Helpers.setCustomWidth("200px", id.toolbarNoMenuSelected);
        await camera.say.cheese("Super-condenced toolbar");

        await toolbarNoMenuSelected.getToolbarMenu().toggleMenu();
        await camera.say.cheese("Menu toggled on selected Super-condenced toolbar");

        await camera.turn.off();
    }, 300000);
});
