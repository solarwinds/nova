import { DatePipe } from "@angular/common";
import { Xliff } from "@angular/compiler";
import { TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ISelection, NuiCommonModule, NuiRepeatModule, NuiSorterModule } from "@nova-ui/bits";

import { IFilterGroupOption } from "../public-api";

import { ItemPickerComponent } from "./item-picker.component";

const ITEM_PICKER_OPTIONS: IFilterGroupOption[] = [
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

const SELECTION: ISelection = {
    isAllPages: false,
    include: [],
    exclude: [],
};

describe("components >", () => {
    describe("item-picker >", () => {
        let fixture: ComponentFixture<ItemPickerComponent>;
        let component: ItemPickerComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [
                    NuiCommonModule,
                    NuiSorterModule,
                    NuiRepeatModule,
                ],
                declarations: [
                    ItemPickerComponent,
                ],
                providers: [
                    { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
                    { provide: TRANSLATIONS, useValue: Xliff },
                    DatePipe,
                ],
            });

            fixture = TestBed.createComponent(ItemPickerComponent);
            component = fixture.componentInstance;
            component.itemPickerOptions = ITEM_PICKER_OPTIONS;
            component.selection = SELECTION;
        });

        it("should emit correct selection", () => {
            spyOn(component.selectionChanged, "emit").and.callThrough();
            const newSelection: ISelection = {
                isAllPages: false,
                include: [ITEM_PICKER_OPTIONS[0]],
                exclude: [],
            };
            component.onSelection(newSelection);
            expect(component.selectionChanged.emit).toHaveBeenCalledWith(newSelection);
        });

        it("getSelectedOptions should return correct values", () => {
            component.selectedValues = ["azure"];
            expect(component.getSelectedOptions()).toEqual([ITEM_PICKER_OPTIONS[0]]);
        });
    });
});
