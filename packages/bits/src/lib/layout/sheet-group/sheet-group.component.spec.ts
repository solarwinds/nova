import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SheetGroupComponent } from "./sheet-group.component";


describe("sheet-group", () => {
    let fixture: ComponentFixture<SheetGroupComponent>;
    let sheetGroupComponent: SheetGroupComponent;

    beforeEach(() => {
        TestBed
            .configureTestingModule({
                declarations: [SheetGroupComponent],
            });
        fixture = TestBed.createComponent(SheetGroupComponent);
        sheetGroupComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should apply 'row' direction correctly", () => {
        sheetGroupComponent.direction = "row";
        sheetGroupComponent.ngOnInit();
        expect(sheetGroupComponent.applyDirectionRowClass).toBe(true);
        expect(sheetGroupComponent.applyDirectionColumnClass).toBe(false);
    });
    it("should apply 'column' direction correctly", () => {
        sheetGroupComponent.direction = "column";
        sheetGroupComponent.ngOnInit();
        expect(sheetGroupComponent.applyDirectionRowClass).toBe(false);
        expect(sheetGroupComponent.applyDirectionColumnClass).toBe(true);
    });
    it("should apply joined sheetsType correctly", () => {
        sheetGroupComponent.sheetsType = "joined";
        sheetGroupComponent.ngOnInit();
        expect(sheetGroupComponent.applyJoinedSheetsClass).toBe(true);
    });
    it("should apply separate sheetsType correctly", () => {
        sheetGroupComponent.sheetsType = "separate";
        sheetGroupComponent.ngOnInit();
        expect(sheetGroupComponent.applySeparateSheetsClass).toBe(true);
    });
});
