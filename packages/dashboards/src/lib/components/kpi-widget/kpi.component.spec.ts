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

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Subject } from "rxjs";

import {
    DataSourceFeatures,
    EventBus,
    IDataSource,
    IEvent,
    IFilteringOutputs,
    IFilteringParticipants,
} from "@nova-ui/bits";

import { KpiComponent } from "./kpi.component";
import { NuiDashboardsModule } from "../../dashboards.module";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { ProviderRegistryService } from "../../services/provider-registry.service";
import {
    DATA_SOURCE,
    PIZZAGNA_EVENT_BUS,
    WellKnownDataSourceFeatures,
} from "../../types";

class MockDataSource implements IDataSource {
    public outputsSubject = new Subject<IFilteringOutputs>();
    public filterParticipants: IFilteringParticipants;
    public features = new DataSourceFeatures({});

    public async applyFilters(): Promise<void> {
        // @ts-ignore: Suppressed for testing purposes
        return null;
    }

    public registerComponent(
        components: Partial<IFilteringParticipants>
    ): void {
        // @ts-ignore: Suppressed for testing purposes
        this.filterParticipants = components;
    }

    public deregisterComponent(componentKey: string): void {
        delete this.filterParticipants?.[componentKey];
    }
}

describe("KpiComponent", () => {
    let component: KpiComponent;
    let fixture: ComponentFixture<KpiComponent>;
    const eventBus = new EventBus<IEvent>();
    const dynamicComponentCreator = new DynamicComponentCreator();
    const pizzagnaService = new PizzagnaService(
        eventBus,
        dynamicComponentCreator
    );
    let dataSource: IDataSource;

    beforeEach(waitForAsync(() => {
        dataSource = new MockDataSource();

        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
                {
                    provide: DATA_SOURCE,
                    useValue: dataSource,
                },
                {
                    provide: PizzagnaService,
                    useValue: pizzagnaService,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KpiComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("isEmpty", () => {
        it("should return true when widgetData is null", () => {
            // @ts-ignore: TypeScript error ignored for testing purposes
            component.widgetData = null;
            expect(component.showEmpty).toBeTrue();
        });

        it("should return true when widgetData is undefined", () => {
            // @ts-ignore: TypeScript error ignored for testing purposes
            component.widgetData = undefined;
            expect(component.showEmpty).toBeTrue();
        });

        it("should return true when widgetData.value is null", () => {
            component.widgetData = { value: null };
            expect(component.showEmpty).toBeTrue();
        });

        it("should return true when widgetData.value is undefined", () => {
            component.widgetData = { value: undefined };
            expect(component.showEmpty).toBeTrue();
        });

        it("should return false when widgetData.value is false", () => {
            component.widgetData = { value: false };
            expect(component.showEmpty).toBeFalse();
        });

        it("should return false when widgetData.value is true", () => {
            component.widgetData = { value: true };
            expect(component.showEmpty).toBeFalse();
        });

        it("should return true when widgetData.value is []", () => {
            component.widgetData = { value: [] };
            expect(component.showEmpty).toBeTrue();
        });

        it("should return false when widgetData.value is non empty array", () => {
            component.widgetData = { value: [21, 25] };
            expect(component.showEmpty).toBeFalse();
        });

        it("should return true when widgetData.value is empty string", () => {
            component.widgetData = { value: "" };
            expect(component.showEmpty).toBeTrue();
        });

        it("should return false when widgetData.value is some string", () => {
            component.widgetData = { value: "some string" };
            expect(component.showEmpty).toBeFalse();
        });

        it("should return false when widgetData.value is 0", () => {
            component.widgetData = { value: 0 };
            expect(component.showEmpty).toBeFalse();
        });

        it("should return false when widgetData.value is a positive value", () => {
            component.widgetData = { value: 10.1 };
            expect(component.showEmpty).toBeFalse();
        });

        it("should return false when widgetData.value is a negative value", () => {
            component.widgetData = { value: -10.1 };
            expect(component.showEmpty).toBeFalse();
        });
    });

    describe("interactive", () => {
        it("is interactive when datasource is interactive with data", () => {
            expect(component.interactive).toBeFalsy();

            dataSource.features = new DataSourceFeatures({
                [WellKnownDataSourceFeatures.Interactivity]: { enabled: true },
            });
            component.widgetData = { value: 0 };

            expect(component.interactive).toBe(true);
        });

        it("is interactive when configured as interactive with data", () => {
            expect(component.interactive).toBeFalsy();

            component.configuration = { interactive: true };
            component.widgetData = { value: 0 };

            expect(component.interactive).toBe(true);
        });

        it("is not interactive when datasource is interactive with no data", () => {
            expect(component.interactive).toBeFalsy();

            dataSource.features = new DataSourceFeatures({
                [WellKnownDataSourceFeatures.Interactivity]: { enabled: true },
            });

            expect(component.interactive).toBe(false);
        });

        it("is not interactive when configured as interactive with no data", () => {
            expect(component.interactive).toBeFalsy();

            component.configuration = { interactive: true };

            expect(component.interactive).toBe(false);
        });
    });
});
