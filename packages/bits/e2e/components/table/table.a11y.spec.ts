import { TableAtom } from "./table.atom";
import { Helpers, test } from "../../setup";

const rulesToDisable: string[] = [
    "duplicate-id", // we don't care for the testing pages
    "aria-allowed-role", // NUI-6015
    "aria-required-parent", // NUI-6133
    "nested-interactive",
];
test.describe("a11y: table", () => {
    test.beforeEach(async ({ page }): Promise<void> => {
        await Helpers.prepareBrowser("table/visual-test", page);
    });

    test("should check a11y of table", async ({ runA11yScan }) => {
        await runA11yScan(TableAtom, rulesToDisable);
    });
});
