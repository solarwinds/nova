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

import { RadioGroupAtom } from "./radio-group.atom";
import { Atom } from "../../atom";
import { expect, Helpers, test } from "../../setup";
import { CheckboxAtom } from "../checkbox/checkbox.atom";

test.describe("Radio group documentation examples", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("radio-group", page);
    });

    test("should keep named examples independently selected and keyboard navigation inside their group", async ({
        page,
    }) => {
        for (const name of [
            "Basic fruit selection",
            "Inline fruit selection",
            "Disabled fruit selection",
            "Color selection with hints",
            "Color selection with elaborate hints",
            "Color selection with change notification",
            "Vegetable selection",
        ]) {
            await expect(
                page.getByRole("radiogroup", { name, exact: true })
            ).toBeVisible();
        }

        const names = await page
            .locator("nui-radio-group")
            .evaluateAll(groups =>
                groups.map(
                    group =>
                        group.querySelector<HTMLInputElement>("input")?.name
                )
            );
        expect(names).not.toContain("");
        expect(names).not.toContain(undefined);
        expect(new Set(names).size).toBe(names.length);

        const mismatches = await page
            .locator("nui-radio-group input[type=radio]")
            .evaluateAll((inputs: HTMLInputElement[]) =>
                inputs
                    .filter(
                        input =>
                            input.checked !==
                            (input.getAttribute("aria-checked") === "true")
                    )
                    .map(input => ({
                        name: input.name,
                        value: input.value,
                    }))
            );
        expect(mismatches).toEqual([]);

        const basic = page.getByRole("radiogroup", {
            name: "Basic fruit selection",
            exact: true,
        });
        const inline = page.getByRole("radiogroup", {
            name: "Inline fruit selection",
            exact: true,
        });
        await expect(
            inline.getByRole("radio", { name: "Orange", exact: true })
        ).toBeChecked();
        await basic.getByText("Papaya", { exact: true }).click();
        await page.keyboard.press("ArrowRight");
        const banana = basic.getByRole("radio", {
            name: "Banana",
            exact: true,
        });
        await expect(banana).toBeFocused();
        await expect(banana).toBeChecked();
        await expect(banana).toHaveAttribute("aria-checked", "true");
        await expect(
            inline.getByRole("radio", { name: "Orange", exact: true })
        ).toBeChecked();

        const hints = page.getByRole("radiogroup", {
            name: "Color selection with hints",
            exact: true,
        });
        const changes = page.getByRole("radiogroup", {
            name: "Color selection with change notification",
            exact: true,
        });
        await changes.getByText("Red", { exact: true }).click();
        const green = hints.getByRole("radio", {
            name: "Green",
            exact: true,
        });
        await expect(green).toBeChecked();
        await expect(green).toHaveAttribute("aria-checked", "true");
    });

    test("should keep interactive descriptions outside labels and activate hint links without selecting another radio", async ({
        page,
    }) => {
        const group = page.getByRole("radiogroup", {
            name: "Color selection with elaborate hints",
            exact: true,
        });
        const red = group.getByRole("radio", { name: "Red", exact: true });
        const green = group.getByRole("radio", {
            name: "Green",
            exact: true,
        });
        await expect(
            group.locator("label a, label button, label textarea, label select")
        ).toHaveCount(0);
        const radio = red.locator("xpath=ancestor::nui-radio");

        await group.getByText("Green", { exact: true }).click();
        await expect(green).toBeChecked();
        await page
            .context()
            .route("https://en.wiktionary.org/**", async route =>
                route.fulfill({
                    contentType: "text/html",
                    body: "<title>Hint destination</title>",
                })
            );
        const link = radio.getByRole("link", {
            name: "elaborate",
            exact: true,
        });
        await link.focus();
        const popupPromise = page.waitForEvent("popup");
        await page.keyboard.press("Enter");
        const popup = await popupPromise;
        await expect(popup).toHaveTitle("Hint destination");
        await popup.close();
        await expect(green).toBeChecked();
        await expect(green).toHaveAttribute("aria-checked", "true");
        await expect(red).not.toBeChecked();
        await expect(group.locator("input:checked")).toHaveCount(1);
    });
});

