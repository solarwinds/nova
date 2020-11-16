import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ElementRef, getDebugNode, Injectable, ViewChild} from "@angular/core";
import {ComponentFixture, inject, TestBed} from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { LoggerService } from "../../services/log-service";
import { TabNavigationService } from "../../services/tab-navigation.service";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { SpinnerComponent } from "../spinner/spinner.component";
import { TooltipDirective } from "../tooltip/tooltip.directive";

import { BusyComponent } from "./busy.component";

@Component({
    selector: "nui-button-on-div-no-type",
    template: `
        <div #ref nui-busy [busy]="busy">
            <div tabindex="1"></div>
            <button>button</button>
            <a href="#" tabindex="2">link</a>
            <input type="text" value="empty"/>
        </div>
    `,
})
class TestBusyWithTabNavigatableChildrensComponent {
    public busy: boolean;
    @ViewChild("ref", { read: ElementRef }) busyComponentElRef: ElementRef;
}

@Injectable()
class MockTabNavigationService extends TabNavigationService {}

describe("components >", () => {
    describe("busy >", () => {
        beforeEach(async() => {
            TestBed.configureTestingModule({
                declarations: [
                    BusyComponent,
                    SpinnerComponent,
                    TooltipDirective,
                    CheckboxComponent,

                    TestBusyWithTabNavigatableChildrensComponent,
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
                providers: [
                    LoggerService,
                    TabNavigationService,
                ],
            }).compileComponents();
        });

        describe("basic >", () => {
            let fixture: ComponentFixture<BusyComponent>;
            let component: BusyComponent;

            beforeEach(() => {
                fixture = TestBed.createComponent(BusyComponent);
                component = fixture.componentInstance;
                component.isDefaultTemplate = true;
            });

            it("should contain spinner if busy state is true", (done: DoneFn) => {
                component.busy = true;
                fixture.detectChanges();

                setTimeout(() => {
                    const progressBar = fixture.debugElement.query(By.css(".nui-spinner"));
                    fixture.detectChanges();
                    expect(progressBar).toBeTruthy();
                    done();
                }, 250);
            });

            it("shouldn't contain spinner if busy state is false", (done: DoneFn) => {
                component.busy = false;
                fixture.detectChanges();

                setTimeout(() => {
                    const progressBar = fixture.debugElement.query(By.css(".nui-spinner"));
                    fixture.detectChanges();
                    expect(progressBar).toBeFalsy();
                    done();
                }, 250);
            });
        });

        describe("tab navigation >", () => {
            let fixture: ComponentFixture<TestBusyWithTabNavigatableChildrensComponent>;

            // we use a host component that actually is hosting our BusyComponent
            // in order to be able to test ngOnChanges
            let hostComponent: TestBusyWithTabNavigatableChildrensComponent;

            let debugElement: DebugElement;
            let tabNavigationService: TabNavigationService;
            let componentTabNavigationService: TabNavigationService | undefined;

            beforeEach( () => {
                // configure the component with another set of Providers
                TestBed.overrideComponent(
                    BusyComponent,
                    { set: { providers: [{ provide: TabNavigationService, useClass: MockTabNavigationService }] } }
                );

                // create component and test fixture
                fixture = TestBed.createComponent(TestBusyWithTabNavigatableChildrensComponent);

                // TabNavigationService provided to the TestBed
                tabNavigationService = TestBed.inject(TabNavigationService);

                debugElement = fixture.debugElement.query(By.directive(BusyComponent));

                // get test component from the fixture
                hostComponent = fixture.componentInstance;

                // TabNavigationService provided by Component, (should return MockTabNavigationService)
                componentTabNavigationService = getDebugNode(debugElement.nativeElement)?.injector.get(TabNavigationService);
            });

            it("should inject TabNavigationService", () => {
                // service injected via inject(...) and TestBed.get(...) should be the same instance
                inject([TabNavigationService], (injectService: TabNavigationService) => {
                    expect(injectService).toBe(tabNavigationService);
                });

                // service injected via component should be an instance of MockAuthService
                expect(componentTabNavigationService instanceof MockTabNavigationService).toBeTruthy();
            });

            it("should detect navigatable elements and disable tab navigation for them", () => {
                if (!componentTabNavigationService) {
                    throw new Error("componentTabNavigationService is not defined");
                }
                const spy = spyOn(componentTabNavigationService, "disableTabNavigation");

                // enable busy
                hostComponent.busy = true;
                fixture.detectChanges();

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(hostComponent.busyComponentElRef);
            });

            it("should enable tab navigation after busy is disabled and restore tabindex", () => {
                if (!componentTabNavigationService) {
                    throw new Error("componentTabNavigationService is not defined");
                }
                const spy = spyOn(componentTabNavigationService, "restoreTabNavigation");

                // enable busy in order to trigger automatically ngOnChanges
                hostComponent.busy = true;
                fixture.detectChanges();

                // disable busy
                hostComponent.busy = false;
                fixture.detectChanges();

                expect(spy).toHaveBeenCalled();
                expect(spy).toHaveBeenCalledTimes(1);
            });
        });

    });
});
