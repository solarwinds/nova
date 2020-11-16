import { FilterGroupService } from "./filter-group.service";
import { IFilterGroupItem } from "./public-api";

const MOCK_ITEM_TO_REORDER: IFilterGroupItem = {
    id: "color",
    title: "Color",
    expanded: true,
    allFilterOptions: [
        {
            value: "azure",
            displayValue: "Azure",
            count: 1,
        }, {
            value: "black",
            displayValue: "Black",
            count: 1,
        }, {
            value: "blue",
            displayValue: "Blue",
            count: 1,
        }, {
            value: "yellow",
            displayValue: "Yellow",
            count: 1,
        }, {
            value: "orange",
            displayValue: "Orange",
            count: 1,
        },
    ],
    selectedFilterValues: ["orange", "yellow"],
    itemsToDisplay: 2,
};

const EXPECTED_REORDERED_RESULT = {
    id: "color",
    title: "Color",
    expanded: true,
    allFilterOptions: [
        {
            value: "azure",
            displayValue: "Azure",
            count: 1,
        }, {
            value: "black",
            displayValue: "Black",
            count: 1,
        },
        {
            value: "orange",
            displayValue: "Orange",
            count: 1,
        },
        {
            value: "yellow",
            displayValue: "Yellow",
            count: 1,
        },
        {
            value: "blue",
            displayValue: "Blue",
            count: 1,
        },
    ],
    selectedFilterValues: ["orange", "yellow"],
    itemsToDisplay: 4,
};
const MOCK_ITEM_WITHOUT_REORDER = {
    id: "color",
    title: "Color",
    expanded: true,
    allFilterOptions: [
        {
            value: "azure",
            displayValue: "Azure",
            count: 1,
        }, {
            value: "black",
            displayValue: "Black",
            count: 1,
        }, {
            value: "blue",
            displayValue: "Blue",
            count: 1,
        }, {
            value: "yellow",
            displayValue: "Yellow",
            count: 1,
        }, {
            value: "orange",
            displayValue: "Orange",
            count: 1,
        },
    ],
    selectedFilterValues: ["orange", "yellow"],
    itemsToDisplay: 2,
};
describe("FilterGroupService >", () => {
    let serviceInstance: FilterGroupService;

    beforeEach(() => {
        serviceInstance = new FilterGroupService();
    });
    // test if itemsToDisplay are less than allFilterOptions length
    it("should reorder allFilterOptions and increment itemsToDisplay", () => {
        expect(serviceInstance.appendHiddenFilters(MOCK_ITEM_TO_REORDER)).toEqual(EXPECTED_REORDERED_RESULT);
    });
    // test if itemsToDisplay are greater than allFilterOptions length
    it("shouldn't reorder allFilterOptions and increment itemsToDisplay", () => {
        expect(serviceInstance.appendHiddenFilters(MOCK_ITEM_WITHOUT_REORDER)).toEqual(MOCK_ITEM_WITHOUT_REORDER);
    });

});
