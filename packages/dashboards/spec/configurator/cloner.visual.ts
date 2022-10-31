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

import { Atom, ButtonAtom, Camera } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { ConfiguratorAtom } from "./configurator.atom";

const name: string = "Configurator";

describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    let configurator: ConfiguratorAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("test/configurator");

        configurator = Atom.findIn(
            ConfiguratorAtom,
            element(by.className(ConfiguratorAtom.CSS_CLASS))
        );

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} - Cloner`, async () => {
        await camera.turn.on();

        const cloneButton = Atom.findIn(
            ButtonAtom,
            element(by.className("nui-widget-cloner-test-button"))
        );
        await cloneButton.click();
        await camera.say.cheese(`${name} - Default`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`${name} - Default Dark Theme`);
        await Helpers.switchDarkTheme("off");

        await configurator.wizard.next();

        const accordion = await configurator?.getAccordion(
            "Value 1",
            "Description"
        );
        await accordion?.toggle();
        const backgroundColorSelect = accordion?.getSelect(
            "kpi-description-configuration__accordion-content__color-picker"
        );
        await backgroundColorSelect?.click();
        await camera.say.cheese(`${name} - Select popup is displayed`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(
            `${name} - Select popup is displayed in Dark Theme`
        );

        await camera.turn.off();
    }, 100000);
});
