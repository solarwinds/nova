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
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";
import { PIZZAGNA_EVENT_BUS } from "../../../../../types";
import {
    ITimeSpanOption,
    CartesianMetadataConfigurationComponent,
} from "./cartesian-metadata-configuration.component";

describe("CartesianMetadataConfigurationComponent", () => {
    let component: CartesianMetadataConfigurationComponent;
    let fixture: ComponentFixture<CartesianMetadataConfigurationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(
            CartesianMetadataConfigurationComponent
        );
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should set the default timeSpan if no value is set", () => {
        component.ngOnInit();

        const timeSpanControl = component.form.controls["startingTimespan"];
        let emittedValue: any;
        timeSpanControl.setValue(null);
        timeSpanControl.valueChanges.subscribe((value: any) => {
            emittedValue = value;
        });

        const timeSpans: ITimeSpanOption[] = [
            { id: "aaa", name: "AAA" },
            { id: "bbb", name: "BBB" },
        ];
        component.timeSpans = timeSpans;
        component.ngOnChanges({
            timeSpans: new SimpleChange(null, timeSpans, true),
        });

        expect(timeSpanControl.value).toEqual(timeSpans[0]);
        expect(emittedValue).toEqual(timeSpans[0]);
    });
});
