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

import { test, Helpers, expect } from "../../setup";
import { Animations } from "../../setup";
import { Atom } from "../../atom";
import { PopoverAtom } from "./popover.atom";
import { ButtonAtom } from "../button/button.atom";
import { CheckboxAtom } from "../checkbox/checkbox.atom";

test.describe("USERCONTROL popover", () => {
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
    let disableButton: ButtonAtom;
    let openProgrammaticallyButton: ButtonAtom;
    let closeProgrammaticallyButton: ButtonAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("popover/popover-test", page);
        await Helpers.disableCSSAnimations(Animations.ALL);

        popoverMouseEnterTrigger = Atom.find<PopoverAtom>(PopoverAtom, onHoverParentId);
        popoverMouseEnterTrigger.popoverModalId =
            "nui-demo-popover-modal-mouseenter";
        popoverClickTrigger = Atom.find<PopoverAtom>(PopoverAtom, onClickParentId);
        popoverClickTrigger.popoverModalId = "nui-demo-popover-modal-click";
        popoverFocusTrigger = Atom.find<PopoverAtom>(PopoverAtom, focusParentId);
        popoverFocusTrigger.popoverModalId = "nui-demo-popover-modal-focus";
        popoverPreventClosing = Atom.find<PopoverAtom>(PopoverAtom, preventOnclickParentId);
        popoverPreventClosing.popoverModalId = "nui-demo-popover-modal-prevent";
        inContainer = Atom.find<PopoverAtom>(PopoverAtom, popoverWithContainerId);
        popoverLeftPlacement = Atom.find<PopoverAtom>(PopoverAtom, leftPlacementParentId);
        popoverRightPlacement = Atom.find<PopoverAtom>(PopoverAtom, rightPlacementParentId);
        popoverBottomPlacement = Atom.find<PopoverAtom>(
            PopoverAtom,
            bottomPlacementParentId
        );
        popoverTopPlacement = Atom.find<PopoverAtom>(PopoverAtom, topPlacementParentId);
        modalBtn = Atom.find<ButtonAtom>(ButtonAtom, modalPopoverBtnId);
        checkbox = Atom.find<CheckboxAtom>(CheckboxAtom, checkboxInPopover);
        disableButton = Atom.find<ButtonAtom>(ButtonAtom, disableButtonId);
        disabledPopover = Atom.find<PopoverAtom>(PopoverAtom, disabledPopoverId);
        disabledPopover.popoverModalId = "nui-demo-popover-modal-disabled";
        popoverOpenCloseProgrammatically = Atom.find<PopoverAtom>(
            PopoverAtom,
            popoverOpenCloseProgrammaticallyId
        );
        popoverDebounce1 = Atom.find<PopoverAtom>(PopoverAtom, popoverDebounce1Id);
        popoverDebounce1.popoverModalId = "nui-demo-popover-modal-debounce-1";
        openProgrammaticallyButton = Atom.find<ButtonAtom>(
            ButtonAtom,
            openProgrammaticallyButtonId
        );
        closeProgrammaticallyButton = Atom.find<ButtonAtom>(
            ButtonAtom,
            closeProgrammaticallyButtonId
        );
    });

    test.describe("title", () => {
        test("shouldn't show when is not defined", async () => {
            const title = popoverClickTrigger.getTitle();
            await expect(title).toHaveCount(0);
        });

        test("should show title when is defined and component is clicked", async () => {
            const title = popoverClickTrigger.getTitle();
            await expect(title).toHaveCount(0);
            await popoverClickTrigger.clickTarget();
            await expect(popoverClickTrigger.getTitle()).toHaveText(
                "Popover with Click Trigger"
            );
        });

        test("should not close popover after click on itself", async () => {
            await popoverPreventClosing.clickTarget();
            await expect(popoverPreventClosing.getPopoverBody()).toBeVisible();
            await checkbox.toggle();
            await expect(popoverPreventClosing.getPopoverBody()).toBeVisible();
        });
    });

    test.describe("triggers", () => {
        test("should honor 'click' trigger", async () => {
            await expect(popoverClickTrigger.getPopoverBody()).toBeHidden();
            await popoverClickTrigger.togglePopover();
            await expect(popoverClickTrigger.getPopoverBody()).toBeVisible();
            await popoverClickTrigger.togglePopover();
            await expect(popoverClickTrigger.getPopoverBody()).toBeHidden();
            // ensure it isn't triggered by hover
            await popoverClickTrigger.hover();
            await expect(popoverClickTrigger.getPopoverBody()).toBeHidden();
        });

        test("should close when clicked outside", async ({ page }) => {
            await popoverClickTrigger.open();
            await expect(popoverClickTrigger.getPopoverBody()).toBeVisible();

            // click outside area
            const box = await popoverClickTrigger.getLocator().boundingBox();
            if (box) {
                await page.mouse.move(box.x - 1, box.y - 1);
                await page.mouse.click(box.x - 1, box.y - 1);
            } else {
                await Helpers.clickOnEmptySpace();
            }
            await popoverBottomPlacement.waitForClosed();

            await expect(popoverClickTrigger.getPopoverBody()).toBeHidden();
        });

        test("should honor 'focus' trigger", async ({ page }) => {
            await expect(popoverFocusTrigger.getPopoverBody()).toBeHidden();
            await page.locator("[trigger='focus']").first().click();
            await popoverFocusTrigger.waitForOpen();
            await expect(popoverFocusTrigger.getPopoverBody()).toBeVisible();
            // move away from parent, shift+tab and ensure the popover disappears
            await page.keyboard.press("Shift+Tab");
            await popoverFocusTrigger.waitForClosed();
            await expect(popoverFocusTrigger.getPopoverBody()).toBeHidden();
        });

        test.describe("should honor 'mouseenter' trigger as default trigger", () => {
            test("without any delays", async () => {
                await expect(popoverMouseEnterTrigger.getPopoverBody()).toBeHidden();
                await popoverMouseEnterTrigger.openByHover();
                await expect(popoverMouseEnterTrigger.getPopoverBody()).toBeVisible();
                // ensure click has no effect
                await popoverMouseEnterTrigger.clickTarget();
                await expect(popoverMouseEnterTrigger.getPopoverBody()).toBeVisible();
                // move away from parent and ensure the popover disappears
                await popoverClickTrigger.hover();
                await popoverMouseEnterTrigger.waitForClosed();
                await expect(popoverMouseEnterTrigger.getPopoverBody()).toBeHidden();
            });

            test("with a " + delay + "ms delay", async () => {
                await expect(popoverDebounce1.getPopoverBody()).toBeHidden();

                // hover our element
                await popoverDebounce1.hover();

                const hoverStartTime = Date.now();

                // wait for the debounce time to pass before displaying the popup
                await popoverDebounce1.waitForOpen(delay + 500);
                await expect(popoverDebounce1.getPopoverBody()).toBeVisible();

                const popoverUntilDisplayDuration = Date.now() - hoverStartTime;
                expect(popoverUntilDisplayDuration).toBeGreaterThanOrEqual(
                    delay
                );
            });
        });
    });

    test.describe("placement", () => {
        test("should honor left 'placement'", async () => {
            await popoverLeftPlacement.open();
            expect(await popoverLeftPlacement.isDisplayedLeft()).toBe(true);
            expect(await popoverLeftPlacement.isDisplayedRight()).toBe(false);
        });
        test("should honor right 'placement'", async () => {
            await popoverRightPlacement.open();
            expect(await popoverRightPlacement.isDisplayedLeft()).toBe(false);
            expect(await popoverRightPlacement.isDisplayedRight()).toBe(true);
        });

        test.describe("container", () => {
            test("should append to body by default", async ({ page }) => {
                const bodyPopover = page.locator("body .nui-popover-container");
                await expect(bodyPopover).toHaveCount(0);
                await popoverMouseEnterTrigger.openByHover();
                await expect(bodyPopover).toHaveCount(1);
            });

            test("should append to container if specified", async ({ page }) => {
                const containerPopover = page.locator(
                    "#nui-demo-popover-container .nui-popover-container"
                );
                await expect(containerPopover).toHaveCount(0);
                await inContainer.openByHover();
                await expect(containerPopover).toHaveCount(1);
            });
        });

        test("should show backdrop with appropriate css classes in modal mode", async () => {
            await expect(PopoverAtom.getBackdrop()).toHaveCount(0);
            await modalBtn.click();
            await expect(PopoverAtom.getBackdrop()).toBeVisible();
        });

        test("should close on user action", async () => {
            await popoverPreventClosing.open();
            await expect(popoverPreventClosing.getPopoverBody()).toBeVisible();
            const userPopoverCloseButton = Atom.find(
                ButtonAtom,
                "nui-demo-custom-close-popover"
            );

            await userPopoverCloseButton.click();
            await popoverPreventClosing.waitForClosed();
            await expect(popoverPreventClosing.getPopoverBody()).toBeHidden();
        });

        test("should not close when clicked outside", async ({ page }) => {
            await popoverPreventClosing.open();
            await expect(popoverPreventClosing.getPopoverBody()).toBeVisible();
            const box = await popoverPreventClosing
                .getLocator()
                .boundingBox();
            if (box) {
                await page.mouse.move(box.x - 1, box.y - 1);
                await page.mouse.click(box.x - 1, box.y - 1);
            } else {
                await Helpers.clickOnEmptySpace();
            }
            await expect(popoverPreventClosing.getPopoverBody()).toBeVisible();
        });

        test("should close when another popover is opened", async () => {
            await popoverClickTrigger.open();
            await expect(popoverClickTrigger.getPopoverBody()).toBeVisible();
            await popoverPreventClosing.open();
            await popoverClickTrigger.waitForClosed();
            await expect(popoverClickTrigger.getPopoverBody()).toBeHidden();
        });

        test.describe("vertical placement", () => {
            test("should open popover at the bottom", async () => {
                await popoverBottomPlacement.open();
                expect(await popoverBottomPlacement.isDisplayedBottom()).toBe(
                    true
                );
            });

            test("should open popover at the top", async () => {
                await popoverTopPlacement.open();
                expect(await popoverTopPlacement.isDisplayedTop()).toBe(true);
            });
        });
    });

    test.describe("disabled >", () => {
        test("should NOT show popover after disabling it", async () => {
            await disableButton.click();
            await disabledPopover.hover();
            await expect(disabledPopover.getPopoverBody()).toBeHidden();
        });
    });

    test.describe("opening and closing programmatically >", () => {
        test("should open popover by clicking on button", async () => {
            await openProgrammaticallyButton.click();
            await popoverOpenCloseProgrammatically.waitForOpen();
            await expect(popoverOpenCloseProgrammatically.getPopoverBody()).toBeVisible();
        });

        test("should close popover by clicking on button", async () => {
            await openProgrammaticallyButton.click();
            await closeProgrammaticallyButton.click();
            await popoverOpenCloseProgrammatically.waitForClosed();
            await expect(popoverOpenCloseProgrammatically.getPopoverBody()).toBeHidden();
        });
    });
});
