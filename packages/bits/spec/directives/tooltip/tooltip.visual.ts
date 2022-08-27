import { browser } from "protractor";

import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/button/button.atom";
import { Animations, Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";

const name: string = "Tooltip";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera,
        basicTooltipButton: ButtonAtom,
        leftTooltipButton: ButtonAtom,
        bottomTooltipButton: ButtonAtom,
        rightTooltipButton: ButtonAtom,
        manualTooltipButton: ButtonAtom;

    beforeAll(async () => {
        await Helpers.prepareBrowser("tooltip/tooltip-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        basicTooltipButton = Atom.find(ButtonAtom, "basic-tooltip");
        leftTooltipButton = Atom.find(ButtonAtom, "left-tooltip");
        bottomTooltipButton = Atom.find(ButtonAtom, "bottom-tooltip");
        rightTooltipButton = Atom.find(ButtonAtom, "right-tooltip");
        manualTooltipButton = Atom.find(ButtonAtom, "manual-tooltip");

        camera = new Camera().loadFilm(browser, name);
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await basicTooltipButton.hover();
        await camera.say.cheese("Hover on button with basic tooltip");

        await Helpers.clickOnEmptySpace();
        await leftTooltipButton.hover();
        await camera.say.cheese("Hover on button with tooltip on the left");

        await Helpers.clickOnEmptySpace();
        await bottomTooltipButton.hover();
        await camera.say.cheese("Hover on button with tooltip on the bottom");

        await Helpers.clickOnEmptySpace();
        await rightTooltipButton.hover();
        await camera.say.cheese("Hover on button with tooltip on the right");

        await Helpers.clickOnEmptySpace();
        await manualTooltipButton.click();
        await camera.say.cheese("After tooltip triggered manually", 400);

        Helpers.switchDarkTheme("on");
        await camera.say.cheese(
            "After tooltip triggered manually with dark theme mode on"
        );

        await camera.turn.off();
    }, 200000);
});
