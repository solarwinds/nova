import { Atom } from "../../atom";
import { ButtonAtom } from "../../components/button/button.atom";
import { PopoverAtom } from "../../components/popover/popover.atom";
import { Animations, Helpers } from "../../helpers";
import { DatepickerAtom } from "../datepicker/datepicker.atom";
import { RepeatAtom } from "../repeat/repeat.atom";
import { SearchAtom } from "../search/search.atom";
import { SorterAtom } from "../sorter/sorter.atom";
import { TableAtom } from "../table/table.atom";
import { TimeFramePickerAtom } from "../time-frame-picker/time-frame-picker.atom";

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

describe("USERCONTROL data-filter-service >", () => {
    beforeEach(async () => {
        await Helpers.prepareBrowser("common/data-filter-service-test");
    });

    describe(" basic >", () => {
        let basicTimeFramePickerPopover: PopoverAtom;
        let basicTimeFramePicker: TimeFramePickerAtom;
        let basicTimeFramePickerApplyButton: ButtonAtom;
        let basicEndTimeFramePicker: DatepickerAtom;
        let basicRepeat: RepeatAtom;
        let sorterButton: ButtonAtom;
        let basicTable: TableAtom;
        let basicSorter: SorterAtom;
        let basicSearch: SearchAtom;

        beforeAll(async () => {
            await Helpers.disableCSSAnimations(Animations.ALL);
            basicTimeFramePickerPopover = Atom.find(
                PopoverAtom,
                "nui-data-filter-basic-time-frame-picker-popover"
            );
            basicTimeFramePicker = Atom.findIn(
                TimeFramePickerAtom,
                basicTimeFramePickerPopover.getPopoverBody()
            );
            basicTimeFramePickerApplyButton = Atom.find(
                ButtonAtom,
                "nui-data-filter-basic-time-frame-picker-apply-btn"
            );
            basicRepeat = Atom.find(RepeatAtom, "nui-data-filter-basic-repeat");
            basicTable = Atom.find(TableAtom, "nui-data-filter-basic-table");
            basicSorter = Atom.find(SorterAtom, "nui-data-filter-basic-sorter");
            basicSearch = Atom.find(SearchAtom, "nui-data-filter-basic-search");
            sorterButton = basicSorter.getSorterButton();
            basicEndTimeFramePicker = basicTimeFramePicker
                .getEndDatetimePicker()
                .getDatePicker();
        });

        it("should filter table and repeat from global time-frame-picker", async () => {
            await basicTimeFramePickerPopover.open();
            await basicEndTimeFramePicker.clearText();
            await basicEndTimeFramePicker.acceptText("04 Feb 2019");
            await basicTimeFramePickerApplyButton.click();
            expect(await basicTable.getRowsCount()).toEqual(3);
            expect(await basicRepeat.itemCount()).toEqual(3);

            for (
                let i = 0;
                i < expectedResultsRepeatBasic.globalTimeFramePicker.length;
                i++
            ) {
                expect(await basicRepeat.getItem(i).getText()).toEqual(
                    expectedResultsRepeatBasic.globalTimeFramePicker[i]
                );
            }

            for (
                let i = 0;
                i < expectedResultsTableBasic.globalTimeFramePicker.length;
                i++
            ) {
                expect(await basicTable.getCellText(i + 1, 1)).toEqual(
                    expectedResultsTableBasic.globalTimeFramePicker[i]
                );
            }
        });

        it("sorter on first child should sort items in table and list", async () => {
            await sorterButton.click();

            for (
                let i = 0;
                i < expectedResultsRepeatBasic.descOrderSorter.length;
                i++
            ) {
                expect(await basicRepeat.getItem(i).getText()).toEqual(
                    expectedResultsRepeatBasic.descOrderSorter[i]
                );
            }

            for (
                let i = 0;
                i < expectedResultsTableBasic.descOrderSorter.length;
                i++
            ) {
                expect(await basicTable.getCellText(i + 1, 1)).toEqual(
                    expectedResultsTableBasic.descOrderSorter[i]
                );
            }
        });

        it("search should be applied only to list", async () => {
            await basicSearch.acceptInput("Issue 1");

            for (
                let i = 0;
                i < expectedResultsRepeatBasic.searchResult.length;
                i++
            ) {
                expect(await basicRepeat.getItem(i).getText()).toEqual(
                    expectedResultsRepeatBasic.searchResult[i]
                );
            }

            for (
                let i = 0;
                i < expectedResultsTableBasic.searchResult.length;
                i++
            ) {
                expect(await basicTable.getCellText(i + 1, 1)).toEqual(
                    expectedResultsTableBasic.searchResult[i]
                );
            }
        });
    });

    describe("isolated >", () => {
        let isolatedTimeFramePickerPopover: PopoverAtom;
        let isolatedTimeFramePicker: TimeFramePickerAtom;
        let isolatedTimeFramePickerApplyButton: ButtonAtom;
        let isolatedEndTimeFramePicker: DatepickerAtom;
        let isolatedRepeat: RepeatAtom;
        let isolatedTable: TableAtom;
        let isolatedTableSearch: SearchAtom;
        let isolatedListSearch: SearchAtom;

        beforeAll(async () => {
            await Helpers.disableCSSAnimations(Animations.ALL);
            isolatedTimeFramePickerPopover = Atom.find(
                PopoverAtom,
                "nui-data-filter-isolated-time-frame-picker-popover"
            );
            isolatedTimeFramePicker = Atom.findIn(
                TimeFramePickerAtom,
                isolatedTimeFramePickerPopover.getPopoverBody()
            );
            isolatedTimeFramePickerApplyButton = Atom.find(
                ButtonAtom,
                "nui-data-filter-isolated-time-frame-picker-apply-btn"
            );
            isolatedRepeat = Atom.find(
                RepeatAtom,
                "nui-data-filter-list-isolated-repeat"
            );
            isolatedTable = Atom.find(
                TableAtom,
                "nui-data-filter-isolated-table"
            );
            isolatedTableSearch = Atom.find(
                SearchAtom,
                "nui-data-filter-isolated-table-search"
            );
            isolatedListSearch = Atom.find(
                SearchAtom,
                "nui-data-filter-isolated-list-search"
            );
            isolatedEndTimeFramePicker = isolatedTimeFramePicker
                .getEndDatetimePicker()
                .getDatePicker();
        });

        it("should filter table and repeat from global time-frame-picker", async () => {
            await isolatedTimeFramePickerPopover.open();
            await isolatedEndTimeFramePicker.clearText();
            await isolatedEndTimeFramePicker.acceptText("04 Feb 2019");
            await isolatedTimeFramePickerApplyButton.click();
            expect(await isolatedTable.getRowsCount()).toEqual(3);
            expect(await isolatedRepeat.itemCount()).toEqual(3);

            for (
                let i = 0;
                i < expectedResultsRepeatIsolated.globalTimeFramePicker.length;
                i++
            ) {
                expect(await isolatedRepeat.getItem(i).getText()).toEqual(
                    expectedResultsRepeatIsolated.globalTimeFramePicker[i]
                );
            }

            for (
                let i = 0;
                i < expectedResultsTableIsolated.globalTimeFramePicker.length;
                i++
            ) {
                expect(await isolatedTable.getCellText(i + 1, 1)).toEqual(
                    expectedResultsTableIsolated.globalTimeFramePicker[i]
                );
            }
        });

        it("search should be applied only to list", async () => {
            await isolatedListSearch.acceptInput("Issue 1");

            for (
                let i = 0;
                i < expectedResultsRepeatIsolated.searchResult.length;
                i++
            ) {
                expect(await isolatedRepeat.getItem(i).getText()).toEqual(
                    expectedResultsRepeatIsolated.searchResult[i]
                );
            }

            for (
                let i = 0;
                i < expectedResultsTableIsolated.allData.length;
                i++
            ) {
                expect(await isolatedTable.getCellText(i + 1, 1)).toEqual(
                    expectedResultsTableIsolated.allData[i]
                );
            }
        });

        it("search should be applied only to table", async () => {
            await isolatedTableSearch.acceptInput("Issue 1");

            for (
                let i = 0;
                i < expectedResultsTableIsolated.searchResult.length;
                i++
            ) {
                expect(await isolatedTable.getCellText(i + 1, 1)).toEqual(
                    expectedResultsTableIsolated.searchResult[i]
                );
            }

            for (
                let i = 0;
                i < expectedResultsRepeatIsolated.searchResult.length;
                i++
            ) {
                expect(await isolatedRepeat.getItem(i).getText()).toEqual(
                    expectedResultsRepeatIsolated.allData[i]
                );
            }
        });
    });
});
