// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { ToolbarAtom } from "./toolbar.atom";
import { Atom } from "../../atom";
import { Animations, Helpers, test } from "../../setup";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Toolbar";

test.describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let toolbarBasic: ToolbarAtom;
    let toolbarSelected: ToolbarAtom;
    let toolbarNoMenuSelected: ToolbarAtom;

    const id = {
        toolbarBasic: "nui-toolbar-test",
        toolbarWithEmbeddedContent: "nui-toolbar-test-embedded",
        toolbarSelected: "nui-toolbar-test-selected",
        toolbarNoMenuWithSearch: "nui-toolbar-no-menu-with-search",
        toolbarNoMenuSelectedWithSearch:
            "nui-toolbar-with-selection-no-menu-with-search",
        toolbarNoMenu: "nui-toolbar-no-menu",
        toolbarNoMenuSelected: "nui-toolbar-with-selection-no-menu",
    };

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("toolbar/toolbar-visual-test", page);
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );

        toolbarBasic = Atom.find<ToolbarAtom>(
            ToolbarAtom,
            id.toolbarBasic,
            true
        );
        toolbarSelected = Atom.find<ToolbarAtom>(
            ToolbarAtom,
            id.toolbarSelected,
            true
        );
        toolbarNoMenuSelected = Atom.find<ToolbarAtom>(
            ToolbarAtom,
            id.toolbarNoMenuSelected,
            true
        );
        camera = new Camera().loadFilm(page, name, "Bits");
    });

    test(`${name} visual test`, async () => {
        await camera.turn.on();

        await camera.say.cheese(`Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese("Dark theme");
        await Helpers.switchDarkTheme("off");

        await camera.be.responsive([1280, 1024, 800, 640, 320]);
        await camera.say.cheese("Checking responsivity");

        await camera.be.responsive(
            [1024],
            async () => await toolbarBasic.menu.toggleMenu()
        );
        await camera.say.cheese(
            "Toggle menu in toolbar With screen width 1024"
        );
        await toolbarBasic.menu.toggleMenu();

        await camera.be.responsive([800]);
        await camera.say.cheese("With screen width 800");

        await toolbarSelected.menu.getMenuButton().getLocator().first().click();
        await camera.say.cheese(
            "Toggle menu in selected toolbar With screen width 800"
        );
        await toolbarSelected.menu.getMenuButton().getLocator().first().click();

        await camera.be.defaultResponsive();
        await Helpers.setCustomWidth("200px", id.toolbarBasic);
        await Helpers.setCustomWidth("350px", id.toolbarWithEmbeddedContent);
        await Helpers.setCustomWidth("450px", id.toolbarSelected);
        await Helpers.setCustomWidth("360px", id.toolbarNoMenuWithSearch);
        await Helpers.setCustomWidth(
            "450px",
            id.toolbarNoMenuSelectedWithSearch
        );
        await Helpers.setCustomWidth("200px", id.toolbarNoMenu);
        await Helpers.setCustomWidth("200px", id.toolbarNoMenuSelected);
        await camera.say.cheese("Super-condenced toolbar");

        await toolbarNoMenuSelected.menu.toggleMenu();
        await camera.say.cheese(
            "Menu toggled on selected Super-condenced toolbar"
        );

        await camera.turn.off();
    });
});
