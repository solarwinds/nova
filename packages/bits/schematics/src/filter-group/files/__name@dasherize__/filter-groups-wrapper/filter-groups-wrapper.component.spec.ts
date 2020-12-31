import { Xliff } from "@angular/compiler";
import { Component, TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataSourceService, NuiModule } from "@nova-ui/bits";

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
                    NuiModule,
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
