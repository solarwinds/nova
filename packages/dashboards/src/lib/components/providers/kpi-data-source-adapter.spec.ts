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

import { DecimalPipe } from "@angular/common";
import { Subject } from "rxjs";

import {
    EventBus,
    IDataSource,
    IEvent,
    IFilteringOutputs,
    IFilteringParticipants,
} from "@nova-ui/bits";

import {
    IKpiDataSourceAdapterConfiguration,
    KpiDataSourceAdapter,
} from "./kpi-data-source-adapter";
import { KpiWidgetThresholdColors } from "../../configurator/components/widgets/kpi/types";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { IKpiData } from "../kpi-widget/types";

class MockDataSource implements IDataSource {
    public outputsSubject = new Subject<IFilteringOutputs>();

    public async applyFilters(): Promise<void> {
        // @ts-ignore: Suppressed for testing purposes
        return null;
    }

    public registerComponent(
        components: Partial<IFilteringParticipants>
    ): void {}

    public deregisterComponent(componentKey: string): void {}
}

describe("KpiDataSourceAdapter > ", () => {
    let adapter: KpiDataSourceAdapter;
    let dataSource: MockDataSource;
    let eventBus: EventBus<IEvent>;
    let pizzagnaService: PizzagnaService;
    let configuration: IKpiDataSourceAdapterConfiguration;
    let testData: IKpiData;
    let dynamicComponentCreator: DynamicComponentCreator;
    let numberPipe: DecimalPipe;

    beforeEach(() => {
        eventBus = new EventBus();
        dataSource = new MockDataSource();
        dynamicComponentCreator = new DynamicComponentCreator();
        numberPipe = new DecimalPipe("en-US");
        pizzagnaService = new PizzagnaService(
            eventBus,
            dynamicComponentCreator
        );
        adapter = new KpiDataSourceAdapter(
            eventBus,
            dataSource,
            pizzagnaService,
            numberPipe
        );
        configuration = {
            thresholds: {
                showThresholds: false,
                reversedThresholds: false,
                warningThresholdValue: 0,
                criticalThresholdValue: 0,
            },
        };
        testData = {
            id: "",
            value: 33,
            units: "testUnit",
            // @ts-ignore: Suppressed for testing purposes
            label: null,
            // @ts-ignore: Suppressed for testing purposes
            numberFormat: null,
        };
    });

    describe("updateConfiguration > ", () => {
        it("should initialize the thresholds", () => {
            adapter.updateConfiguration(configuration);
            expect((<any>adapter).thresholds).toEqual(configuration.thresholds);
        });
    });

    describe("processOutput > ", () => {
        it("should return the value without backgroundColor if thresholds is undefined", () => {
            const data = (<any>adapter).processOutput(testData);
            expect(data).toEqual(testData);
            expect(data.backgroundColor).toBeUndefined();
        });

        it("should return the value without backgroundColor if showThresholds is false", () => {
            configuration.thresholds.showThresholds = false;

            adapter.updateConfiguration(configuration);
            const data = (<any>adapter).processOutput(testData);
            expect(data).toEqual(testData);
            expect(data.backgroundColor).toBeUndefined();
        });

        it("should return the value with a warning backgroundColor if reversedThresholds is false", () => {
            configuration.thresholds.showThresholds = true;
            configuration.thresholds.reversedThresholds = false;
            configuration.thresholds.criticalThresholdValue = 50;
            configuration.thresholds.warningThresholdValue = 30;

            adapter.updateConfiguration(configuration);
            const data = (<any>adapter).processOutput(testData);
            expect(data.value).toEqual(testData.value);
            expect(data.backgroundColor).toEqual(
                KpiWidgetThresholdColors.Warning
            );
        });

        it("should return the value with a warning backgroundColor if reversedThresholds is true", () => {
            configuration.thresholds.showThresholds = true;
            configuration.thresholds.reversedThresholds = true;
            configuration.thresholds.criticalThresholdValue = 30;
            configuration.thresholds.warningThresholdValue = 50;

            adapter.updateConfiguration(configuration);
            const data = (<any>adapter).processOutput(testData);
            expect(data.value).toEqual(testData.value);
            expect(data.backgroundColor).toEqual(
                KpiWidgetThresholdColors.Warning
            );
        });

        it("should return the value with a critical backgroundColor if reversedThresholds is false", () => {
            configuration.thresholds.showThresholds = true;
            configuration.thresholds.reversedThresholds = false;
            configuration.thresholds.criticalThresholdValue = 30;
            configuration.thresholds.warningThresholdValue = 20;

            adapter.updateConfiguration(configuration);
            const data = (<any>adapter).processOutput(testData);
            expect(data.value).toEqual(testData.value);
            expect(data.backgroundColor).toEqual(
                KpiWidgetThresholdColors.Critical
            );
        });

        it("should return the value with a critical backgroundColor if reversedThresholds is true", () => {
            configuration.thresholds.showThresholds = true;
            configuration.thresholds.reversedThresholds = true;
            configuration.thresholds.criticalThresholdValue = 40;
            configuration.thresholds.warningThresholdValue = 50;

            adapter.updateConfiguration(configuration);
            const data = (<any>adapter).processOutput(testData);
            expect(data.value).toEqual(testData.value);
            expect(data.backgroundColor).toEqual(
                KpiWidgetThresholdColors.Critical
            );
        });

        it("should return the value with its default backgroundColor if reversedThresholds is false", () => {
            configuration.thresholds.showThresholds = true;
            configuration.thresholds.reversedThresholds = false;
            configuration.thresholds.criticalThresholdValue = 50;
            configuration.thresholds.warningThresholdValue = 40;
            testData.backgroundColor = "blue";

            adapter.updateConfiguration(configuration);
            const data = (<any>adapter).processOutput(testData);
            expect(data.value).toEqual(testData.value);
            expect(data.backgroundColor).toEqual(testData.backgroundColor);
        });

        it("should return the value with its default backgroundColor if reversedThresholds is true", () => {
            configuration.thresholds.showThresholds = true;
            configuration.thresholds.reversedThresholds = true;
            configuration.thresholds.criticalThresholdValue = 20;
            configuration.thresholds.warningThresholdValue = 30;
            testData.backgroundColor = "blue";

            adapter.updateConfiguration(configuration);
            const data = (<any>adapter).processOutput(testData);
            expect(data.value).toEqual(testData.value);
            expect(data.backgroundColor).toEqual(testData.backgroundColor);
        });

        it("should return the value undefined if value is undefined", () => {
            const value: IFilteringOutputs | undefined = undefined;
            const data = (<any>adapter).processOutput(value);
            expect(data).toEqual(value);
        });

        it("should return the default backgroundColor when the value is a string", () => {
            testData.value = "Testing";
            configuration.thresholds.showThresholds = true;
            configuration.thresholds.reversedThresholds = true;
            configuration.thresholds.criticalThresholdValue = 20;
            configuration.thresholds.warningThresholdValue = 30;
            testData.backgroundColor = "blue";

            adapter.updateConfiguration(configuration);
            const data = (<any>adapter).processOutput(testData);
            expect(data.value).toEqual(testData.value);
            expect(data.backgroundColor).toEqual(testData.backgroundColor);
        });

        it("should format the number with one decimal place if the numberFormat is 1.1-1", () => {
            testData.numberFormat = "1.1-1";
            let data = (<any>adapter).processOutput(testData);
            expect(data.value).toEqual("33.0");
            testData.value = 12.2123123;
            data = (<any>adapter).processOutput(testData);
            expect(data.value).toEqual("12.2");
        });
    });
});
