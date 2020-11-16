import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EventBus } from "@solarwinds/nova-bits";

import { NuiDashboardsModule } from "../../../dashboards.module";
import { DynamicComponentCreator } from "../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS } from "../../../types";

import { StackComponent } from "./stack.component";

describe("StackComponent", () => {
    let component: StackComponent;
    let fixture: ComponentFixture<StackComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ NuiDashboardsModule ],
            providers: [
                PizzagnaService,
                DynamicComponentCreator,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StackComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit > ", () => {
        it("should apply the correct css class names to the host", () => {
            component.direction = "row";
            component.elementClass = "myElClass";
            expect(component.classNames).toBeUndefined();
            component.ngOnInit();
            expect(component.classNames).toEqual(`${component.defaultClassNames} flex-${component.direction} ${component.elementClass}`);
        });
    });
});
