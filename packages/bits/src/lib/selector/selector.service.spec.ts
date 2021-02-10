import { ISelection, SelectionModel } from "../../services/public-api";
import {RepeatSelectionMode} from "../repeat/types";

import {CheckboxStatus, SelectionType} from "./public-api";
import { SelectorService } from "./selector.service";

describe("services >", () => {
    describe("SelectorService >", () => {
        let selectorService: SelectorService;

        const ALL_ITEMS = [
            { id: 1 },
            { id: 2 },
            { id: 3 },
            { id: 4 },
            { id: 5 },
            { id: 6 },
            { id: 7 },
        ];

        const PAGE_SIZE = 5;
        const TOTAL_SIZE = 7;

        const FIRST_PAGE = ALL_ITEMS.slice(0, PAGE_SIZE);

        const SECOND_PAGE = ALL_ITEMS.slice(PAGE_SIZE);

        const EMPTY_SELECTION: ISelection = new SelectionModel();

        const ITEM_ON_FIRST_PAGE = ALL_ITEMS[0];
        const ITEM_ON_SECOND_PAGE = ALL_ITEMS[5];

        const ONE_ON_EACH_PAGE_SELECTION: ISelection = new SelectionModel({ include: [ITEM_ON_FIRST_PAGE, ITEM_ON_SECOND_PAGE] });

        const ONE_ON_FIRST_PAGE_SELECTION: ISelection = new SelectionModel({ include: [ITEM_ON_FIRST_PAGE] });

        const ONE_ON_SECOND_PAGE_SELECTION: ISelection = new SelectionModel({ include: [ITEM_ON_SECOND_PAGE] });

        const FULL_SELECTION: ISelection = new SelectionModel({ isAllPages: true });

        const FULL_SELECTION_WITHOUT_FIRST_PAGE: ISelection = new SelectionModel({
            isAllPages: true,
            exclude: FIRST_PAGE,
        });

        const FULL_SELECTION_WITHOUT_SECOND_PAGE: ISelection = new SelectionModel({
            isAllPages: true,
            exclude: SECOND_PAGE,
        });

        const FIRST_PAGE_SELECTION: ISelection = new SelectionModel({ include: FIRST_PAGE });

        const FIRST_AND_SECOND_PAGES_SELECTION: ISelection = new SelectionModel({
            include: ALL_ITEMS,
        });

        const SINGLE_PAGE_WITHOUT_ITEM: ISelection = new SelectionModel({
            isAllPages: true,
            exclude: [ITEM_ON_FIRST_PAGE],
        });

        beforeEach(() => {
            selectorService = new SelectorService();
        });

        describe("applySelector >", () => {
            it("should select first page", () => {
                const newSelection = selectorService.applySelector(
                    EMPTY_SELECTION,
                    FIRST_PAGE,
                    SelectionType.All,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(FIRST_PAGE_SELECTION);
            });
            it("should select all items on two pages if they were selected one by one", () => {
                const newSelection = selectorService.applySelector(
                    FIRST_PAGE_SELECTION,
                    SECOND_PAGE,
                    SelectionType.All,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(FIRST_AND_SECOND_PAGES_SELECTION);
            });
            it("should select all pages", () => {
                const newSelection = selectorService.applySelector(
                    EMPTY_SELECTION,
                    FIRST_PAGE,
                    SelectionType.AllPages,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(FULL_SELECTION);
            });
            it("should unselect all pages", () => {
                const newSelection = selectorService.applySelector(
                    FULL_SELECTION,
                    FIRST_PAGE,
                    SelectionType.None,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(EMPTY_SELECTION);
            });
            it("should unselect first page when everything is selected", () => {
                const newSelection = selectorService.applySelector(
                    FULL_SELECTION,
                    FIRST_PAGE,
                    SelectionType.UnselectAll,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(FULL_SELECTION_WITHOUT_FIRST_PAGE);
            });
            it("should unselect second page when everything is selected", () => {
                const newSelection = selectorService.applySelector(
                    FULL_SELECTION,
                    SECOND_PAGE,
                    SelectionType.UnselectAll,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(FULL_SELECTION_WITHOUT_SECOND_PAGE);
            });
            it("should unselect second page when some items an every page are selected", () => {
                const newSelection = selectorService.applySelector(
                    ONE_ON_EACH_PAGE_SELECTION,
                    SECOND_PAGE,
                    SelectionType.UnselectAll,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(ONE_ON_FIRST_PAGE_SELECTION);
            });
        });

        describe("getSelectedItems >", () => {
            it("should get selected items from full selection", () => {
                const selectedItems = selectorService.getSelectedItems(
                    FULL_SELECTION,
                    SECOND_PAGE
                );
                expect(selectedItems).toEqual(SECOND_PAGE);
            });
            it("should get selected items from partial selection", () => {
                const selectedItems = selectorService.getSelectedItems(
                    ONE_ON_EACH_PAGE_SELECTION,
                    SECOND_PAGE
                );
                expect(selectedItems).toEqual([ITEM_ON_SECOND_PAGE]);
            });
            it("should get selected items from empty selection", () => {
                const selectedItems = selectorService.getSelectedItems(
                    EMPTY_SELECTION,
                    SECOND_PAGE
                );
                expect(selectedItems).toEqual([]);
            });
        });

        describe("getSelectorState >", () => {

            describe("multiple pages >", () => {
                it("should return correct selector state if no items on page are selected and there are multiple pages", () => {
                    const newSelectorState = selectorService.getSelectorState(
                        EMPTY_SELECTION,
                        5,
                        0,
                        10
                    );
                    expect(newSelectorState).toEqual({
                        checkboxStatus: CheckboxStatus.Unchecked,
                        selectorItems: [{
                            itemsSource: [
                                {
                                    value: SelectionType.AllPages,
                                    title: SelectionType.AllPages,
                                },
                                {
                                    value: SelectionType.All,
                                    title: SelectionType.All,
                                },
                            ],
                        }],
                    });
                });

                it("should return correct selector state if some items on page are selected", () => {
                    const newSelectorState = selectorService.getSelectorState(
                        ONE_ON_EACH_PAGE_SELECTION,
                        5,
                        1,
                        10
                    );
                    expect(newSelectorState).toEqual({
                        checkboxStatus: CheckboxStatus.Indeterminate,
                        selectorItems: [{
                            itemsSource: [
                                {
                                    value: SelectionType.All,
                                    title: SelectionType.All,
                                },
                                {
                                    value: SelectionType.AllPages,
                                    title: SelectionType.AllPages,
                                },
                                {
                                    value: SelectionType.None,
                                    title: SelectionType.None,
                                },
                            ],
                        }],
                    });
                });

                it("should return correct selector state if all items on page are selected", () => {
                    const newSelectorState = selectorService.getSelectorState(
                        FIRST_PAGE_SELECTION,
                        5,
                        5,
                        10
                    );
                    expect(newSelectorState).toEqual({
                        checkboxStatus: CheckboxStatus.Checked,
                        selectorItems: [{
                            itemsSource: [
                                {
                                    value: SelectionType.AllPages,
                                    title: SelectionType.AllPages,
                                },
                                {
                                    value: SelectionType.None,
                                    title: SelectionType.None,
                                },
                            ],
                        }],
                    });
                });

                it("should return correct selector state if all items on all pages are selected", () => {
                    const newSelectorState = selectorService.getSelectorState(
                        FULL_SELECTION,
                        5,
                        5,
                        10
                    );
                    expect(newSelectorState).toEqual({
                        checkboxStatus: CheckboxStatus.Checked,
                        selectorItems: [{
                            itemsSource: [
                                {
                                    value: SelectionType.None,
                                    title: SelectionType.None,
                                },
                            ],
                        }],
                    });
                });
                it("should return correct selector state if no items are selected on current page but some items are selected on other pages", () => {
                    const newSelectorState = selectorService.getSelectorState(
                        EMPTY_SELECTION,
                        5,
                        0,
                        10,
                        2
                    );
                    expect(newSelectorState).toEqual({
                        checkboxStatus: CheckboxStatus.Unchecked,
                        selectorItems: [{
                            itemsSource: [
                                {
                                    value: SelectionType.All,
                                    title: SelectionType.All,
                                },
                                {
                                    value: SelectionType.AllPages,
                                    title: SelectionType.AllPages,
                                },
                                {
                                    value: SelectionType.None,
                                    title: SelectionType.None,
                                },
                            ],
                        }],
                    });
                });

                it("should return correct selector state if isAllPages is true but some items from other page are excluded", () => {
                    const newSelectorState = selectorService.getSelectorState(
                        FULL_SELECTION_WITHOUT_SECOND_PAGE,
                        5,
                        5,
                        10
                    );
                    expect(newSelectorState).toEqual({
                        checkboxStatus: CheckboxStatus.Checked,
                        selectorItems: [{
                            itemsSource: [
                                {
                                    value: SelectionType.AllPages,
                                    title: SelectionType.AllPages,
                                },
                                {
                                    value: SelectionType.None,
                                    title: SelectionType.None,
                                },
                            ],
                        }],
                    });
                });
            });


            describe("single page > ", () => {
                it("should return correct selector state if there are only one page and items are selected", () => {
                    const newSelectorState = selectorService.getSelectorState(
                        FULL_SELECTION,
                        5,
                        5,
                        5
                    );
                    expect(newSelectorState).toEqual({
                        checkboxStatus: CheckboxStatus.Checked,
                        selectorItems: [{
                            itemsSource: [
                                {
                                    value: SelectionType.None,
                                    title: SelectionType.None,
                                },
                            ],
                        }],
                    });
                });

                it("should return correct selector state if there are only one page and items are not selected", () => {
                    const newSelectorState = selectorService.getSelectorState(
                        EMPTY_SELECTION,
                        5,
                        0,
                        5
                    );
                    expect(newSelectorState).toEqual({
                        checkboxStatus: CheckboxStatus.Unchecked,
                        selectorItems: [{
                            itemsSource: [
                                {
                                    value: SelectionType.All,
                                    title: SelectionType.All,
                                },
                            ],
                        }],
                    });
                });

                it("should return correct selector state isAllPages is true but some items from are excluded", () => {
                    const newSelectorState = selectorService.getSelectorState(
                        SINGLE_PAGE_WITHOUT_ITEM,
                        5,
                        4,
                        5
                    );
                    expect(newSelectorState).toEqual({
                        checkboxStatus: CheckboxStatus.Indeterminate,
                        selectorItems: [{
                            itemsSource: [
                                {
                                    value: SelectionType.All,
                                    title: SelectionType.All,
                                },
                                {
                                    value: SelectionType.None,
                                    title: SelectionType.None,
                                },
                            ],
                        }],
                    });
                });
            });
        });

        describe("selectItems >", () => {
            it("should return empty selection for None selection mode in any case", () => {
                const newSelection = selectorService.selectItems(
                    FULL_SELECTION,
                    [ITEM_ON_FIRST_PAGE],
                    FIRST_PAGE,
                    RepeatSelectionMode.none,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(EMPTY_SELECTION);
            });
            it("should return one item for single selection modes", () => {
                Object.values(RepeatSelectionMode).forEach(selectionMode => {
                    if (selectionMode !== RepeatSelectionMode.none && selectionMode !== RepeatSelectionMode.multi) {
                        const newSelection = selectorService.selectItems(
                            EMPTY_SELECTION,
                            [ITEM_ON_FIRST_PAGE],
                            FIRST_PAGE,
                            selectionMode,
                            TOTAL_SIZE
                        );
                        expect(newSelection).toEqual(ONE_ON_FIRST_PAGE_SELECTION);
                    }
                });
            });
            it("should return one item for single selection modes regardless of initial selection", () => {
                Object.values(RepeatSelectionMode).forEach(selectionMode => {
                    if (selectionMode !== RepeatSelectionMode.none && selectionMode !== RepeatSelectionMode.multi) {
                        const newSelection = selectorService.selectItems(
                            FULL_SELECTION,
                            [ITEM_ON_FIRST_PAGE],
                            FIRST_PAGE,
                            selectionMode,
                            TOTAL_SIZE
                        );
                        expect(newSelection).toEqual(ONE_ON_FIRST_PAGE_SELECTION);
                    }
                });
            });
            it("should return one item for single selection modes when a previous selection was made, and a new item has been selected", () => {
                Object.values(RepeatSelectionMode).forEach(selectionMode => {
                    if (selectionMode !== RepeatSelectionMode.none && selectionMode !== RepeatSelectionMode.multi) {
                        const newSelection = selectorService.selectItems(
                            ONE_ON_SECOND_PAGE_SELECTION,
                            [ITEM_ON_FIRST_PAGE],
                            FIRST_PAGE,
                            selectionMode,
                            TOTAL_SIZE
                        );
                        expect(newSelection).toEqual(ONE_ON_FIRST_PAGE_SELECTION);
                    }
                });
            });
            it("should return an empty selection for single selection modes when a previous selection was not made, and no new item has been selected", () => {
                Object.values(RepeatSelectionMode).forEach(selectionMode => {
                    if (selectionMode !== RepeatSelectionMode.none && selectionMode !== RepeatSelectionMode.multi) {
                        const newSelection = selectorService.selectItems(
                            EMPTY_SELECTION,
                            [],
                            FIRST_PAGE,
                            selectionMode,
                            TOTAL_SIZE
                        );
                        expect(newSelection).toEqual(EMPTY_SELECTION);
                    }
                });
            });
            it("should return correct selection if isAllPages is true and not everything is selected", () => {
                const newSelection = selectorService.selectItems(
                    FULL_SELECTION,
                    [],
                    SECOND_PAGE,
                    RepeatSelectionMode.multi,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(FULL_SELECTION_WITHOUT_SECOND_PAGE);
            });
            it("should return correct selection if isAllPages is false and everything is selected", () => {
                const newSelection = selectorService.selectItems(
                    FIRST_PAGE_SELECTION,
                    SECOND_PAGE,
                    SECOND_PAGE,
                    RepeatSelectionMode.multi,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(FIRST_AND_SECOND_PAGES_SELECTION);
                expect(newSelection.isAllPages).toEqual(false);
            });
            it("should return correct selection if isAllPages is false and something is (un)selected", () => {
                const newSelection = selectorService.selectItems(
                    ONE_ON_EACH_PAGE_SELECTION,
                    [],
                    FIRST_PAGE,
                    RepeatSelectionMode.multi,
                    TOTAL_SIZE
                );
                expect(newSelection).toEqual(ONE_ON_SECOND_PAGE_SELECTION);
            });
        });
    });
});

