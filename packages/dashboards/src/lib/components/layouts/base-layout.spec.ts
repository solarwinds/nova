import { ChangeDetectorRef, Component, Input, SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EventBus, IEvent, LoggerService } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../dashboards.module";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { IPizza, PIZZAGNA_EVENT_BUS } from "../../types";

import { BaseLayout } from "./base-layout";

@Component({
    selector: "test-layout",
    template: ``,
})
class TestLayoutComponent extends BaseLayout {
    @Input() nodes: string[] = ["myId"];

    constructor(changeDetector: ChangeDetectorRef,
                pizzagnaService: PizzagnaService,
                logger: LoggerService) {
        super(changeDetector, pizzagnaService, logger);
    }

    public getNodes(): string[] {
        return this.nodes;
    }
}

describe("BaseLayout", () => {
    let component: TestLayoutComponent;
    let fixture: ComponentFixture<TestLayoutComponent>;
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

    beforeEach(waitForAsync(() => {
        eventBus = new EventBus();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(eventBus, dynamicComponentCreator);
        pizzagnaService.updateComponents(testComponents);

        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                {
                    provide: PizzagnaService,
                    useValue: pizzagnaService,
                },
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
            ],
            declarations: [
                TestLayoutComponent,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestLayoutComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        it("should not invoke updateNodeConfigs when the nodes input does not change", () => {
            spyOn((<any>component), "updateNodeConfigs");
            component.ngOnChanges({ test: new SimpleChange(null, null, false) });
            expect((<any>component).updateNodeConfigs).not.toHaveBeenCalled();
        });

        it("should invoke updateNodeConfigs when the nodes input changes", () => {
            spyOn((<any>component), "updateNodeConfigs");
            component.ngOnChanges({ nodes: new SimpleChange(null, null, false) });
            expect((<any>component).updateNodeConfigs).toHaveBeenCalled();
        });

        it("should update 'nodeConfigs' if the nodes change", () => {
            component.nodeComponentsConfigs = [testComponents["component1"]];
            component.nodes = ["component2"];
            component.ngOnChanges({ nodes: {} as SimpleChange });
            expect(component.nodeComponentsConfigs).toEqual([testComponents["component2"]]);
        });
    });

    describe("ngDoCheck", () => {
        it("should not update 'nodeComponentsConfigs' if the nodes don't change", () => {
            const testNodeConfigs = [testComponents["component1"]];
            component.nodeComponentsConfigs = testNodeConfigs;
            component.nodes = ["component1"];
            component.ngDoCheck();
            expect(component.nodeComponentsConfigs).toBe(testNodeConfigs);
        });

        it("should update 'nodeComponentsConfigs' if the nodes change", () => {
            const testNodeConfigs = [testComponents["component1"]];
            component.nodeComponentsConfigs = testNodeConfigs;
            component.nodes = ["component2"];
            component.ngDoCheck();
            expect(component.nodeComponentsConfigs).toEqual([testComponents["component2"]]);
            expect(component.nodeComponentsConfigs).not.toBe(testNodeConfigs);
        });

        it("should not modify the state in place when merging the template", () => {
            const testNodeConfigs = [testComponents["component1"]];
            component.nodeComponentsConfigs = testNodeConfigs;
            component.template = {
                properties: {
                    templateProperty: "value",
                },
            };
            component.nodes = ["component2"];

            const previousComponent2 = testComponents["component2"];
            const previousComponent2JSON = JSON.stringify(testComponents["component2"]);

            component.ngDoCheck();

            expect(component.nodeComponentsConfigs).toEqual([testComponents["component2"]]);
            expect(component.nodeComponentsConfigs).not.toBe(testNodeConfigs);

            expect(testComponents["component2"]).toBe(previousComponent2);
            expect(JSON.stringify(testComponents["component2"])).toBe(previousComponent2JSON);
        });
    });
});
