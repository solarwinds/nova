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
        const selector = "#nui-demo-checkbox-description label";
        const label = page.locator(selector);
        await expect(label).toHaveAccessibleName("Send email notifications");
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
            await label.focus();
            await expect(label).toBeFocused();
            await expect
                .poll(async () => {
                    const { nodes } = await session.send(
                        "Accessibility.getPartialAXTree",
                        { nodeId, fetchRelatives: false }
                    );
                    const node = nodes[0];
                    return {
                        ignored: node?.ignored,
                        name: node?.name?.value,
                        description: node?.description?.value || "",
                        focused: node?.properties?.find(
                            property => property.name === "focused"
                        )?.value.value,
                    };
                })
                .toEqual({
                    ignored: false,
                    name: "Send email notifications",
                    description,
                    focused: true,
                });
        }
        await session.detach();
    });

    test("should update and remove descriptions on the focusable checkbox label", async ({
        page,
    }) => {
        await Helpers.prepareBrowser("checkbox/checkbox-test", page);
        const label = page.locator("#nui-demo-checkbox-description label");
        await expect(label).toHaveAccessibleName("Send email notifications");
        await expect(label).toHaveAccessibleDescription(
            "Messages are sent once a day. Confirm your email address first."
        );

        await page.locator("#checkbox-update-description").click();
        await expect(label).toHaveAccessibleDescription(
            "Messages are sent once a week. Confirm your email address first."
        );

        await page.locator("#checkbox-remove-description").click();
        await expect(label).toHaveAccessibleDescription("");
        await expect(label).toHaveAccessibleName("Send email notifications");
    });
});
