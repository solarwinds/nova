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

import { Xliff } from "@angular/compiler";
import { Component, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataSourceService, NuiDividerModule, NuiPopoverModule } from "@nova-ui/bits";

import { FilterGroupComponent } from "../filter-group.component";
import { IFilterGroupItem } from "../public-api";

import { FilterGroupsWrapperComponent } from "./filter-groups-wrapper.component";

@Component({
    selector: "filter-groups-wrapper-test-component",
    template: `
        <<%= dasherize(prefix) %>-filter-groups-wrapper>
            <filter-group *ngFor="let item of filterGroupItems" [filterGroupItem]="item"></filter-group>
        </<%= dasherize(prefix) %>-filter-groups-wrapper>`,
})
class FilterGroupsWrapperSpecComponent {
    public filterGroupItems: IFilterGroupItem[] = [
        {
            id: "color",
            title: "Color",
            expanded: true,
            allFilterOptions: [
                {
                    value: "azure",
                    displayValue: "Azure",
                },
            ],
            selectedFilterValues: [],
        },
        {
            id: "status",
            title: "Status",
            allFilterOptions: [
                {
                    value: "warning",
                    displayValue: "Warning",
                },
            ],
            selectedFilterValues: [],
        },
        {
            id: "vendor",
            title: "Vendor",
            allFilterOptions: [],
            selectedFilterValues: [],
        },
    ];
}

describe("components >", () => {
    describe("filter-groups-wrapper >", () => {
        let fixture: ComponentFixture<FilterGroupsWrapperSpecComponent>;
        let component: FilterGroupsWrapperComponent;
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    NuiPopoverModule,
                    NuiDividerModule,
                ],
                declarations: [
                    FilterGroupsWrapperComponent,
                    FilterGroupsWrapperSpecComponent,
                    FilterGroupComponent,
                ],
                providers: [
                    DataSourceService,
                    { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
                    { provide: TRANSLATIONS, useValue: Xliff },
                ],
            });

            fixture = TestBed.createComponent(FilterGroupsWrapperSpecComponent);
            component = fixture.debugElement.children[0].componentInstance;
            fixture.detectChanges();
        });

        it("should get proper quantity of filter-groups", () => {
            expect(component.filterGroups.length).toBe(3);
        });

        it("should return proper number of empty filter-groups", () => {
            spyOn(component, "emptyFilterGroupsExist").and.callThrough();
            expect(component.emptyFilterGroupsExist()).toBeTruthy();
        });

        it("should return string with empty filter-group titles", () => {
            spyOn(component, "emptyFilterGroupsTitles").and.callThrough();
            expect(component.emptyFilterGroupsTitles()).toEqual("Vendor");
        });

    });
});
