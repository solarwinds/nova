import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SheetComponent } from "./sheet.component";

describe("sheet", () => {
    let fixture: ComponentFixture<SheetComponent>;
    let sheetComponent: SheetComponent;

    beforeEach(() => {
        TestBed
            .configureTestingModule({
                declarations: [SheetComponent],
            });
        fixture = TestBed.createComponent(SheetComponent);
        sheetComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should apply 'row' direction correctly", () => {
        sheetComponent.direction = "row";
        sheetComponent.ngOnInit();
        expect(sheetComponent.directionRow).toBe(true);
        expect(sheetComponent.directionColumn).toBe(false);
    });
    it("should apply 'column' direction correctly", () => {
        sheetComponent.direction = "column";
        sheetComponent.ngOnInit();
        expect(sheetComponent.directionRow).toBe(false);
        expect(sheetComponent.directionColumn).toBe(true);
    });
});
