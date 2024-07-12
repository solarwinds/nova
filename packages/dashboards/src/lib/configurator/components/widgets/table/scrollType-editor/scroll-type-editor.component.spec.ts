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
import { FormBuilder } from "@angular/forms";

import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { DynamicComponentCreator } from "../../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { TableScrollTypeEditorComponent } from "./scroll-type-editor.component";
import { SimpleChange, SimpleChanges } from "@angular/core";
import { ScrollType } from "@nova-ui/dashboards";

describe("TableScrollTypeEditorComponent", () => {
    let component: TableScrollTypeEditorComponent;
    let fixture: ComponentFixture<TableScrollTypeEditorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                PizzagnaService,
                DynamicComponentCreator,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
                {
                    provide: FormBuilder,
                    useValue: new FormBuilder(),
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableScrollTypeEditorComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        it("should set the 'paginatorConfiguration' form controls", () => {
            component.paginatorConfiguration = {
                pageSize: 20,
                pageSizeSet: [10, 20, 30],
            };

            const changes: SimpleChanges = {
                paginatorConfiguration: {} as SimpleChange,
            };

            component.ngOnChanges(changes);
            const paginatorConfigurationFormGroup = component.form.get(
                "paginatorConfiguration"
            );
            expect(
                paginatorConfigurationFormGroup?.get("pageSize")?.value
            ).toEqual(component.paginatorConfiguration.pageSize);
            expect(
                paginatorConfigurationFormGroup?.get("pageSizeSet")?.value
            ).toEqual(component.paginatorConfiguration.pageSizeSet);
        });

        it("should set the 'scrollType' form controls", () => {
            component.scrollType = ScrollType.paginator;

            const changes: SimpleChanges = {
                scrollType: {} as SimpleChange,
            };

            component.ngOnChanges(changes);

            const scrollTypeFormControl = component.form
                .get("paginatorConfiguration")
                ?.get("scrollType")?.value;
            expect(scrollTypeFormControl).toEqual(component.scrollType);
        });

        it("should update 'pageSizeOptions' when there is change in 'paginatorConfiguration'", () => {
            component.paginatorConfiguration = {
                pageSize: 20,
                pageSizeSet: [20, 50, 100],
            };

            const changes: SimpleChanges = {
                paginatorConfiguration: {} as SimpleChange,
            };

            component.ngOnChanges(changes);

            expect(component.paginatorConfiguration.pageSizeSet).toEqual(
                component.pageSizeOptions
            );
        });

        it("should set 'pageSizeSetOptions' according to values from 'paginatorConfiguration.pageSizeSet'", () => {
            component.paginatorConfiguration = {
                pageSize: 20,
                pageSizeSet: [20, 50, 100],
            };

            const changes: SimpleChanges = {
                paginatorConfiguration: {} as SimpleChange,
            };

            component.ngOnChanges(changes);

            component.pageSizeSetOptions.forEach((option) => {
                component.paginatorConfiguration.pageSizeSet?.forEach(
                    (pageValue) => {
                        if (option.value === pageValue) {
                            expect(option.checked).toBeTrue();
                        }
                    }
                );
            });
        });

        it("should display advanced configuration only for 'scrollType' set to paginator", () => {
            component.scrollType = ScrollType.virtual;

            const changes: SimpleChanges = {
                scrollType: {} as SimpleChange,
            };

            component.ngOnChanges(changes);

            expect(component.hasPaginator).toBeFalse();

            component.scrollType = ScrollType.paginator;

            component.ngOnChanges(changes);

            expect(component.hasPaginator).toBeTrue();
        });

        it("should set correctly subtitle according to selected 'scrollType'", () => {
            component.scrollType = ScrollType.virtual;

            const changes: SimpleChanges = {
                scrollType: {} as SimpleChange,
            };

            component.ngOnChanges(changes);

            expect(component.subtitle).toEqual(
                "Scroll Type:  " +
                    component.loadStrategies.find(
                        (ls) => ls.id === ScrollType.virtual
                    )?.title
            );
        });
    });
});
