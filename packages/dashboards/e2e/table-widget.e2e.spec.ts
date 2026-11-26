import { expect, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

test("selects a table data source by mouse inside the configurator", async ({
    page,
}) => {
    await Helpers.prepareBrowser("test/table", page);
    await page
        .getByRole("checkbox", { name: "Edit Mode", exact: true })
        .click();
    const widget = page.locator("nui-widget").filter({
        has: page.getByRole("heading", {
            name: "Another Table Widget!",
            exact: true,
        }),
    });
    await widget.locator("button.nui-widget-header__action-edit").click();

    const dialog = page.getByRole("dialog", { name: "Widget configuration" });
    await dialog.getByRole("button", { name: /^Data Source\b/ }).click();
    const trigger = dialog.getByRole("combobox", {
        name: "Select Data Source",
        exact: true,
    });
    await expect(trigger).toHaveText("TestTableDataSource2");

    const triggerId = await trigger.getAttribute("id");
    const listbox = page.locator(
        `[role="listbox"][aria-labelledby="${triggerId}"]`
    );
    await trigger.click();
    await listbox
        .getByRole("option", {
            name: "TestTableDataSource",
            exact: true,
        })
        .click();

    await expect(trigger).toHaveText("TestTableDataSource");
    await expect(listbox).toBeHidden();
});
