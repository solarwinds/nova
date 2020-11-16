import { SimpleChange, SimpleChanges } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { EventBus } from "@solarwinds/nova-bits";

import { IFormatter } from "../../../../../components/types";
import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { DynamicComponentCreator } from "../../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS } from "../../../../../types";

import { TableFiltersEditorComponent } from "./table-filters-editor.component";

describe("TableFiltersEditorComponent", () => {
    let component: TableFiltersEditorComponent;
    let fixture: ComponentFixture<TableFiltersEditorComponent>;

    beforeEach(async(() => {
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
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableFiltersEditorComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        it("should set the 'sortingConfiguration' form controls", () => {
            component.sortableColumns = [{
                id: "testId",
                formatter: {} as IFormatter,
                label: "Test",
                sortable: true,
            }];
            component.sorterConfiguration = {
                sortBy: "testId",
                descendantSorting: true,
            };
            const changes: SimpleChanges = {
                sorterConfiguration: {} as SimpleChange,
            };

            component.ngOnChanges(changes);
            const sorterConfigGroup = component.form.get("sorterConfiguration");
            expect(sorterConfigGroup?.get("sortBy")?.value).toEqual(component.sorterConfiguration.sortBy);
            expect(sorterConfigGroup?.get("descendantSorting")?.value).toEqual(component.sorterConfiguration.descendantSorting);
        });

        it("should set the 'sortedColumn' form control to 'undefined' if the sorterConfiguration column id is not represented in the sortableColumns", () => {
            component.sortableColumns = [{
                id: "testId",
                formatter: {} as IFormatter,
                label: "Test",
                sortable: true,
            }];
            component.sorterConfiguration = {
                sortBy: "otherId",
                descendantSorting: true,
            };
            const changes: SimpleChanges = {
                sorterConfiguration: {} as SimpleChange,
            };

            component.ngOnChanges(changes);
            const sorterConfigGroup = component.form.get("sorterConfiguration");
            expect(sorterConfigGroup?.get("sortBy")?.value).toBeUndefined();
            expect(sorterConfigGroup?.get("descendantSorting")?.value).toEqual(component.sorterConfiguration.descendantSorting);
        });

        it("should update the sortableColumns based on a change in the columns", () => {
            component.columns = [
                {
                    id: "testId",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: true,
                },
                {
                    id: "testId2",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: false,
                },
            ];

            const changes: SimpleChanges = {
                columns: {} as SimpleChange,
            };

            component.ngOnChanges(changes);
            expect(component.sortableColumns).toEqual([component.columns[0]]);
        });

        it("should set the 'sortingConfiguration' form controls based on a change in the columns", () => {
            component.columns = [
                {
                    id: "testId",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: true,
                },
                {
                    id: "testId2",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: false,
                },
            ];

            component.sorterConfiguration = {
                sortBy: "testId",
                descendantSorting: true,
            };

            const changes: SimpleChanges = {
                columns: {} as SimpleChange,
            };

            component.ngOnChanges(changes);
            const sorterConfigGroup = component.form.get("sorterConfiguration");
            expect(sorterConfigGroup?.get("sortBy")?.value).toEqual(component.sorterConfiguration.sortBy);
            expect(sorterConfigGroup?.get("descendantSorting")?.value).toEqual(component.sorterConfiguration.descendantSorting);
        });

        it("should set the 'sortBy' form control to 'undefined' if sorted column's sortable value changes to false", () => {
            component.sortableColumns = [
                {
                    id: "testId",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: true,
                },
                {
                    id: "testId2",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: true,
                },
            ];
            component.sorterConfiguration = {
                sortBy: "testId",
                descendantSorting: true,
            };
            component.columns = [
                {
                    id: "testId",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: false,
                },
                {
                    id: "testId2",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: true,
                },
            ];

            component.sorterConfiguration = {
                sortBy: "testId",
                descendantSorting: true,
            };

            const changes: SimpleChanges = {
                columns: {} as SimpleChange,
                sorterConfiguration: {} as SimpleChange,
            };

            component.ngOnChanges(changes);
            const sorterConfigGroup = component.form.get("sorterConfiguration");
            expect(sorterConfigGroup?.get("sortBy")?.value).toEqual("");
        });

        it("should disable the sorterConfiguration controls if the sortableColumns is empty", () => {
            component.sortableColumns = [
                {
                    id: "testId",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: true,
                },
            ];
            component.sorterConfiguration = {
                sortBy: "testId",
                descendantSorting: true,
            };
            component.columns = [
                {
                    id: "testId",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: false,
                },
                {
                    id: "testId2",
                    formatter: {} as IFormatter,
                    label: "Test",
                    sortable: false,
                },
            ];

            component.sorterConfiguration = {
                sortBy: "testId",
                descendantSorting: true,
            };

            const changes: SimpleChanges = {
                columns: {} as SimpleChange,
                sorterConfiguration: {} as SimpleChange,
            };

            component.ngOnChanges(changes);
            const sorterConfigGroup = component.form.get("sorterConfiguration");
            expect(sorterConfigGroup?.get("sortBy")?.disabled).toEqual(true);
            expect(sorterConfigGroup?.get("descendantSorting")?.disabled).toEqual(true);
        });

    });

});
