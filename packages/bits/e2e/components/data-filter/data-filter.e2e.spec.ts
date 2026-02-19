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

import { Atom } from "../../atom";
import { ButtonAtom } from "../button/button.atom";
import { PopoverAtom } from "../popover/popover.atom";
import { DatepickerAtom } from "../datepicker/datepicker.atom";
import { RepeatAtom } from "../repeat/repeat.atom";
import { SearchAtom } from "../search/search.atom";
import { SorterAtom } from "../sorter/sorter.atom";
import { TableAtom } from "../table/table.atom";
import { TimeFramePickerAtom } from "../time-frame-picker/time-frame-picker.atom";
import { Animations, expect, Helpers, test } from "../../setup";

const expectedResultsRepeatBasic = {
    globalTimeFramePicker: [
        "Issue 1 - Wednesday, January 02, 2019",
        "Issue 2 - Friday, January 11, 2019",
        "Issue 4 - Wednesday, January 02, 2019",
    ],
    searchResult: ["Issue 1 - Wednesday, January 02, 2019"],
    descOrderSorter: [
        "Issue 5 - Sunday, February 10, 2019",
        "Issue 4 - Wednesday, January 02, 2019",
        "Issue 3 - Tuesday, February 12, 2019",
        "Issue 2 - Friday, January 11, 2019",
        "Issue 1 - Wednesday, January 02, 2019",
    ],
};

const expectedResultsTableBasic = {
    globalTimeFramePicker: ["Issue 1", "Issue 2", "Issue 4"],
    searchResult: ["Issue 1", "Issue 2", "Issue 3", "Issue 4", "Issue 5"],
    descOrderSorter: ["Issue 5", "Issue 4", "Issue 3", "Issue 2", "Issue 1"],
};
const expectedResultsRepeatIsolated = {
    globalTimeFramePicker: [
        "Issue 1 - Wednesday, January 02, 2019",
        "Issue 2 - Friday, January 11, 2019",
        "Issue 4 - Wednesday, January 02, 2019",
    ],
    searchResult: ["Issue 1 - Wednesday, January 02, 2019"],
    allData: [
        "Issue 1 - Wednesday, January 02, 2019",
        "Issue 2 - Friday, January 11, 2019",
        "Issue 3 - Tuesday, February 12, 2019",
        "Issue 4 - Wednesday, January 02, 2019",
        "Issue 5 - Sunday, February 10, 2019",
    ],
};

const expectedResultsTableIsolated = {
    globalTimeFramePicker: ["Issue 1", "Issue 2", "Issue 4"],
    searchResult: ["Issue 1"],
    allData: ["Issue 1", "Issue 2", "Issue 3", "Issue 4", "Issue 5"],
};

