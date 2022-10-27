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

import { SorterDirection } from "../../../lib/sorter/public-api";
import {
    IFilter,
    IFilterGroup,
    IFilterItem,
    IMultiFilterMetadata,
    INovaFilters,
} from "../public-api";

export interface ExampleItem {
    color: string;
    status: string;
}

export interface NewFiltersExampleItem {
    color: string;
    status: string;
    country: string;
    number: string;
}

export interface ComparisonItems {
    previousValue: any;
    currentValue: any;
}

// new filters big test
export const newFiltersExpectedResultItemsArr: NewFiltersExampleItem[] = [
    { color: "light-blue", status: "Up", country: "Ukraine", number: "seven" },
];

export const newFiltersExpectedallCategoriesResult = (): IFilterGroup<
    IFilterItem<number>
> => ({
    country: {
        France: 0,
        Italy: 0,
        Spain: 0,
        USA: 0,
        Ukraine: 1,
    },
    number: {
        five: 0,
        four: 0,
        one: 0,
        seven: 1,
        six: 0,
        three: 0,
        two: 0,
    },
});

export const newFilters = {
    country: {
        type: "string[]",
        value: ["Ukraine"],
        metadata: {
            allCategories: ["Ukraine", "USA", "France", "Spain", "Italy"],
        },
    },
    number: {
        type: "string[]",
        value: ["seven"],
        metadata: {
            allCategories: [
                "one",
                "two",
                "three",
                "four",
                "five",
                "six",
                "seven",
            ],
        },
    },
};

export const newFiltersbigArrForSearch: NewFiltersExampleItem[] = [
    {
        color: "regular-blue",
        status: "Critical",
        country: "Ukraine",
        number: "one",
    },
    {
        color: "regular-green",
        status: "Warning",
        country: "USA",
        number: "two",
    },
    {
        color: "regular-yellow",
        status: "Up",
        country: "France",
        number: "three",
    },
    {
        color: "regular-cyan ",
        status: "Critical",
        country: "Spain",
        number: "four",
    },
    {
        color: "regular-magenta",
        status: "Warning",
        country: "Italy",
        number: "five",
    },
    { color: "regular-black", status: "Up", country: "Ukraine", number: "six" },
    { color: "regular-orange", status: "Up", country: "USA", number: "seven" },
    { color: "regular-rose", status: "Up", country: "France", number: "one" },
    { color: "regular-violet", status: "Up", country: "Spain", number: "two" },
    {
        color: "regular-azure",
        status: "Critical",
        country: "Italy",
        number: "three",
    },
    {
        color: "dark-blue",
        status: "Warning",
        country: "Ukraine",
        number: "four",
    },
    { color: "dark-green", status: "Up", country: "USA", number: "five" },
    {
        color: "dark-yellow",
        status: "Critical",
        country: "France",
        number: "six",
    },
    {
        color: "dark-cyan ",
        status: "Warning",
        country: "Spain",
        number: "seven",
    },
    { color: "dark-magenta", status: "Up", country: "Italy", number: "one" },
    {
        color: "dark-black",
        status: "Critical",
        country: "Ukraine",
        number: "two",
    },
    {
        color: "dark-orange",
        status: "Warning",
        country: "USA",
        number: "three",
    },
    { color: "dark-rose", status: "Up", country: "France", number: "four" },
    {
        color: "dark-violet",
        status: "Critical",
        country: "Spain",
        number: "five",
    },
    { color: "dark-azure", status: "Warning", country: "Italy", number: "six" },
    { color: "light-blue", status: "Up", country: "Ukraine", number: "seven" },
    { color: "light-green", status: "Critical", country: "USA", number: "one" },
    {
        color: "light-yellow",
        status: "Warning",
        country: "France",
        number: "two",
    },
    { color: "light-cyan", status: "Up", country: "Spain", number: "three" },
    {
        color: "light-magenta",
        status: "Critical",
        country: "Italy",
        number: "four",
    },
    {
        color: "light-black",
        status: "Warning",
        country: "Ukraine",
        number: "five",
    },
    { color: "light-orange", status: "Up", country: "USA", number: "six" },
    {
        color: "light-rose",
        status: "Critical",
        country: "France",
        number: "seven",
    },
    {
        color: "light-violet",
        status: "Warning",
        country: "Spain",
        number: "one",
    },
    { color: "light-azure", status: "Up", country: "Italy", number: "two" },
];

