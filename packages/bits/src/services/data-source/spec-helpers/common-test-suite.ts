import { nameof } from "../../../functions/nameof";
import { SorterDirection } from "../../../lib/public-api";
import { LocalFilteringDataSource } from "../local-filtering-data-source.service";
import { INovaFilteringOutputs, INovaFilters } from "../public-api";

import {
    ExpectedFilters,
    resultForBlue,
    resultForLightFirstPage,
    resultForLightSecondPage,
    resultsForLightFirstPageDesc,
} from "./local-filtering-data-source.testdata";

export class CommonTestSuite {
    public static expected: INovaFilters;
    public static service: LocalFilteringDataSource<INovaFilteringOutputs>;
    public static execute = () => {
        describe("common specs for getFilters", () => {
            it("should get correct results when call getFilteredData with search value 'blue' (0 - 5) ", async () => {
                if (!CommonTestSuite.expected.search) {
                    throw new Error(
                        `INovaFilteringOutputs ${nameof<INovaFilteringOutputs>(
                            "search"
                        )} property is not defined`
                    );
                }

                CommonTestSuite.expected.search.value = "blue";

                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        CommonTestSuite.expected
                    );

                result.repeat?.itemsSource.forEach((el, index) =>
                    expect(el.color).toBe(resultForBlue[index].color)
                );
            });

            it("should get correct results when call getFilteredData with search value 'light' (0 - 5) ", async () => {
                // default search value is "light"
                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        CommonTestSuite.expected
                    );

                result.repeat?.itemsSource.forEach((el, index) =>
                    expect(el.color).toBe(resultForLightFirstPage[index].color)
                );
            });

            it("should get correct results when call getFilteredData with search value 'light' (5 - 10) ", async () => {
                if (!CommonTestSuite.expected.paginator) {
                    throw new Error(
                        `INovaFilteringOutputs ${nameof<INovaFilteringOutputs>(
                            "paginator"
                        )} property is not defined`
                    );
                }
                // default search value is "light"
                CommonTestSuite.expected.paginator.value.start = 5;
                CommonTestSuite.expected.paginator.value.end = 10;

                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        CommonTestSuite.expected
                    );

                result.repeat?.itemsSource.forEach((el, index) =>
                    expect(el.color).toBe(resultForLightSecondPage[index].color)
                );
            });

            it("should get correct results when call getFilteredData with search value 'light' (0 - 5) in descending order ", async () => {
                if (!CommonTestSuite.expected.sorter) {
                    throw new Error(
                        `INovaFilteringOutputs ${nameof<INovaFilteringOutputs>(
                            "sorter"
                        )} property is not defined`
                    );
                }
                // default search value is "light"
                CommonTestSuite.expected.sorter.value.direction =
                    SorterDirection.descending;

                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        CommonTestSuite.expected
                    );

                result.repeat?.itemsSource.forEach((el, index) =>
                    expect(el.color).toBe(
                        resultsForLightFirstPageDesc[index].color
                    )
                );
            });

            it("should happen pagination reset when current search value differs from previous", async () => {
                // set previous filters 1st
                await CommonTestSuite.service.applyFilters();

                // default search value is "light"
                const newExpectedFilters = new ExpectedFilters()
                    .expectedFilters;

                if (!newExpectedFilters.search) {
                    throw new Error(
                        `newExpectedFilters has no ${nameof<INovaFilters>(
                            "search"
                        )} property`
                    );
                }

                newExpectedFilters.search.value = "blue";

                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        newExpectedFilters
                    );

                expect(result.paginator?.reset).toBe(true);
            });

            it("should happen pagination reset when current direction value differs from previous", async () => {
                // set previous filters 1st
                await CommonTestSuite.service.applyFilters();

                // default value is SorterDirection.ascending
                const newExpectedFilters = new ExpectedFilters()
                    .expectedFilters;

                if (!newExpectedFilters.sorter) {
                    throw new Error(
                        `newExpectedFilters has no ${nameof<INovaFilters>(
                            "sorter"
                        )} property`
                    );
                }

                newExpectedFilters.sorter.value.direction =
                    SorterDirection.descending;
                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        newExpectedFilters
                    );

                expect(result.paginator?.reset).toBe(true);
            });

            it("should NOT happen pagination reset when current search value is the same as previous", async () => {
                // default search value is "light"
                await CommonTestSuite.service.getFilteredData(
                    CommonTestSuite.expected
                );

                const newExpectedFilters = new ExpectedFilters()
                    .expectedFilters;

                if (!newExpectedFilters.search) {
                    throw new Error(
                        `newExpectedFilters has no ${nameof<INovaFilters>(
                            "search"
                        )} property`
                    );
                }

                newExpectedFilters.search.value = "light";

                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        newExpectedFilters
                    );

                expect(result.paginator?.reset).toBe(false);
            });

            it("should NOT happen pagination reset when current direction value is the same as previous", async () => {
                // default value is SorterDirection.ascending
                await CommonTestSuite.service.getFilteredData(
                    CommonTestSuite.expected
                );

                const newExpectedFilters = new ExpectedFilters()
                    .expectedFilters;
                if (!newExpectedFilters.sorter) {
                    throw new Error(
                        `newExpectedFilters has no ${nameof<INovaFilters>(
                            "sorter"
                        )} property`
                    );
                }
                newExpectedFilters.sorter.value.direction =
                    SorterDirection.ascending;

                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        newExpectedFilters
                    );

                expect(result.paginator?.reset).toBe(false);
            });

            it("should return correct total when call getFilteredData with search value 'light' (5 - 10) ", async () => {
                if (!CommonTestSuite.expected.paginator) {
                    throw new Error(
                        `INovaFilteringOutputs ${nameof<INovaFilteringOutputs>(
                            "paginator"
                        )} property is not defined`
                    );
                }
                // default search value is "light"
                CommonTestSuite.expected.paginator.value.start = 5;
                CommonTestSuite.expected.paginator.value.end = 10;

                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        CommonTestSuite.expected
                    );
                expect(result.paginator?.total).toBe(6);
            });

            it("should return correct total when call getFilteredData with search value 'blue' (0 - 5) ", async () => {
                if (!CommonTestSuite.expected.search) {
                    throw new Error(
                        `INovaFilteringOutputs ${nameof<INovaFilteringOutputs>(
                            "search"
                        )} property is not defined`
                    );
                }
                CommonTestSuite.expected.search.value = "blue";

                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        CommonTestSuite.expected
                    );

                expect(result.paginator?.total).toBe(3);
            });

            it("should apply search properties", async () => {
                if (!CommonTestSuite.expected.search) {
                    throw new Error(
                        `INovaFilteringOutputs ${nameof<INovaFilteringOutputs>(
                            "search"
                        )} property is not defined`
                    );
                }
                CommonTestSuite.expected.search.value = "blue";
                const initialResult: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        CommonTestSuite.expected
                    );

                expect(initialResult.repeat?.itemsSource.length).toBe(3);

                CommonTestSuite.service.setSearchProperties([
                    "propertyIsNotInArray",
                ]);
                const result: INovaFilteringOutputs =
                    await CommonTestSuite.service.getFilteredData(
                        CommonTestSuite.expected
                    );

                expect(result.repeat?.itemsSource.length).toBe(0);
            });
        });
    };
}
