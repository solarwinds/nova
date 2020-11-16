import { CheckboxStatus, RepeatSelectionMode, SelectionType } from "../lib/public-api";
import { SelectorService } from "../lib/selector/selector.service";

import { INovaFilteringOutputs } from "./data-source/public-api";
import { ListService } from "./list.service";
import { ISelection, SelectionModel } from "./public-api";

describe("services >", () => {
    describe("ListService >", () => {
        let listService: ListService;
        let state: INovaFilteringOutputs;

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
        const FIRST_PAGE = ALL_ITEMS.slice(0, PAGE_SIZE);

        const EMPTY_SELECTION: ISelection = new SelectionModel();

        const ITEM_ON_FIRST_PAGE = ALL_ITEMS[0];

        const ONE_ON_FIRST_PAGE_SELECTION: ISelection = new SelectionModel({ include: [ITEM_ON_FIRST_PAGE] });

        const FIRST_PAGE_SELECTION: ISelection = new SelectionModel({ include: FIRST_PAGE });

        beforeEach(() => {
            listService = new ListService(new SelectorService());
            state = {
                repeat: {
                    itemsSource: FIRST_PAGE,
                },
            };
        });

        describe("updateSelectionState >", () => {
            it("should populate an empty state", () => {
                state = {};
                state = listService.updateSelectionState(state);
                expect(state.repeat?.selectedItems).toEqual([]);
                expect(state.selector?.selection).toEqual(EMPTY_SELECTION);
                expect(state.selector?.selectorState).toEqual({
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

            it("should update the selector state and the selected items in the repeat state", () => {
                state = {
                    ...state,
                    selector: {
                        selection: ONE_ON_FIRST_PAGE_SELECTION,
                    },
                };
                state = listService.updateSelectionState(state);
                expect(state.repeat?.selectedItems).toEqual([ITEM_ON_FIRST_PAGE]);
                expect(state.selector?.selectorState).toEqual({
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

            describe("selectItems >", () => {
                it("should update the selector selection", () => {
                    state = {
                        ...state,
                        selector: {
                            selection: EMPTY_SELECTION,
                        },
                        paginator: {
                            total: ALL_ITEMS.length,
                        },
                    };
                    state = listService.selectItems([ITEM_ON_FIRST_PAGE], RepeatSelectionMode.multi, state);
                    expect(state.selector?.selection).toEqual(ONE_ON_FIRST_PAGE_SELECTION);
                });

                it("should throw error if only repeat state property is provided", () => {
                    state = {
                        repeat: {
                            itemsSource: FIRST_PAGE,
                        },
                    };
                    expect(() => listService.selectItems([ITEM_ON_FIRST_PAGE], RepeatSelectionMode.multi, state)).toThrowError();
                });
                it("should throw error if only selector state property is provided", () => {
                    state = {
                        selector: {
                            selection: EMPTY_SELECTION,
                        },
                    };
                    expect(() => listService.selectItems([ITEM_ON_FIRST_PAGE], RepeatSelectionMode.multi, state)).toThrowError();
                });
                it("should throw error if only paginator state property is provided", () => {
                    state = {
                        paginator: {
                            total: ALL_ITEMS.length,
                        },
                    };
                    expect(() => listService.selectItems([ITEM_ON_FIRST_PAGE], RepeatSelectionMode.multi, state)).toThrowError();
                });
            });

            describe("applySelector >", () => {
                it("should update the selector selection", () => {
                    state = {
                        ...state,
                        selector: {
                            selection: EMPTY_SELECTION,
                        },
                        paginator: {
                            total: ALL_ITEMS.length,
                        },
                    };
                    state = listService.applySelector(SelectionType.All, state);
                    expect(state.selector?.selection).toEqual(FIRST_PAGE_SELECTION);
                });

                it("should throw error if only repeat state property is provided", () => {
                    state = {
                        repeat: {
                            itemsSource: FIRST_PAGE,
                        },
                    };
                    expect(() => listService.applySelector(SelectionType.All, state)).toThrowError();
                });
                it("should throw error if only selector state property is provided", () => {
                    state = {
                        selector: {
                            selection: EMPTY_SELECTION,
                        },
                    };
                    expect(() => listService.applySelector(SelectionType.All, state)).toThrowError();
                });
                it("should throw error if only paginator state property is provided", () => {
                    state = {
                        paginator: {
                            total: ALL_ITEMS.length,
                        },
                    };
                    expect(() => listService.applySelector(SelectionType.All, state)).toThrowError();
                });
            });
        });
    });
});