// extractMultiFilters data
export const anyFilters: INovaFilters = {
    color: {
        type: "string[]",
        value: ["azure"],
        metadata: {
            allCategories: [
                "azure",
                "black",
                "blue",
                "cyan",
                "green",
                "orange",
                "rose",
                "violet",
                "yellow",
            ],
        },
    },
    paginator: {
        type: "range",
        value: {
            start: 0,
            end: 5,
        },
    },
    search: {
        type: "range",
        value: "",
    },
    sorter: {
        type: "range",
        value: {
            sortBy: "color",
            direction: SorterDirection.ascending,
        },
    },
    status: {
        type: "string[]",
        value: ["Critical"],
        metadata: {
            allCategories: ["Warning", "Critical", "Up"],
        },
    },
};

export const correctmultiFilters: IFilterGroup<
    IFilter<string[], IMultiFilterMetadata>
>[] = [
    {
        color: {
            type: "string[]",
            value: ["azure"],
            metadata: {
                allCategories: [
                    "azure",
                    "black",
                    "blue",
                    "cyan",
                    "green",
                    "orange",
                    "rose",
                    "violet",
                    "yellow",
                ],
            },
        },
    },
    {
        status: {
            type: "string[]",
            value: ["Critical"],
            metadata: {
                allCategories: ["Warning", "Critical", "Up"],
            },
        },
    },
];

// isValueChanged data
export const changedArrForComparison: ComparisonItems[] = [
    { previousValue: "one", currentValue: "two" },
    { previousValue: 5, currentValue: 10 },
];

export const unchangedArrForComparison: ComparisonItems[] = [
    { previousValue: "one", currentValue: "one" },
    { previousValue: 5, currentValue: 5 },
];

// getAllCategories data
export const muiltiFilter: IFilterGroup<
    IFilter<string[], IMultiFilterMetadata>
> = {
    color: {
        type: "string[]",
        value: ["azure"],
        metadata: {
            allCategories: [
                "azure",
                "black",
                "blue",
                "cyan",
                "green",
                "orange",
                "rose",
                "violet",
                "yellow",
            ],
        },
    },
};

export const allCategoriesForColor: IFilterItem<string[]> = {
    color: [
        "azure",
        "black",
        "blue",
        "cyan",
        "green",
        "orange",
        "rose",
        "violet",
        "yellow",
    ],
};

// countAvailableResults data
export const allCategoriesArr = [
    {
        color: [
            "azure",
            "black",
            "blue",
            "cyan",
            "green",
            "orange",
            "rose",
            "violet",
            "yellow",
        ],
    },
    {
        status: ["Warning", "Critical", "Up"],
    },
];

export const expectedAllCategoriesResult = (): IFilterGroup<
    IFilterItem<number>
> => ({
    color: {
        azure: 3,
        black: 0,
        blue: 0,
        cyan: 0,
        green: 0,
        orange: 0,
        rose: 0,
        violet: 0,
        yellow: 0,
    },
    status: {
        Critical: 1,
        Up: 1,
        Warning: 1,
    },
});

export const arrayToSearchIn = [
    { color: "regular-azure", status: "Critical" },
    { color: "dark-azure", status: "Warning" },
    { color: "light-azure", status: "Up" },
];