test.describe("USERCONTROL Radio group", () => {
    let basicGroup: RadioGroupAtom;
    let disabledGroup: RadioGroupAtom;
    let toggleDisabledGroupCheckbox: CheckboxAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("radio-group/radio-group-test", page);
        basicGroup = Atom.find<RadioGroupAtom>(
            RadioGroupAtom,
            "basic-radio-group"
        );
        disabledGroup = Atom.find<RadioGroupAtom>(
            RadioGroupAtom,
            "disabled-radio-group"
        );
        toggleDisabledGroupCheckbox = Atom.find<CheckboxAtom>(
            CheckboxAtom,
            "toggle-disabled-group-checkbox"
        );
    });

    test("should have 'Kiwi' fruit value", async () => {
        await basicGroup.getRadioByValue("Kiwi").click();
        await basicGroup.toHaveValue("Kiwi");
    });

    test("should expose a named group with one labeled native radio per option", async ({
        page,
    }) => {
        const group = page.getByRole("radiogroup", {
            name: "Fruit selection",
            exact: true,
        });
        await expect(group.getByRole("radio")).toHaveCount(4);
        for (const fruit of ["Banana", "Orange", "Kiwi", "Papaya"]) {
            const input = group.getByRole("radio", {
                name: fruit,
                exact: true,
            });
            await expect(input).toHaveAttribute("type", "radio");
            expect(
                await input.evaluate(
                    (radio: HTMLInputElement) =>
                        !!radio.id &&
                        radio.labels?.[0]?.htmlFor === radio.id &&
                        radio.labels[0].control === radio
                )
            ).toBe(true);
        }

        const ids = await page
            .locator("input[type=radio]")
            .evaluateAll(inputs => inputs.map(input => input.id));
        expect(ids).not.toContain("");
        expect(new Set(ids).size).toBe(ids.length);
    });

    test("should separate option names from hints and preserve an explicit label reference", async ({
        page,
    }) => {
        const group = page.getByRole("radiogroup", {
            name: "Query input method",
            exact: true,
        });
        const graphical = group.getByRole("radio", {
            name: "Use the graphical query builder",
            exact: true,
        });
        const handEdit = group.getByRole("radio", {
            name: "Hand-edit a SWQL query",
            exact: true,
        });
        await expect(graphical).toHaveAccessibleDescription(
            "Build the query visually"
        );
        await expect(handEdit).toHaveAttribute(
            "aria-labelledby",
            "query-hand-edit-label"
        );
        await expect(handEdit).toHaveAccessibleDescription(
            "Edit the query directly"
        );
    });

    test("should move the text cursor without changing radios when editing inside a group", async ({
        page,
    }) => {
        const group = page.getByRole("radiogroup", {
            name: "Query input method",
            exact: true,
        });
        const editor = page.getByRole("textbox", {
            name: "Query text",
            exact: true,
        });
        const queryText = await editor.inputValue();

        for (const name of [
            "Use the graphical query builder",
            "Hand-edit a SWQL query",
        ]) {
            const selected = group.getByRole("radio", { name, exact: true });
            await selected
                .locator("..")
                .locator(".nui-radio__transclude")
                .click();
            await expect(selected).toHaveAttribute("aria-checked", "true");
            await editor.click();

            for (const [key, position] of [
                ["ArrowLeft", 6],
                ["ArrowRight", 8],
            ] as const) {
                await editor.evaluate((input: HTMLTextAreaElement) =>
                    input.setSelectionRange(7, 7)
                );
                await page.keyboard.press(key);
                expect(
                    await editor.evaluate(
                        (input: HTMLTextAreaElement) => input.selectionStart
                    )
                ).toBe(position);
                await expect(editor).toHaveValue(queryText);
                await expect(editor).toBeFocused();
                await expect(selected).toBeChecked();
                await expect(selected).toHaveAttribute("aria-checked", "true");
                await expect(group.locator("input:checked")).toHaveCount(1);
            }
            for (const key of ["ArrowUp", "ArrowDown"]) {
                const previousPosition = await editor.evaluate(
                    (input: HTMLTextAreaElement) => input.selectionStart
                );
                await page.keyboard.press(key);
                expect(
                    await editor.evaluate(
                        (input: HTMLTextAreaElement) => input.selectionStart
                    )
                ).not.toBe(previousPosition);
                await expect(editor).toHaveValue(queryText);
                await expect(editor).toBeFocused();
                await expect(selected).toBeChecked();
                await expect(selected).toHaveAttribute("aria-checked", "true");
                await expect(group.locator("input:checked")).toHaveCount(1);
            }
        }
    });

    test("should navigate enabled radios with arrows and leave the group with Tab", async ({
        page,
    }) => {
        const orange = basicGroup.getRadioInputByValue("Orange");
        const toggle = toggleDisabledGroupCheckbox
            .getLocator()
            .locator("label");
        await toggle.focus();
        await page.keyboard.press("Shift+Tab");
        await expect(orange).toBeFocused();

        for (const fruit of ["Kiwi", "Papaya", "Orange"]) {
            await page.keyboard.press("ArrowRight");
            const input = basicGroup.getRadioInputByValue(fruit);
            await expect(input).toBeFocused();
            await expect(input).toBeChecked();
            await expect(input).toHaveAttribute("aria-checked", "true");
            await expect(
                basicGroup.getLocator().locator("input[aria-checked=true]")
            ).toHaveCount(1);
            await expect(
                basicGroup.getLocator().locator("input:checked")
            ).toHaveCount(1);
        }

        await page.keyboard.press("ArrowLeft");
        const papaya = basicGroup.getRadioInputByValue("Papaya");
        await expect(papaya).toBeFocused();
        await expect(papaya).toBeChecked();
        await page.keyboard.press("Shift+Tab");
        await expect(basicGroup.getLocator().locator(":focus")).toHaveCount(0);
        await page.keyboard.press("Tab");
        await expect(papaya).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(toggle).toBeFocused();
    });

    test("should show a keyboard focus ring with enough contrast in light, dark and forced-colors", async ({
        page,
    }) => {
        const mark = (fruit: string) =>
            basicGroup
                .getRadioInputByValue(fruit)
                .locator("..")
                .locator(".nui-radio__mark");

        for (const theme of ["light", "dark", "forced-colors"] as const) {
            await page.emulateMedia({
                forcedColors: theme === "forced-colors" ? "active" : "none",
            });
            await Helpers.switchDarkTheme(theme === "dark" ? "on" : "off");
            await basicGroup.selectByValue("Orange");
            await page.keyboard.press("Tab");
            await page.keyboard.press("Shift+Tab");
            await expect(
                basicGroup.getRadioInputByValue("Orange")
            ).toBeFocused();
            await expect(mark("Orange")).toHaveCSS("outline-style", "solid");
            await expect(mark("Orange")).toHaveCSS("outline-width", "2px");

            // The ring sits outside the mark, so its contrast is measured against what is behind the mark
            const contrast = await mark("Orange").evaluate(element => {
                const rgb = (color: string): number[] => {
                    const channels = color.match(/[\d.]+/g);
                    if (!channels || channels.length < 3) {
                        throw new Error(`Unsupported color: ${color}`);
                    }
                    return channels.map(Number);
                };
                const luminance = (channels: number[]): number =>
                    channels
                        .slice(0, 3)
                        .map(value => {
                            const channel = value / 255;
                            return channel <= 0.04045
                                ? channel / 12.92
                                : ((channel + 0.055) / 1.055) ** 2.4;
                        })
                        .reduce(
                            (sum, value, index) =>
                                sum + value * [0.2126, 0.7152, 0.0722][index],
                            0
                        );
                const layers: number[][] = [];
                let parent = element.parentElement;
                while (parent) {
                    layers.push(rgb(getComputedStyle(parent).backgroundColor));
                    parent = parent.parentElement;
                }
                const background = layers.reverse().reduce(
                    (under, over) => {
                        const alpha = over[3] ?? 1;
                        return under.map(
                            (channel, index) =>
                                over[index] * alpha + channel * (1 - alpha)
                        );
                    },
                    [255, 255, 255]
                );
                const ring = luminance(
                    rgb(getComputedStyle(element).outlineColor)
                );
                const behind = luminance(background);
                return (
                    (Math.max(ring, behind) + 0.05) /
                    (Math.min(ring, behind) + 0.05)
                );
            });
            expect(contrast).toBeGreaterThanOrEqual(3);

            await page.keyboard.press("ArrowLeft");
            await expect(
                basicGroup.getRadioInputByValue("Papaya")
            ).toBeFocused();
            await expect(mark("Papaya")).toHaveCSS("outline-style", "solid");
            await expect(mark("Orange")).toHaveCSS("outline-style", "none");
        }
    });

    test("should not be allowed to select if disabled", async () => {
        const bananaRadioInput = basicGroup.getRadioInputByValue("Banana");
        const bananaRadioLabel = basicGroup.getRadioByValue("Banana");
        const papayaRadioLabel = basicGroup.getRadioByValue("Papaya");
        const orangeRadioLabel = basicGroup.getRadioByValue("Orange");

        await expect(bananaRadioInput).toBeDisabled();
        await papayaRadioLabel.click();
        await bananaRadioLabel.click({ force: true });
        await basicGroup.toHaveRadioNotSelected("Banana");
        await basicGroup.toHaveValue("Papaya");
        await basicGroup.toHaveRadioSelected("Papaya");

        // Return to initial state
        await orangeRadioLabel.click();
        await basicGroup.toHaveValue("Orange");
    });

    test("should initialize a disabled state and be able to handle dynamic disabled state change", async () => {
        // `count()` does not retry, so wait for the items to be rendered first
        await disabledGroup.items.first().waitFor({ state: "attached" });
        const totalItems = await disabledGroup.items.count();
        await disabledGroup.toHaveDisabledItemsCount(totalItems);

        await toggleDisabledGroupCheckbox.toggle();
        await disabledGroup.toHaveDisabledItemsCount(0);

        await toggleDisabledGroupCheckbox.toggle();
        await disabledGroup.toHaveDisabledItemsCount(totalItems);
    });
});
