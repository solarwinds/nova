import { PopupAtom } from "./popup.atom";
import { Atom } from "../../atom";
import { Helpers, test, expect } from "../../setup";

test.describe("legacy research popup", () => {
    test("opens and closes independently of the modern popup examples", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("popup/popup-legacy-test", page);
        const toggle = page.getByRole("button", {
            name: "Open legacy research popup",
            exact: true,
        });
        const content = page.getByText("Legacy popup details", { exact: true });
        const area = page.locator(
            "body > nui-popup-container .nui-popup__area"
        );

        await expect(page.locator("nui-popup")).toHaveCount(0);
        await expect(content).toBeHidden();
        await toggle.click();
        await expect(area).toBeVisible();
        await expect(content).toBeVisible();
        await toggle.click();
        await expect(content).toBeHidden();
        await expect(
            page.locator("body > nui-popup-container .nui-popup--opened")
        ).toHaveCount(0);
    });
});

test.describe("host-referenced popup", () => {
    test("keeps native information triggers open after Escape, Enter, and Space", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("popup/popup-host-toggle-test", page);

        const cases = [
            {
                id: "preferred-polling-method-info",
                name: "Preferred polling method information",
                content: "Preferred polling method details",
            },
            {
                id: "manual-monitoring-setup-info",
                name: "Manual monitoring setup information",
                content: "Manual monitoring setup details",
            },
            {
                id: "automatic-monitoring-setup-info",
                name: "Automatic monitoring setup information",
                content: "Automatic monitoring setup details",
            },
        ];
        const settlePopup = async (): Promise<void> => {
            await page.evaluate(
                async () =>
                    new Promise<void>(resolve => {
                        window.setTimeout(
                            () => window.requestAnimationFrame(() => resolve()),
                            0
                        );
                    })
            );
        };
        const pressAndSettle = async (key: string): Promise<void> => {
            await page.keyboard.press(key);
            await settlePopup();
        };
        const readFormState = async (): Promise<string[]> =>
            page.locator("form input").evaluateAll(inputs =>
                inputs.map(element => {
                    const input = element as HTMLInputElement;
                    return `${input.name}:${input.value}:${input.checked}`;
                })
            );
        const expectFormUnchanged = async (
            originalState: string[]
        ): Promise<void> => {
            expect(await readFormState()).toEqual(originalState);
            await expect(page.getByText("Form submissions: 0")).toBeVisible();
        };

        await settlePopup();
        await expect(page.locator("form input")).toHaveCount(5);
        const originalFormState = await readFormState();
        expect(originalFormState).toEqual([
            "preferredPollingMethod:SNMP:true",
            "preferredPollingMethod:WMI:false",
            "monitoringMode:manual:false",
            "monitoringMode:automatic:true",
            "icmpEnabled:on:true",
        ]);
        await expect(page.locator(".cdk-overlay-pane")).toHaveCount(0);
        await expect(page.getByText("Form submissions: 0")).toBeVisible();

        for (const popupCase of cases) {
            await expect(
                page.getByRole("button", {
                    name: popupCase.name,
                    exact: true,
                })
            ).toHaveAttribute("aria-expanded", "false");
            await expect(
                page.getByText(popupCase.content, { exact: true })
            ).toBeHidden();
        }

        const focusStart = page.getByRole("button", {
            name: "Start keyboard test",
            exact: true,
        });
        await focusStart.focus();
        await expect(focusStart).toBeFocused();

        for (const popupCase of cases) {
            const trigger = page.getByRole("button", {
                name: popupCase.name,
                exact: true,
            });
            const content = page.getByText(popupCase.content, { exact: true });
            const popupHost = page.locator(`#${popupCase.id}`);

            await expect(trigger).toHaveAttribute("aria-expanded", "false");
            await expect(content).toBeHidden();

            await pressAndSettle("Tab");
            await expect(trigger).toBeFocused();
            await expect(trigger).toHaveAttribute("aria-expanded", "true");
            await expect(content).toBeVisible();
            await expect(popupHost).toBeVisible();

            await pressAndSettle("Escape");
            await expect(content).toBeHidden();
            await expect(trigger).toHaveAttribute("aria-expanded", "false");
            await expect(trigger).toBeFocused();

            await pressAndSettle("Enter");
            await expect(content).toBeVisible();
            await expect(trigger).toHaveAttribute("aria-expanded", "true");
            await expect(trigger).toBeFocused();
            await expectFormUnchanged(originalFormState);

            await pressAndSettle("Escape");
            await expect(content).toBeHidden();
            await expect(trigger).toHaveAttribute("aria-expanded", "false");

            const scrollPosition = await page.evaluate(() => window.scrollY);
            await pressAndSettle("Space");
            await expect(content).toBeVisible();
            await expect(trigger).toHaveAttribute("aria-expanded", "true");
            await expect(trigger).toBeFocused();
            expect(await page.evaluate(() => window.scrollY)).toBe(
                scrollPosition
            );
            await expectFormUnchanged(originalFormState);

            await pressAndSettle("Escape");
            await expect(content).toBeHidden();
            await pressAndSettle("Enter");
            await expect(content).toBeVisible();
            await expect(trigger).toHaveAttribute("aria-expanded", "true");
            await expect(trigger).toBeFocused();
            await expectFormUnchanged(originalFormState);

            await pressAndSettle("Escape");
            await expect(content).toBeHidden();
        }
    });

    test("preserves hover, focus, Escape dismissal, and outside dismissal", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("popup/popup-host-toggle-test", page);

        const focusStart = page.getByRole("button", {
            name: "Start keyboard test",
            exact: true,
        });
        const trigger = page.getByRole("button", {
            name: "Preferred polling method information",
            exact: true,
        });
        const content = page.getByText("Preferred polling method details", {
            exact: true,
        });
        const settlePopup = async (): Promise<void> => {
            await page.evaluate(
                async () =>
                    new Promise<void>(resolve => {
                        window.setTimeout(
                            () => window.requestAnimationFrame(() => resolve()),
                            0
                        );
                    })
            );
        };

        await focusStart.focus();
        await trigger.hover();
        await settlePopup();
        await expect(content).toBeVisible();
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        await expect(focusStart).toBeFocused();

        await trigger.focus();
        await page.mouse.move(0, 0);
        await settlePopup();
        await expect(content).toBeVisible();
        await expect(trigger).toHaveAttribute("aria-expanded", "true");
        await expect(trigger).toBeFocused();

        await trigger.hover();
        await page.keyboard.press("Escape");
        await settlePopup();
        await expect(content).toBeHidden();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await expect(trigger).toBeFocused();

        await page.mouse.move(0, 0);
        await settlePopup();
        await expect(content).toBeHidden();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await expect(trigger).toBeFocused();

        await trigger.blur();
        await settlePopup();
        await trigger.focus();
        await settlePopup();
        await expect(content).toBeVisible();
        await focusStart.click();
        await settlePopup();
        await expect(content).toBeHidden();
        await expect(trigger).toHaveAttribute("aria-expanded", "false");
        await expect(focusStart).toBeFocused();
    });
    test("has no accessibility violations with host-referenced information open", async ({
        page,
        runA11yScan,
    }) => {
        await Helpers.prepareBrowser("popup/popup-host-toggle-test", page);
        await page.getByRole("button", { name: "Start keyboard test" }).focus();
        await page.keyboard.press("Tab");
        await expect(
            page.getByText("Preferred polling method details", { exact: true })
        ).toBeVisible();
        await runA11yScan("nui-popup-host-toggle-test", [], ["wcag2aa"]);
    });
});

