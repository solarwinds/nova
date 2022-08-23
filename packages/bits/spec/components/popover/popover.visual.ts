import {
    browser,
    by,
    element,
    ElementArrayFinder,
    ElementFinder,
} from "protractor";

import { Helpers } from "../../helpers";
import { Camera } from "../../virtual-camera/Camera";
import { CheckboxAtom } from "../checkbox/checkbox.atom";
import { ComboboxV2Atom } from "../combobox-v2/combobox-v2.atom";
import { PopoverAtom } from "./popover.atom";

const name: string = "Popover";

describe(`Visual tests: ${name}`, () => {
    let camera: Camera;
    const buttonPreventClosing: ElementFinder = element(
        by.id("nui-demo-button-prevent-onclick")
    );
    const placementCheckButtons: ElementArrayFinder = element.all(
        by.css(".placement-check-btn")
    );
    const popoverPreventClosing: PopoverAtom = new PopoverAtom(
        element(by.id("nui-demo-popover-prevent-closing"))
    );
    const popoverBasic: PopoverAtom = new PopoverAtom(
        element(by.id("nui-demo-popover-basic"))
    );
    const popoverNoRestrictions: PopoverAtom = new PopoverAtom(
        element(by.id("nui-demo-popover-no-limits"))
    );
    const popoverNoPadding: PopoverAtom = new PopoverAtom(
        element(by.id("nui-demo-popover-no-padding"))
    );
    const popoverBasicMultiline: PopoverAtom = new PopoverAtom(
        element(by.id("nui-demo-popover-limited-and-multiline"))
    );
    const popoverModal: PopoverAtom = new PopoverAtom(
        element(by.id("nui-demo-popover-modal"))
    );
    const checkboxInPopover: CheckboxAtom = new CheckboxAtom(
        element(by.id("nui-demo-checkbox-in-popover"))
    );
    const comboboxV2InPopover: ComboboxV2Atom = new ComboboxV2Atom(
        element(by.id("nui-demo-combobox-v2-in-popover"))
    );

    beforeAll(async (done) => {
        await Helpers.prepareBrowser("popover/popover-visual-test");

        camera = new Camera().loadFilm(browser, name);
        done();
    });

    it(`${name} visual test`, async () => {
        await camera.turn.on();

        await popoverPreventClosing.togglePopover();
        await placementCheckButtons.each(async (btn) => await btn?.click());
        await browser.actions().mouseMove(buttonPreventClosing).perform();
        await checkboxInPopover.toggle();
        await comboboxV2InPopover.click();
        await (await comboboxV2InPopover.getFirstOption()).click();
        await comboboxV2InPopover.click();

        await camera.say.cheese(`Popover placement and preventClose`);

        await Helpers.switchDarkTheme("on");
        await camera.say.cheese(`Dark theme`);
        await Helpers.switchDarkTheme("off");
        await placementCheckButtons.each(async (btn) => await btn?.click());
        await popoverPreventClosing.togglePopover();

        await popoverBasic.openByHover();
        await camera.say.cheese(`Basic popover`);
        await browser.actions().mouseMove(buttonPreventClosing).perform();
        await popoverBasic.waitForClosed();

        await popoverNoPadding.openByHover();
        await camera.say.cheese(`Popover with title and custom (no) padding`);
        await browser.actions().mouseMove(buttonPreventClosing).perform();
        await popoverNoPadding.waitForClosed();

        await popoverNoRestrictions.openByHover();
        await camera.say.cheese(`Popover with no width restrictions`);
        await browser.actions().mouseMove(buttonPreventClosing).perform();
        await popoverNoRestrictions.waitForClosed();

        await popoverBasicMultiline.openByHover();
        await camera.say.cheese(`Basic multiline popover`);
        await browser.actions().mouseMove(buttonPreventClosing).perform();
        await popoverBasicMultiline.waitForClosed();

        await popoverModal.open();
        await camera.say.cheese(`Modal popover`);

        await camera.turn.off();
    }, 300000);
});
