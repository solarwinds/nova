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

import { browser, by, element } from "protractor";

import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { MenuAtom } from "./menu.atom";

const name: string = "Menu";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let menuBasic: MenuAtom;
    let menuBasicFooter: MenuAtom;
    let menuBasicDesctructive: MenuAtom;
    let menuBasicFooterDestructive: MenuAtom;
    let menuIconOnlyDestructive: MenuAtom;
    let menuMultiSelection: MenuAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("menu/menu-visual-test");

        menuBasic = new MenuAtom(
            element(by.id("nui-demo-basic-menu-with-icon"))
        );
        menuBasicDesctructive = new MenuAtom(
            element(by.id("nui-demo-destructive-menu-with-icon"))
        );
        menuBasicFooter = new MenuAtom(
            element(by.id("nui-demo-basic-menu-with-icon-footer"))
        );
        menuBasicFooterDestructive = new MenuAtom(
            element(by.id("nui-demo-destructive-menu-with-icon-footer"))
        );
        menuIconOnlyDestructive = new MenuAtom(
            element(by.id("nui-demo-menu-variants_run"))
        );
        menuMultiSelection = new MenuAtom(
            element(by.id("nui-demo-multi-selection-menu"))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await menuBasic.mouseDownOnMenuButton();
        await camera.say.cheese(`Mouse down effect`);

        await menuBasic.mouseUp();
        await menuBasic.getMenuItemByIndex(2).hover();
        await camera.say.cheese(
            `Basic menu aligned top-left toggled. Edge detection worked fine`
        );

        await menuBasic.getMenuItemByIndex(-1).scrollTo();
        await camera.say.cheese(
            `Scroll to bottom to capture the destructive item and verify it's last`
        );

        await menuBasicDesctructive.toggleMenu();
        await camera.say.cheese(
            `Basic destructive menu aligned top-right toggled. Edge detection worked fine`
        );
        await menuBasicDesctructive.toggleMenu();

        await menuBasicFooter.toggleMenu();
        await camera.say.cheese(
            `Basic menu aligned bottom-left toggled. Edge detection worked fine`
        );
        await menuBasicFooter.toggleMenu();

        await menuBasicFooterDestructive.toggleMenu();
        await camera.say.cheese(
            `Basic menu bottom-right toggled. Edge detection worked fine`
        );
        await menuBasicFooterDestructive.toggleMenu();

        await menuIconOnlyDestructive.toggleMenu();
        await menuIconOnlyDestructive.getMenuItemByIndex(-1).scrollTo();
        await menuIconOnlyDestructive.getMenuItemByIndex(3).clickItem();
        await menuIconOnlyDestructive.getMenuItemByIndex(5).hover();
        await camera.say.cheese(
            `Menu with different types of menu items is toggled (destructive menu)`
        );

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme test`);
        await Helpers.switchDarkTheme("off");
        await menuIconOnlyDestructive.toggleMenu();

        await menuMultiSelection.toggleMenu();
        await menuMultiSelection.getMenuItemByIndex(-1).scrollTo();
        await menuMultiSelection.getMenuItemByIndex(3).clickItem();
        await menuMultiSelection.getMenuItemByIndex(4).clickItem();
        await menuMultiSelection.getMenuItemByIndex(5).hover();
        await camera.say.cheese(
            `Menu with multiseletion is toggled (two items are selected and one is hovered)`
        );

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);

        await camera.turn.off();
    }, 300000);
});