test.describe("USERCONTROL Popup", () => {
    let popupSimple: PopupAtom;
    let popupCustomWidth: PopupAtom;
    let popupIsOpened: PopupAtom;
    let popupAppendToBody: PopupAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("popup/popup-test", page);
        popupSimple = Atom.find<PopupAtom>(PopupAtom, "nui-demo-popup-simple");
        popupCustomWidth = Atom.find<PopupAtom>(
            PopupAtom,
            "nui-demo-popup-custom-width"
        );
        popupIsOpened = Atom.find<PopupAtom>(
            PopupAtom,
            "nui-demo-popup-isOpen-true"
        );
        popupAppendToBody = Atom.find<PopupAtom>(
            PopupAtom,
            "nui-demo-popup-append-to-body"
        );
        popupAppendToBody.detachedPopupContextClass = "additional-host-class";
    });

    test("should respect the isOpen Input", async () => {
        await popupIsOpened.isOpened();
    });

    test("should be opened/closed on click event", async () => {
        await popupSimple.getPopupToggle.click();
        await popupSimple.isOpened();

        await popupSimple.getPopupToggle.click();
        await popupSimple.isNotOpened();
    });

    test("should be closed when other popup is opened", async () => {
        await popupSimple.open();
        await popupCustomWidth.open();

        await popupSimple.isNotOpened();
        await popupCustomWidth.isOpened();
    });

    test("should be closed if click outside the popup", async () => {
        await popupSimple.open();
        await Helpers.clickOnEmptySpace();
        await popupSimple.isNotOpened();
    });

    test("should attach container to body", async () => {
        await popupAppendToBody.open(true);
        await popupAppendToBody.isOpenedAppendToBody();
    });

    test("should detach container from body when closed", async () => {
        await popupAppendToBody.open(true);
        await popupAppendToBody.isOpenedAppendToBody();
        await Helpers.clickOnEmptySpace();
        await popupAppendToBody.isNotOpenedAppendToBody();
    });

    test("should respect context class", async () => {
        await popupAppendToBody.open(true);
        await expect(popupAppendToBody.getPopupBoxDetached).toContainClass(
            "nui-overlay"
        );
        await expect(popupAppendToBody.getPopupBoxDetached).toContainClass(
            "additional-host-class"
        );
    });

    test("should remove the appended to body popup container on close", async () => {
        await popupAppendToBody.open(true);

        await popupAppendToBody.getPopupToggle.click();
        await popupAppendToBody.isNotOpenedAppendToBody();
    });

    test("should accept custom width", async () => {
        await popupCustomWidth.getPopupToggle.click();

        await expect(popupCustomWidth.getPopupBox).toHaveCSS("width", "200px");
    });
});
