import { DatePipe } from "@angular/common";
import { Xliff } from "@angular/compiler";
import { TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ISelection, NuiActiveDialog, NuiModule, SelectorService  } from "@solarwinds/nova-bits";

import { ItemPickerModule } from "../item-picker/item-picker.module";
import { IFilterGroupOption } from "../public-api";

import { FilterGroupDialogComponent } from "./filter-group-dialog.component";

const ITEMS: IFilterGroupOption[] = [
    {
        value: "azure",
        displayValue: "Azure",
    }, {
        value: "black",
        displayValue: "Black",
    }, {
        value: "blue",
        displayValue: "Blue",
    }, {
        value: "yellow",
        displayValue: "Yellow",
    },
];

const SELECTED_ITEMS = ["yellow"];

describe("components >", () => {
    describe("filter-group-dialog >", () => {
        let fixture: ComponentFixture<FilterGroupDialogComponent>;
        let component: FilterGroupDialogComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    NuiModule,
                    ItemPickerModule,
                ],
                declarations: [
                    FilterGroupDialogComponent,
                ],
                providers: [
                    NuiActiveDialog,
                    SelectorService,
                    DatePipe,
                    { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
                    { provide: TRANSLATIONS, useValue: Xliff },
                ],
            });

            fixture = TestBed.createComponent(FilterGroupDialogComponent);
            component = fixture.componentInstance;
            component.itemPickerOptions = ITEMS;
            component.selectedValues = SELECTED_ITEMS;
            component.title = "Test title";
        });

        it("Should apply correct selectedValues when something selected in item picker", () => {
            const SELECTION: ISelection = {
                isAllPages: false,
                include: [ITEMS[0]],
                exclude: [],
            };
            component.onSelectionChanged(SELECTION);
            expect(component.selectedValues).toEqual(["azure"]);
        });

        it("Should emit correct values on dialog 'Save' button click", () => {
            spyOn(component.dialogClosed, "emit").and.callThrough();
            fixture.componentInstance.acceptDialogFilters();
            expect(component.dialogClosed.emit).toHaveBeenCalledWith(SELECTED_ITEMS);
        });

        it("Should not emit anything on dialog 'Close' button click", () => {
            spyOn(component.dialogClosed, "emit").and.callThrough();
            fixture.componentInstance.closeDialog();
            expect(component.dialogClosed.emit).not.toHaveBeenCalled();
        });
    });
});
