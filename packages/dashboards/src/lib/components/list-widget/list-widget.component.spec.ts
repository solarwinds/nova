import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EventBus, IEvent } from "@nova-ui/bits";
import {
    ListWidgetComponent,
    PIZZAGNA_EVENT_BUS,
    ProviderRegistryService,
} from "@nova-ui/dashboards";

describe(ListWidgetComponent.name, () => {
    let component: ListWidgetComponent;
    let fixture: ComponentFixture<ListWidgetComponent>;
    const eventBus = new EventBus<IEvent>();

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListWidgetComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("shouldDisplayRepeat", () => {
        it("should display repeat if data is provided (data length > 0)", () => {
            component.data = [{ id: "1", name: "Test" }];
            expect(component.shouldDisplayRepeat()).toBeTrue();
        });

        it("should not display repeat if data is not provided (data length = 0)", () => {
            component.data = [];
            expect(component.shouldDisplayRepeat()).toBeFalse();
        });

        it("should display repeat if data is provided (array of booleans)", () => {
            component.data = [true, false, true];
            expect(component.shouldDisplayRepeat()).toBeTrue();
        });

        it("should display repeat if data is provided (array of falsy values)", () => {
            component.data = [0, false, null, undefined, NaN, ""];
            expect(component.shouldDisplayRepeat()).toBeTrue();
        });

        it("should display repeat if data is provided (array of truthy values)", () => {
            component.data = [1, true, "hello", [true], { test: "value" }];
            expect(component.shouldDisplayRepeat()).toBeTrue();
        });
    });
});
