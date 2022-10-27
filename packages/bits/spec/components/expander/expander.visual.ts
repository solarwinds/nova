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

import { browser } from "protractor";

import { Atom } from "../../atom";
import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { ExpanderAtom } from "../expander/expander.atom";
import { MenuAtom } from "../menu/menu.atom";

const name: string = "Expander";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    let basicExpander: ExpanderAtom;
    let lineLessExpander: ExpanderAtom;
    let customHeaderExpander: ExpanderAtom;
    let stakedExpander: ExpanderAtom;
    let nestedParentExpander: ExpanderAtom;
    let nestedChildExpander: ExpanderAtom;
    let expanderWithText: ExpanderAtom;
    let expanderWithTextAndIcon: ExpanderAtom;
    let menuOfCustomHeader: MenuAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("expander/expander-visual-test");
        basicExpander = Atom.find(
            ExpanderAtom,
            "nui-visual-test-expander-basic"
        );
        lineLessExpander = Atom.find(
            ExpanderAtom,
            "nui-visual-test-expander-without-border"
        );
        customHeaderExpander = Atom.find(
            ExpanderAtom,
            "nui-visual-test-expander-custom-header"
        );
        stakedExpander = Atom.find(
            ExpanderAtom,
            "nui-visual-test-staked-expander-1"
        );
        nestedParentExpander = Atom.find(
            ExpanderAtom,
            "nui-visual-test-expander-nested-expander"
        );
        nestedChildExpander = Atom.find(
            ExpanderAtom,
            "nui-visual-test-expander-nested-expander-child"
        );
        expanderWithText = Atom.find(
            ExpanderAtom,
            "nui-visual-test-expander-header-text"
        );
        expanderWithTextAndIcon = Atom.find(
            ExpanderAtom,
            "nui-visual-test-expander-text-and-icon"
        );
        menuOfCustomHeader = Atom.find(
            MenuAtom,
            "nui-demo-expander-header-menu"
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();
        await camera.say.cheese(`Default`);

        await basicExpander.toggle();
        await nestedChildExpander.toggle();
        await lineLessExpander.getExpanderToggleIcon().hover();
        await camera.say.cheese(
            `BasicExpander and NestedChildExpander is toggled and Expander without expand line is hovered`
        );

        await basicExpander.toggle();
        await lineLessExpander.toggle();
        await expanderWithText.toggle();
        await expanderWithTextAndIcon.toggle();
        await stakedExpander.toggle();
        await nestedChildExpander.toggle();
        await nestedParentExpander.toggle();
        await customHeaderExpander.hover();
        await camera.say.cheese(`Some expanders are in expanded state`);

        await customHeaderExpander.toggle();
        await menuOfCustomHeader.toggleMenu();
        await camera.say.cheese(
            `Expander with custom header and header menu in expanded state`
        );

        await nestedParentExpander.toggle();
        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(
            `Dark theme and expanded NestedExpander and NestedChildExpander`
        );

        await camera.turn.off();
    }, 100000);
});