test.describe("USERCONTROL data-filter-service >", () => {
    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("common/data-filter-service-test", page);
    });

    test.describe(" basic >", () => {
        let basicTimeFramePickerPopover: PopoverAtom;
        let basicTimeFramePicker: TimeFramePickerAtom;
        let basicTimeFramePickerApplyButton: ButtonAtom;
        let basicEndTimeFramePicker: DatepickerAtom;
        let basicRepeat: RepeatAtom;
        let sorterButton: ButtonAtom;
        let basicTable: TableAtom;
        let basicSorter: SorterAtom;
        let basicSearch: SearchAtom;

        test.beforeEach(async () => {
            await Helpers.disableCSSAnimations(Animations.ALL);
            basicTimeFramePickerPopover = Atom.find<PopoverAtom>(
                PopoverAtom,
                "nui-data-filter-basic-time-frame-picker-popover"
            );
            basicTimeFramePicker = Atom.findIn<TimeFramePickerAtom>(
                TimeFramePickerAtom,
                basicTimeFramePickerPopover.getPopoverBody()
            );
            basicTimeFramePickerApplyButton = Atom.find<ButtonAtom>(
                ButtonAtom,
                "nui-data-filter-basic-time-frame-picker-apply-btn",
                true

            );
            basicRepeat = Atom.find<RepeatAtom>(RepeatAtom, "nui-data-filter-basic-repeat");
            basicTable = Atom.find<TableAtom>(TableAtom, "nui-data-filter-basic-table", true);
            basicSorter = Atom.find<SorterAtom>(SorterAtom, "nui-data-filter-basic-sorter", true);
            basicSearch = Atom.find<SearchAtom>(SearchAtom, "nui-data-filter-basic-search", true);
            sorterButton = basicSorter.sorterButton;
            basicEndTimeFramePicker = basicTimeFramePicker
                .getEndDatetimePicker()
                .datePicker;
        });

        test("should filter table and repeat from global time-frame-picker", async () => {
            await basicTimeFramePickerPopover.open();
            await basicEndTimeFramePicker.clearText();
            await basicEndTimeFramePicker.acceptText("04 Feb 2019");
            await basicTimeFramePickerApplyButton.click();
            await basicTimeFramePickerPopover.waitForClosed();

            const expectedRepeat = expectedResultsRepeatBasic.globalTimeFramePicker;
            const expectedTable = expectedResultsTableBasic.globalTimeFramePicker;

            await expect(basicRepeat.items).toHaveCount(expectedRepeat.length);
            expect(await basicTable.getRowsCount()).toBe(expectedTable.length);

            for (let i = 0; i < expectedRepeat.length; i++) {
                await expect(basicRepeat.getItem(i)).toHaveText(expectedRepeat[i]);
            }

            for (let i = 0; i < expectedTable.length; i++) {
                await expect(basicTable.getCell(i + 1, 1)).toHaveText(expectedTable[i]);
            }
        });

        test("sorter on first child should sort items in table and list", async () => {
            await sorterButton.toBeVisible();
            await sorterButton.click();

            const expectedRepeat = expectedResultsRepeatBasic.descOrderSorter;
            const expectedTable = expectedResultsTableBasic.descOrderSorter;

            for (let i = 0; i < expectedRepeat.length; i++) {
                await expect(basicRepeat.getItem(i)).toHaveText(expectedRepeat[i]);
            }

            for (let i = 0; i < expectedTable.length; i++) {
                await expect(basicTable.getCell(i + 1, 1)).toHaveText(expectedTable[i]);
            }
        });

        test("search should be applied only to list", async () => {
            await basicSearch.acceptInput("Issue 1");

            const expectedRepeat = expectedResultsRepeatBasic.searchResult;
            const expectedTable = expectedResultsTableBasic.searchResult;

            for (let i = 0; i < expectedRepeat.length; i++) {
                await expect(basicRepeat.getItem(i)).toHaveText(expectedRepeat[i]);
            }

            for (let i = 0; i < expectedTable.length; i++) {
                await expect(basicTable.getCell(i + 1, 1)).toHaveText(expectedTable[i]);
            }
        });
    });

    test.describe("isolated >", () => {
        let isolatedTimeFramePickerPopover: PopoverAtom;
        let isolatedTimeFramePicker: TimeFramePickerAtom;
        let isolatedTimeFramePickerApplyButton: ButtonAtom;
        let isolatedEndTimeFramePicker: DatepickerAtom;
        let isolatedRepeat: RepeatAtom;
        let isolatedTable: TableAtom;
        let isolatedTableSearch: SearchAtom;
        let isolatedListSearch: SearchAtom;

        test.beforeEach(async () => {
            await Helpers.disableCSSAnimations(Animations.ALL);
            isolatedTimeFramePickerPopover = Atom.find<PopoverAtom>(
                PopoverAtom,
                "nui-data-filter-isolated-time-frame-picker-popover"
            );
            isolatedTimeFramePicker = Atom.findIn<TimeFramePickerAtom>(
                TimeFramePickerAtom,
                isolatedTimeFramePickerPopover.getPopoverBody()
            );
            isolatedTimeFramePickerApplyButton = Atom.find<ButtonAtom>(
                ButtonAtom,
                "nui-data-filter-isolated-time-frame-picker-apply-btn",
                true
            );
            isolatedRepeat = Atom.find<RepeatAtom>(
                RepeatAtom,
                "nui-data-filter-list-isolated-repeat"
            );
            isolatedTable = Atom.find<TableAtom>(
                TableAtom,
                "nui-data-filter-isolated-table",
                true
            );
            isolatedTableSearch = Atom.find<SearchAtom>(
                SearchAtom,
                "nui-data-filter-isolated-table-search",
                true
            );
            isolatedListSearch = Atom.find<SearchAtom>(
                SearchAtom,
                "nui-data-filter-isolated-list-search",
                true
            );
            isolatedEndTimeFramePicker = isolatedTimeFramePicker
                .getEndDatetimePicker()
                .datePicker;
        });

        test("should filter table and repeat from global time-frame-picker", async () => {
            await isolatedTimeFramePickerPopover.open();
            await isolatedEndTimeFramePicker.clearText();
            await isolatedEndTimeFramePicker.acceptText("04 Feb 2019");
            await isolatedTimeFramePickerApplyButton.click();

            const expectedRepeat = expectedResultsRepeatIsolated.globalTimeFramePicker;
            const expectedTable = expectedResultsTableIsolated.globalTimeFramePicker;

            await expect(isolatedRepeat.items).toHaveCount(expectedRepeat.length);
            await expect(isolatedTable.getLocator().locator("tr")).toHaveCount(expectedTable.length + 1);

            for (let i = 0; i < expectedRepeat.length; i++) {
                await expect(isolatedRepeat.getItem(i)).toHaveText(expectedRepeat[i]);
            }

            for (let i = 0; i < expectedTable.length; i++) {
                await expect(isolatedTable.getCell(i + 1, 1)).toHaveText(expectedTable[i]);
            }
        });

        test("search should be applied only to list", async () => {
            await isolatedListSearch.waitElementVisible();
            await isolatedListSearch.acceptInput("Issue 1");

            const expectedRepeat = expectedResultsRepeatIsolated.searchResult;
            const expectedTable = expectedResultsTableIsolated.allData;

            for (let i = 0; i < expectedRepeat.length; i++) {
                await expect(isolatedRepeat.getItem(i)).toHaveText(expectedRepeat[i]);
            }

            for (let i = 0; i < expectedTable.length; i++) {
                await expect(isolatedTable.getCell(i + 1, 1)).toHaveText(expectedTable[i]);
            }
        });

        test("search should be applied only to table", async () => {
            await isolatedTableSearch.waitElementVisible();
            await isolatedTableSearch.acceptInput("Issue 1");

            const expectedTable = expectedResultsTableIsolated.searchResult;
            const expectedRepeat = expectedResultsRepeatIsolated.allData;

            for (let i = 0; i < expectedTable.length; i++) {
                await expect(isolatedTable.getCell(i + 1, 1)).toHaveText(expectedTable[i]);
            }

            for (let i = 0; i < expectedRepeat.length; i++) {
                await expect(isolatedRepeat.getItem(i)).toHaveText(expectedRepeat[i]);
            }
        });
    });
});
