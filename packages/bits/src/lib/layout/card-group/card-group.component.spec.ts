import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CardGroupComponent } from "./card-group.component";

describe("card-group", () => {
    let fixture: ComponentFixture<CardGroupComponent>;
    let cardGroupComponent: CardGroupComponent;

    beforeEach(() => {
        TestBed
            .configureTestingModule({
                declarations: [CardGroupComponent],
            });
        fixture = TestBed.createComponent(CardGroupComponent);
        cardGroupComponent = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should apply 'row' direction correctly", () => {
        cardGroupComponent.direction = "row";
        cardGroupComponent.ngOnInit();
        expect(cardGroupComponent.directionRow).toBe(true);
        expect(cardGroupComponent.directionColumn).toBe(false);
    });
    it("should apply 'column' direction correctly", () => {
        cardGroupComponent.direction = "column";
        cardGroupComponent.ngOnInit();
        expect(cardGroupComponent.directionRow).toBe(false);
        expect(cardGroupComponent.directionColumn).toBe(true);
    });
});
