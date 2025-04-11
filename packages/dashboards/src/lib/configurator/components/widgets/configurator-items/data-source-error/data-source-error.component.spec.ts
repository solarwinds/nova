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

import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Subject } from "rxjs";

import {
    DataSourceFeatures,
    IDataSource,
    IFilteringOutputs,
    IFilteringParticipants,
    NuiMessageModule,
} from "@nova-ui/bits";

import { DataSourceErrorComponent } from "./data-source-error.component";
import { NuiDashboardsModule } from "../../../../../dashboards.module";

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

describe("DataSourceErrorComponent", () => {
    let component: DataSourceErrorComponent;
    let fixture: ComponentFixture<DataSourceErrorComponent>;
    let dataSource: IDataSource;

    beforeEach(() => {
        dataSource = new MockDataSource();

        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule, NuiMessageModule],
        });
        fixture = TestBed.createComponent(DataSourceErrorComponent);
        component = fixture.componentInstance;

        component.dataSource = dataSource;
        const dataSourceChanged = {
            dataSource: new SimpleChange(null, dataSource, true),
        };
        component.ngOnChanges(dataSourceChanged);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should call changeDetector if there's an output on the dataSource", () => {
        const markForCheckSpy = spyOn(component.changeDetector, "markForCheck");

        component.dataSource.outputsSubject.next(null);

        expect(markForCheckSpy).toHaveBeenCalled();
    });

    it("should emit an errorState positive if there's an error on the output of a dataSource", () => {
        const errorStateSpy = spyOn(component.errorState, "emit");

        component.dataSource.outputsSubject.next({
            error: {
                type: 404,
                message: "Not Found",
            },
        });
        expect(component.dataSourceError).toBeTruthy();

        expect(errorStateSpy).toHaveBeenCalledWith(true);

        component.dataSource.outputsSubject.next({
            result: {
                hello: "world",
            },
        });
        expect(component.dataSourceError).toBeFalsy();
        expect(errorStateSpy).toHaveBeenCalledWith(false);
    });

    it("should set data to the same value if there is a result key for legacy dataSources", () => {
        component.dataSource.outputsSubject.next({
            result: {
                hello: "world",
            },
        });
        expect(component.dataSourceError).toBeFalsy();

        const testCaseA = component.data;
        component.dataSource.outputsSubject.next({
            hello: "world",
        });
        expect(component.dataSourceError).toBeFalsy();

        const testCaseB = component.data;
        expect(testCaseA).toEqual(testCaseB);

        component.dataSource.outputsSubject.next({
            hello: "new world",
        });
        const testCaseC = component.data;
        expect(component.dataSourceError).toBeFalsy();
        expect(testCaseC).not.toEqual(testCaseA);
    });
});
