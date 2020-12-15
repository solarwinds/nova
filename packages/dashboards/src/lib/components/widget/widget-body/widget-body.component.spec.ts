import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EventBus, IEvent } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../dashboards.module";
import { DynamicComponentCreator } from "../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { DASHBOARD_EDIT_MODE } from "../../../services/types";
import { IPizza, PIZZAGNA_EVENT_BUS } from "../../../types";

import { WidgetBodyComponent } from "./widget-body.component";

describe("WidgetBodyComponent", () => {
    let component: WidgetBodyComponent;
    let fixture: ComponentFixture<WidgetBodyComponent>;
    let eventBus: EventBus<IEvent>;
    let dynamicComponentCreator: DynamicComponentCreator;
    let pizzagnaService: PizzagnaService;
    const testComponents: IPizza = {
        component1: {
            id: "component1",
            componentType: "compType1",
        },
        component2: {
            id: "component2",
            componentType: "compType2",
        },
    };

    beforeEach(async(() => {
        eventBus = new EventBus();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(eventBus, dynamicComponentCreator);
        pizzagnaService.updateComponents(testComponents);

        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                DynamicComponentCreator,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
                {
                    provide: PizzagnaService,
                    useValue: pizzagnaService,
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetBodyComponent);
        component = fixture.componentInstance;
        component.componentId = "body";
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit", () => {
        it("should initialize 'classNames'", () => {
            component.elementClass = "test-class";
            component.ngOnInit();
            expect(component.classNames).toEqual(`${component.defaultClasses} ${component.elementClass}`);
        });

        it("should subscribe to the 'DASHBOARD_EDIT_MODE' event", () => {
            const spy = spyOn(pizzagnaService, "setProperty");
            component.ngOnInit();
            eventBus.getStream(DASHBOARD_EDIT_MODE).next({ payload: true });

            expect(spy).toHaveBeenCalledWith({
                componentId: "body",
                pizzagnaKey: "data",
                propertyPath: ["editMode"],
            }, true);

            eventBus.getStream(DASHBOARD_EDIT_MODE).next({ payload: false });

            expect(spy).toHaveBeenCalledWith({
                componentId: "body",
                pizzagnaKey: "data",
                propertyPath: ["editMode"],
            }, false);
        });
    });

    describe("ngOnDestroy", () => {
        it("should unsubscribe from the 'DASHBOARD_EDIT_MODE' event", () => {
            const spy = spyOn(pizzagnaService, "setProperty");
            component.ngOnInit();
            component.ngOnDestroy();
            eventBus.getStream(DASHBOARD_EDIT_MODE).next({ payload: true });

            expect(spy).not.toHaveBeenCalled();
        });
    });
});
