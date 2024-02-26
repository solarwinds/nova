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

import { $$, browser, by, element, ElementFinder, Key } from "protractor";

import { PopoverAtom } from "./popover.atom";
import { ButtonAtom, CheckboxAtom } from "../..";
import { Atom } from "../../atom";
import { Animations, Helpers } from "../../helpers";

describe("USERCONTROL popover", () => {
    const onHoverParentId = "nui-demo-popover-mouseenter";
    const onClickParentId = "nui-demo-popover-onclick";
    const preventOnclickParentId = "nui-demo-popover-prevent-onclick";
    const focusParentId = "nui-demo-popover-focus";
    const popoverWithContainerId = "nui-demo-popover-with-container";
    const leftPlacementParentId = "nui-demo-popover-placement-left";
    const rightPlacementParentId = "nui-demo-popover-placement-right";
    const bottomPlacementParentId = "nui-demo-popover-placement-bottom";
    const topPlacementParentId = "nui-demo-popover-placement-top";
    const modalPopoverBtnId = "nui-demo-popover-modal";
    const checkboxInPopover = "nui-demo-checkbox-in-popover";
    const disabledPopoverId = "nui-demo-popover-disabled";
    const disableButtonId = "nui-disable-popover-toggle";
    const openProgrammaticallyButtonId =
        "nui-demo-popover-open-programmatically-btn";
    const closeProgrammaticallyButtonId =
        "nui-demo-popover-close-programmatically-btn";
    const popoverOpenCloseProgrammaticallyId =
        "nui-demo-popover-open-close-programmatically";
    const popoverDebounce1Id = "nui-demo-popover-debounce-1";

    const delay = 1000;

    let popoverMouseEnterTrigger: PopoverAtom;
    let popoverClickTrigger: PopoverAtom;
    let popoverFocusTrigger: PopoverAtom;
    let popoverPreventClosing: PopoverAtom;
    let inContainer: PopoverAtom;
    let disabledPopover: PopoverAtom;
    let popoverLeftPlacement: PopoverAtom;
    let popoverRightPlacement: PopoverAtom;
    let popoverBottomPlacement: PopoverAtom;
    let popoverTopPlacement: PopoverAtom;
    let popoverOpenCloseProgrammatically: PopoverAtom;
    let popoverDebounce1: PopoverAtom;
    let modalBtn: ButtonAtom;
    let checkbox: CheckboxAtom;
    let bodyPopover: ElementFinder;
    let containerPopover: ElementFinder;
    let disableButton: ButtonAtom;
    let openProgrammaticallyButton: ButtonAtom;
    let closeProgrammaticallyButton: ButtonAtom;

    beforeAll(() => {
        popoverMouseEnterTrigger = Atom.find(PopoverAtom, onHoverParentId);
        popoverMouseEnterTrigger.popoverModalId =
            "nui-demo-popover-modal-mouseenter";
        popoverClickTrigger = Atom.find(PopoverAtom, onClickParentId);
        popoverClickTrigger.popoverModalId = "nui-demo-popover-modal-click";
        popoverFocusTrigger = Atom.find(PopoverAtom, focusParentId);
        popoverFocusTrigger.popoverModalId = "nui-demo-popover-modal-focus";
        popoverPreventClosing = Atom.find(PopoverAtom, preventOnclickParentId);
        popoverPreventClosing.popoverModalId = "nui-demo-popover-modal-prevent";
        inContainer = Atom.find(PopoverAtom, popoverWithContainerId);
        popoverLeftPlacement = Atom.find(PopoverAtom, leftPlacementParentId);
        popoverRightPlacement = Atom.find(PopoverAtom, rightPlacementParentId);
        popoverBottomPlacement = Atom.find(
            PopoverAtom,
            bottomPlacementParentId
        );
        popoverTopPlacement = Atom.find(PopoverAtom, topPlacementParentId);
        modalBtn = Atom.find(ButtonAtom, modalPopoverBtnId);
        checkbox = Atom.find(CheckboxAtom, checkboxInPopover);
        disableButton = Atom.find(ButtonAtom, disableButtonId);
        disabledPopover = Atom.find(PopoverAtom, disabledPopoverId);
        disabledPopover.popoverModalId = "nui-demo-popover-modal-disabled";
        bodyPopover = element(by.css("body .nui-popover-container"));
        containerPopover = element(
            by.css("#nui-demo-popover-container .nui-popover-container")
        );
        popoverOpenCloseProgrammatically = Atom.find(
            PopoverAtom,
            popoverOpenCloseProgrammaticallyId
        );
        popoverDebounce1 = Atom.find(PopoverAtom, popoverDebounce1Id);
        popoverDebounce1.popoverModalId = "nui-demo-popover-modal-debounce-1";
        openProgrammaticallyButton = Atom.find(
            ButtonAtom,
            openProgrammaticallyButtonId
        );
        closeProgrammaticallyButton = Atom.find(
            ButtonAtom,
            closeProgrammaticallyButtonId
        );
    });

    beforeEach(async () => {
        await Helpers.prepareBrowser("popover/popover-test");
        await Helpers.disableCSSAnimations(Animations.ALL);
    });

    describe("title", () => {
        it("shouldn't show when is not defined", async () => {
            const title = popoverClickTrigger.getTitle();
            expect(await title.isPresent()).toBe(false);
        });

        it("should show title when is defined and component is clicked", async () => {
            const title = popoverClickTrigger.getTitle();
            await expect(await title.isPresent()).toBe(false);
            await popoverClickTrigger.clickTarget();
            await expect(await popoverClickTrigger.getTitleText()).toEqual(
                "Popover with Click Trigger"
            );
        });

        it("should not close popover after click on itself", async () => {
            await popoverPreventClosing.clickTarget();
            await expect(await popoverPreventClosing.isPopoverDisplayed()).toBe(
                true
            );
            await checkbox.toggle();
            await expect(await popoverPreventClosing.isPopoverDisplayed()).toBe(
                true
            );
        });
    });

    describe("triggers", () => {
        it("should honor 'click' trigger", async () => {
            await expect(await popoverClickTrigger.isPopoverDisplayed()).toBe(
                false
            );
            await popoverClickTrigger.togglePopover();
            await expect(await popoverClickTrigger.isPopoverDisplayed()).toBe(
                true
            );
            await popoverClickTrigger.togglePopover();
            await expect(await popoverClickTrigger.isPopoverDisplayed()).toBe(
                false
            );
            // ensure it isn't triggered by hover
            await popoverClickTrigger.hover();
            await expect(await popoverClickTrigger.isPopoverDisplayed()).toBe(
                false
            );
        });

        it("should close when clicked outside", async () => {
            await popoverClickTrigger.open();
            await expect(await popoverClickTrigger.isPopoverDisplayed()).toBe(
                true
            );

            await browser
                .actions()
                .mouseMove(popoverClickTrigger.getElement(), { x: -1, y: -1 })
                .click()
                .perform();
            await popoverBottomPlacement.waitForClosed();

            await expect(await popoverClickTrigger.isPopoverDisplayed()).toBe(
                false
            );
        });

        it("should honor 'focus' trigger", async () => {
            expect(await popoverFocusTrigger.isPopoverDisplayed()).toBe(false);
            await $$("[trigger='focus']").first().click();
            await popoverFocusTrigger.waitForOpen();
            expect(await popoverFocusTrigger.isPopoverDisplayed()).toBe(true);
            // move away from parent, click to shift focus and ensure the popover disappears
            await browser
                .actions()
                .sendKeys(Key.chord(Key.SHIFT, Key.TAB))
                .perform();
            await popoverFocusTrigger.waitForClosed();
            await expect(await popoverFocusTrigger.isPopoverDisplayed()).toBe(
                false
            );
        });

        describe("should honor 'mouseenter' trigger as default trigger", () => {
            it("without any delays", async () => {
                await expect(
                    await popoverMouseEnterTrigger.isPopoverDisplayed()
                ).toBe(false);
                await popoverMouseEnterTrigger.openByHover();
                await expect(
                    await popoverMouseEnterTrigger.isPopoverDisplayed()
                ).toBe(true);
                // ensure click has no effect
                await popoverMouseEnterTrigger.clickTarget();
                await expect(
                    await popoverMouseEnterTrigger.isPopoverDisplayed()
                ).toBe(true);
                // move away from parent and ensure the popover disappears
                await popoverClickTrigger.hover();
                await popoverMouseEnterTrigger.waitForClosed();
                await expect(
                    await popoverMouseEnterTrigger.isPopoverDisplayed()
                ).toBe(false);
            });

            it("with a " + delay + "ms delay", async () => {
                await expect(await popoverDebounce1.isPopoverDisplayed()).toBe(
                    false
                );

                // hover our element
                await popoverDebounce1.hover();

                const hoverStartTime = new Date().getTime();

                // wait for the debounce time to pass before displaying the popup
                await popoverDebounce1.waitForOpen(delay + 500);
                await expect(await popoverDebounce1.isPopoverDisplayed()).toBe(
                    true
                );

                const popoverUntilDisplayDuration =
                    new Date().getTime() - hoverStartTime;
                expect(popoverUntilDisplayDuration).toBeGreaterThanOrEqual(
                    delay
                );
            });
        });
    });

    describe("placement", () => {
        it("should honor left 'placement'", async () => {
            await popoverLeftPlacement.open();
            await expect(await popoverLeftPlacement.isDisplayedLeft()).toBe(
                true
            );
            await expect(await popoverLeftPlacement.isDisplayedRight()).toBe(
                false
            );
        });
        it("should honor right 'placement'", async () => {
            await popoverRightPlacement.open();
            await expect(await popoverRightPlacement.isDisplayedLeft()).toBe(
                false
            );
            await expect(await popoverRightPlacement.isDisplayedRight()).toBe(
                true
            );
        });
        // resize doesn't work in chrome driver 2.32, 2.33 should be used
        // http://chromedriver.storage.googleapis.com/2.33/notes.txt
        xit("appear on the left to adjust for the lack of free space on the right", async () => {
            await browser.driver.manage().window().setSize(320, 240);
            await popoverMouseEnterTrigger.openByHover();
            await expect(
                await popoverMouseEnterTrigger.isDisplayedRight()
            ).toBe(false);
            await expect(await popoverMouseEnterTrigger.isDisplayedLeft()).toBe(
                true
            );
        });

        describe("container", () => {
            it("should append to body by default", async () => {
                await expect(await bodyPopover.isPresent()).toBe(false);
                await popoverMouseEnterTrigger.openByHover();
                await expect(await bodyPopover.isPresent()).toBe(true);
            });

            it("should append to container if specified", async () => {
                await expect(await containerPopover.isPresent()).toBe(false);
                await inContainer.openByHover();
                await expect(await containerPopover.isPresent()).toBe(true);
            });
        });

        it("should show backdrop with appropriate css classes in modal mode", async () => {
            await expect(await PopoverAtom.backdrop.isPresent()).toBe(false);
            await modalBtn.click();
            await expect(await PopoverAtom.backdrop.isDisplayed()).toBe(true);
        });

        it("should close on user action", async () => {
            await popoverPreventClosing.open();
            await expect(await popoverPreventClosing.isPopoverDisplayed()).toBe(
                true
            );
            const userPopoverCloseButton = Atom.find(
                ButtonAtom,
                "nui-demo-custom-close-popover"
            );

            await userPopoverCloseButton.click();
            await popoverPreventClosing.waitForClosed();
            await expect(await popoverPreventClosing.isPopoverDisplayed()).toBe(
                false
            );
        });

        it("should not close when clicked outside", async () => {
            await popoverPreventClosing.open();
            await expect(await popoverPreventClosing.isPopoverDisplayed()).toBe(
                true
            );
            await popoverPreventClosing.hover(undefined, { x: -1, y: -1 });
            await browser.actions().click().perform();
            await browser.sleep(PopoverAtom.animationDelay * 1.5);
            await expect(await popoverPreventClosing.isPopoverDisplayed()).toBe(
                true
            );
        });

        it("should close when another popover is opened", async () => {
            await popoverClickTrigger.open();
            await expect(await popoverClickTrigger.isPopoverDisplayed()).toBe(
                true
            );
            await popoverPreventClosing.open();
            await popoverClickTrigger.waitForClosed();
            await expect(await popoverClickTrigger.isPopoverDisplayed()).toBe(
                false
            );
        });

        describe("vertical placement", () => {
            it("should open popover at the bottom", async () => {
                await popoverBottomPlacement.scrollTo();
                await popoverBottomPlacement.open();
                expect(await popoverBottomPlacement.isDisplayedBottom()).toBe(
                    true
                );
            });

            it("should open popover at the top", async () => {
                await popoverTopPlacement.open();
                expect(await popoverTopPlacement.isDisplayedTop()).toBe(true);
            });
        });
    });

    describe("disabled >", () => {
        it("should NOT show popover after disabling it", async () => {
            await disableButton.click();
            await disabledPopover.hover();
            await browser.sleep(PopoverAtom.animationDelay * 1.5);
            expect(await disabledPopover.isPopoverDisplayed()).toBe(false);
        });
    });

    describe("opening and closing programmatically >", () => {
        it("should open popover by clicking on button", async () => {
            await openProgrammaticallyButton.click();
            await popoverOpenCloseProgrammatically.waitForOpen();
            await expect(
                await popoverOpenCloseProgrammatically.isPopoverDisplayed()
            ).toBe(true);
        });

        it("should close popover by clicking on button", async () => {
            await openProgrammaticallyButton.click();
            await closeProgrammaticallyButton.click();
            await popoverOpenCloseProgrammatically.waitForClosed();
            await expect(
                await popoverOpenCloseProgrammatically.isPopoverDisplayed()
            ).toBe(false);
        });
    });
});