// searchThru
export const bigArrForSearch: ExampleItem[] = [
    { color: "regular-blue", status: "Critical" },
    { color: "regular-green", status: "Warning" },
    { color: "regular-yellow", status: "Up" },
    { color: "regular-cyan ", status: "Critical" },
    { color: "regular-magenta", status: "Warning" },
    { color: "regular-black", status: "Up" },
    { color: "regular-orange", status: "Up" },
    { color: "regular-rose", status: "Up" },
    { color: "regular-violet", status: "Up" },
    { color: "regular-azure", status: "Critical" },
    { color: "dark-blue", status: "Warning" },
    { color: "dark-green", status: "Up" },
    { color: "dark-yellow", status: "Critical" },
    { color: "dark-cyan ", status: "Warning" },
    { color: "dark-magenta", status: "Up" },
    { color: "dark-black", status: "Critical" },
    { color: "dark-orange", status: "Warning" },
    { color: "dark-rose", status: "Up" },
    { color: "dark-violet", status: "Critical" },
    { color: "dark-azure", status: "Warning" },
    { color: "light-blue", status: "Up" },
    { color: "light-green", status: "Critical" },
    { color: "light-yellow", status: "Warning" },
    { color: "light-cyan", status: "Up" },
    { color: "light-magenta", status: "Critical" },
    { color: "light-black", status: "Warning" },
    { color: "light-orange", status: "Up" },
    { color: "light-rose", status: "Critical" },
    { color: "light-violet", status: "Warning" },
    { color: "light-azure", status: "Up" },
];

export const arrOBjectsForSearch: IFilterGroup<
    IFilter<string[], IMultiFilterMetadata>
>[] = [
    {
        color: {
            type: "string[]",
            value: ["azure"],
            metadata: {
                allCategories: [
                    "azure",
                    "black",
                    "blue",
                    "cyan",
                    "green",
                    "orange",
                    "rose",
                    "violet",
                    "yellow",
                ],
            },
        },
    },
    {
        status: {
            type: "string[]",
            value: ["Critical"],
            metadata: {
                allCategories: ["Warning", "Critical", "Up"],
            },
        },
    },
];

export const searchThruResult: ExampleItem[][] = [
    [
        { color: "regular-azure", status: "Critical" },
        { color: "dark-azure", status: "Warning" },
        { color: "light-azure", status: "Up" },
    ],
    [
        { color: "regular-blue", status: "Critical" },
        { color: "regular-cyan ", status: "Critical" },
        { color: "regular-azure", status: "Critical" },
        { color: "dark-yellow", status: "Critical" },
        { color: "dark-black", status: "Critical" },
        { color: "dark-violet", status: "Critical" },
        { color: "light-green", status: "Critical" },
        { color: "light-magenta", status: "Critical" },
        { color: "light-rose", status: "Critical" },
    ],
];

// getFilters data
export const RANDOM_ARRAY = [
    { color: "regular-blue" },
    { color: "regular-green" },
    { color: "regular-yellow" },
    { color: "regular-cyan" },
    { color: "regular-magenta" },
    { color: "regular-black" },
    { color: "dark-blue" },
    { color: "dark-green" },
    { color: "dark-yellow" },
    { color: "dark-cyan" },
    { color: "dark-magenta" },
    { color: "dark-black" },
    { color: "light-blue" },
    { color: "light-green" },
    { color: "light-yellow" },
    { color: "light-cyan" },
    { color: "light-magenta" },
    { color: "light-black" },
];

// alphabetically sorted
export const resultForBlue = [
    { color: "dark-blue" },
    { color: "light-blue" },
    { color: "regular-blue" },
];

// alphabetically sorted
export const resultForLightFirstPage = [
    { color: "light-black" },
    { color: "light-blue" },
    { color: "light-cyan" },
    { color: "light-green" },
    { color: "light-magenta" },
];

export const resultForLightSecondPage = [{ color: "light-yellow" }];

export const resultsForLightFirstPageDesc = [
    { color: "light-yellow" },
    { color: "light-magenta" },
    { color: "light-green" },
    { color: "light-cyan" },
    { color: "light-blue" },
];

export class ExpectedFilters {
    public expectedFilters: INovaFilters;

    constructor() {
        this.expectedFilters = {
            search: {
                type: "string",
                value: "light",
            },
            paginator: {
                type: "range",
                value: {
                    start: 0,
                    end: 5,
                },
            },
            sorter: {
                type: "sorter",
                value: {
                    sortBy: "color",
                    direction: SorterDirection.ascending,
                },
            },
        };
    }
}
