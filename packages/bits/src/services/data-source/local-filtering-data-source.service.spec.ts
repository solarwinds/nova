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

import { DatePipe } from "@angular/common";
import { TestBed } from "@angular/core/testing";
import noop from "lodash/noop";

import { LocalFilteringDataSource } from "./local-filtering-data-source.service";
import {
    IFilterGroup,
    IFilterItem,
    INovaFilteringOutputs,
    INovaFilters,
} from "./public-api";
import { LoggerService } from "../log-service";
import { SearchService } from "../search.service";
import { CommonTestSuite } from "./spec-helpers/common-test-suite";
import {
    allCategoriesArr,
    allCategoriesForColor,
    anyFilters,
    arrayToSearchIn,
    arrOBjectsForSearch,
    bigArrForSearch,
    changedArrForComparison,
    correctmultiFilters,
    expectedAllCategoriesResult,
    ExpectedFilters,
    muiltiFilter,
    newFilters,
    newFiltersbigArrForSearch,
    newFiltersExpectedallCategoriesResult,
    newFiltersExpectedResultItemsArr,
    RANDOM_ARRAY,
    searchThruResult,
    unchangedArrForComparison,
} from "./spec-helpers/local-filtering-data-source.testdata";

describe("LocalFilteringDataSource >", () => {
    let loggerService: LoggerService;
    let datePipe: DatePipe;
    let service: LocalFilteringDataSource<INovaFilteringOutputs>;
    let expectedFilters: INovaFilters;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoggerService, DatePipe, SearchService],
        });

        loggerService = TestBed.inject(LoggerService);
        spyOnProperty(loggerService, "warn").and.returnValue(noop);
        datePipe = TestBed.inject(DatePipe);
        service = new LocalFilteringDataSource<INovaFilteringOutputs>(
            new SearchService(loggerService, datePipe)
        );
        service.setData(RANDOM_ARRAY);
        expectedFilters = new ExpectedFilters().expectedFilters;
        CommonTestSuite.expected = expectedFilters;
        CommonTestSuite.service = service;
    });
    CommonTestSuite.execute();

    describe("countAvailableResults", () => {
        it("countAvailableResults should return correct object", async () => {
            const result: IFilterGroup<IFilterItem<number>> = await (
                service as any
            ).countAvailableResults(allCategoriesArr, arrayToSearchIn);
            expect(result).toEqual(expectedAllCategoriesResult());
        });
        it("countAvailableResults doesn't error if property arrays are empty", async () => {
            const result: IFilterGroup<IFilterItem<number>> = await (
                service as any
            ).countAvailableResults([{ color: [] }, { status: [] }], []);
            expect(result).toEqual({ color: {}, status: {} });
        });
    });

    describe("searchThru", () => {
        it("searchThru should return correct 'two dimensional array' result", async () => {
            const result = await (service as any).searchThru(
                arrOBjectsForSearch,
                bigArrForSearch
            );
            expect(result).toEqual(searchThruResult);
        });
    });

    describe("isValueChanged", () => {
        it("isValueChanged should return true", async () => {
            const result = await (service as any).isValueChanged(
                changedArrForComparison
            );
            expect(result).toEqual(true);
        });

        it("isValueChanged should return false", async () => {
            const result = await (service as any).isValueChanged(
                unchangedArrForComparison
            );
            expect(result).toEqual(false);
        });
    });

    describe("getAllCategories", () => {
        it("getAllCategories should return correct 'allCategories' result", async () => {
            const result = await (service as any).getAllCategories(
                muiltiFilter
            );
            expect(result).toEqual(allCategoriesForColor);
        });
    });

    describe("extractMultiFilters", () => {
        it("extractMultiFilters should return only filters with type 'string' ", async () => {
            const result = await (service as any).extractMultiFilters(
                anyFilters
            );
            expect(result).toEqual(correctmultiFilters);
        });
    });

    describe("test filtering mechanism with new filters", () => {
        it("getFilteredData should return filtered data when found match", async () => {
            service.setData(newFiltersbigArrForSearch);
            const result = await service.getFilteredData(newFilters);
            expect(result.number).toEqual(
                newFiltersExpectedallCategoriesResult().number
            );
            expect(result.country).toEqual(
                newFiltersExpectedallCategoriesResult().country
            );
            expect(result.repeat?.itemsSource).toEqual(
                newFiltersExpectedResultItemsArr
            );
        });

        it("getFilteredData should return empty array when match is not found", async () => {
            service.setData(newFiltersbigArrForSearch);
            newFilters.country.value = ["NOT_IN_LIST"];
            newFilters.number.value = [];
            const result = await service.getFilteredData(newFilters);
            expect(result.repeat?.itemsSource).toEqual([]);
        });

        it("getFilteredData should return all data if no filters specified", async () => {
            service.setData(newFiltersbigArrForSearch);
            newFilters.country.value = [];
            newFilters.number.value = [];
            const result = await service.getFilteredData(newFilters);
            expect(result.repeat?.itemsSource).toEqual(
                newFiltersbigArrForSearch
            );
        });

        it("getFilteredData should return empty array if first filter group has match and second doesn't", async () => {
            service.setData(newFiltersbigArrForSearch);
            newFilters.country.value = ["Ukraine"];
            newFilters.number.value = ["NOT_IN_LIST"];
            const result = await service.getFilteredData(newFilters);
            expect(result.repeat?.itemsSource).toEqual([]);
        });
    });
});
