import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CardComponent } from "./card.component";

describe("card", () => {
    let fixture: ComponentFixture<CardComponent>;
    let cardComponent: CardComponent;

    beforeEach(() => {
        TestBed
            .configureTestingModule({
                declarations: [CardComponent],
            });
        fixture = TestBed.createComponent(CardComponent);
        cardComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should apply 'row' direction correctly", () => {
        cardComponent.direction = "row";
        cardComponent.ngOnInit();
        expect(cardComponent.directionRow).toBe(true);
        expect(cardComponent.directionColumn).toBe(false);
    });
    it("should apply 'column' direction correctly", () => {
        cardComponent.direction = "column";
        cardComponent.ngOnInit();
        expect(cardComponent.directionRow).toBe(false);
        expect(cardComponent.directionColumn).toBe(true);
    });
});
