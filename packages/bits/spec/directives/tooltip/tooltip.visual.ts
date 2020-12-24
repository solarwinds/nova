
import {browser} from "protractor";

import {Atom} from "../../atom";
import {ButtonAtom} from "../../components/button/button.atom";
import {Animations, Helpers} from "../../helpers";

// TODO: enable the test after NUI-3683 is fixed
// Until the issue is fixed, these tests do not make sense since no tooltip appears on the screenshots
xdescribe("Visual tests: Tooltip", () => {
    // Add typings and use Eyes class instead of any in scope of <NUI-5428>
    let eyes: any,
        basicTooltipButton: ButtonAtom,
        leftTooltipButton: ButtonAtom,
        bottomTooltipButton: ButtonAtom,
        rightTooltipButton: ButtonAtom,
        manualTooltipButton: ButtonAtom;

    beforeAll(async () => {
        eyes = await Helpers.prepareEyes();
        await Helpers.prepareBrowser("tooltip/tooltip-visual-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
        basicTooltipButton = Atom.find(ButtonAtom, "basic-tooltip");
        leftTooltipButton = Atom.find(ButtonAtom, "left-tooltip");
        bottomTooltipButton = Atom.find(ButtonAtom, "bottom-tooltip");
        rightTooltipButton = Atom.find(ButtonAtom, "right-tooltip");
        manualTooltipButton = Atom.find(ButtonAtom, "manual-tooltip");
    });

    afterAll(async () => {
        // Remove type conversion once NUI-4870 is done
        await (eyes as any).abortIfNotClosed();
    });
    it("Default look", async () => {
        await eyes.open(browser, "NUI", "Tooltip");
        await eyes.checkWindow("Default");

        await basicTooltipButton.hover();
        await eyes.checkWindow("Hover on button with basic tooltip");

        await leftTooltipButton.hover();
        await eyes.checkWindow("Hover on button with tooltip on the left");

        await bottomTooltipButton.hover();
        await eyes.checkWindow("Hover on button with tooltip on the bottom");

        await rightTooltipButton.hover();
        await eyes.checkWindow("Hover on button with tooltip on the right");

        await manualTooltipButton.click();
        await eyes.checkWindow("After tooltip triggered manually");
        await manualTooltipButton.click();
        await eyes.checkWindow("After tooltip manually dismissed");

        Helpers.switchDarkTheme("on");
        await eyes.checkWindow("Dark theme");

        await eyes.close();
    }, 100000);
});
