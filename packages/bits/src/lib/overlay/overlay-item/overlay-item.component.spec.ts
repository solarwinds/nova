import { DebugElement, NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { OverlayItemComponent } from "./overlay-item.component";

describe("OverlayItemComponent", () => {
    let component: OverlayItemComponent;
    let fixture: ComponentFixture<OverlayItemComponent>;
    let debug: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                OverlayItemComponent,
            ],
            imports: [],
            schemas: [ NO_ERRORS_SCHEMA ],
        })
        .compileComponents();
        TestBed.configureTestingModule({
            declarations: [OverlayItemComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OverlayItemComponent);
        component = fixture.componentInstance;
        debug = fixture.debugElement;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("active style", () => {
        afterAll(() => {
            component.active = false;
        });

        it("should set active styles", () => {
            component.active = false;
            component.setActiveStyles();
            expect(component.active).toEqual(true);
        });

        it("should set inactive styles", () => {
            component.active = true;
            component.setInactiveStyles();
            expect(component.active).toEqual(false);
        });
    });

    it("should call scrollIntoView", () => {
        const scrollSpy = spyOn<any>(debug.nativeElement, "scrollIntoView");
        component.scrollIntoView();
        expect(scrollSpy).toHaveBeenCalled();
    });

    describe("host binding inputs >", () => {
        afterAll(() => {
            component.isDisabled = false;
            component.active = false;
        });

        ["active", "disabled"]
            .forEach(className => {
                it(`is not have ${className} class name by default`, () => {
                    expect(debug.nativeElement.classList.value.includes(className)).toBe(false);
                });
            });

        it(`the "disabled" class is added`, () => {
            component.isDisabled = true;
            fixture.detectChanges();
            expect(debug.nativeElement.classList.value.includes("disabled")).toBe(true);
        });

        it(`the "active" class is added`, () => {
            component.active = true;
            fixture.detectChanges();
            expect(debug.nativeElement.classList.value.includes("active")).toBe(true);
        });
    });
});
