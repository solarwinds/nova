import { CheckboxAtom } from "./checkbox.atom";
import { test, Helpers, expect } from "../../setup";

// disabling the rule until NUI-6015 is addressed
const rulesToDisable: string[] = ["nested-interactive"];

test.describe("a11y: checkbox", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("checkbox/checkbox-visual-test", page);
    });

    test("should verify a11y of checkbox", async ({ runA11yScan }) => {
        await runA11yScan(CheckboxAtom, rulesToDisable);
    });

    test("exposes instructions on the actual focused accessibility node", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("checkbox/checkbox-test", page);
        const selector = "#nui-demo-checkbox-description input[type=checkbox]";
        const input = page.locator(selector);
        await expect(input).toHaveRole("checkbox");
        await expect(input).toHaveAccessibleName("Send email notifications");
        const session = await page.context().newCDPSession(page);
        const { root } = await session.send("DOM.getDocument");
        const { nodeId } = await session.send("DOM.querySelector", {
            nodeId: root.nodeId,
            selector,
        });

        for (const [action, description] of [
            [
                null,
                "Messages are sent once a day. Confirm your email address first.",
            ],
            [
                "#checkbox-update-description",
                "Messages are sent once a week. Confirm your email address first.",
            ],
            ["#checkbox-remove-description", ""],
        ]) {
            if (action) {
                await page.locator(action).click();
            }
            await input.focus();
            await expect(input).toBeFocused();
            await expect
                .poll(async () => {
                    const { nodes } = await session.send(
                        "Accessibility.getPartialAXTree",
                        { nodeId, fetchRelatives: false }
                    );
                    const node = nodes[0];
                    return {
                        ignored: node?.ignored,
                        role: node?.role?.value,
                        name: node?.name?.value,
                        description: node?.description?.value || "",
                        focused: node?.properties?.find(
                            property => property.name === "focused"
                        )?.value.value,
                    };
                })
                .toEqual({
                    ignored: false,
                    role: "checkbox",
                    name: "Send email notifications",
                    description,
                    focused: true,
                });
        }
        await session.detach();
    });

    test("should show only the current description and keep it associated with the checkbox", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("checkbox/checkbox-test", page);
        const input = page.locator(
            "#nui-demo-checkbox-description input[type=checkbox]"
        );
        const instructions = page.locator("#checkbox-delivery-instructions");
        const updatedInstructions = page.locator(
            "#checkbox-delivery-updated-instructions"
        );
        const error = page.locator("#checkbox-delivery-error");
        await expect(instructions).toBeVisible();
        await expect(updatedInstructions).toHaveCount(0);
        await expect(error).toBeVisible();
        await expect(input).toHaveAccessibleName("Send email notifications");
        await expect(input).toHaveAccessibleDescription(
            "Messages are sent once a day. Confirm your email address first."
        );

        await page.locator("#checkbox-update-description").click();
        await expect(instructions).toHaveCount(0);
        await expect(updatedInstructions).toBeVisible();
        await expect(error).toBeVisible();
        await expect(input).toHaveAccessibleDescription(
            "Messages are sent once a week. Confirm your email address first."
        );

        await page.locator("#checkbox-remove-description").click();
        await expect(instructions).toHaveCount(0);
        await expect(updatedInstructions).toHaveCount(0);
        await expect(error).toHaveCount(0);
        await expect(input).not.toHaveAttribute("aria-describedby");
        await expect(input).toHaveAccessibleDescription("");
        await expect(input).toHaveAccessibleName("Send email notifications");

        await page.locator("#checkbox-update-description").click();
        await expect(instructions).toHaveCount(0);
        await expect(updatedInstructions).toBeVisible();
        await expect(error).toBeVisible();
        await expect(input).toHaveAccessibleDescription(
            "Messages are sent once a week. Confirm your email address first."
        );
    });

    test("should expose native checkbox states", async ({ page }) => {
        await Helpers.prepareBrowser("checkbox/checkbox-test", page);
        const basic = page.locator(
            "#nui-demo-checkbox-basic input[type=checkbox]"
        );
        const disabled = page.locator(
            "#nui-demo-checkbox-disabled input[type=checkbox]"
        );
        const indeterminate = page.locator(
            "#nui-demo-checkbox-indeterminate input[type=checkbox]"
        );

        await expect(basic).toHaveRole("checkbox");
        await expect(basic).toBeChecked();
        await expect(basic).toHaveJSProperty("required", true);
        await expect(disabled).toBeDisabled();
        await expect(disabled).toBeChecked();
        await expect(indeterminate).toBeChecked({ indeterminate: true });
        await indeterminate.focus();
        await expect(indeterminate).toBeFocused();
        await indeterminate.press("Space");
        await expect(indeterminate).toBeChecked();
        await expect(indeterminate).toHaveJSProperty("indeterminate", false);
    });
});
