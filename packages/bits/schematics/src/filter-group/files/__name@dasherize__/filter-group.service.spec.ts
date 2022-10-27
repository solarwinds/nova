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
