import { ChangeDetectorRef, Component } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { LoggerService, NuiBusyModule, NuiButtonModule, NuiIconModule, NuiSpinnerModule } from "@nova-ui/bits";

import { TemplateLoadErrorComponent } from "../../../components/template-load-error/template-load-error.component";
import { mockChangeDetector, mockLoggerService } from "../../../mocks";
import { NuiPizzagnaModule } from "../../../pizzagna/pizzagna.module";
import { ProviderRegistryService } from "../../../services/provider-registry.service";
import { WidgetTypesService } from "../../../services/widget-types.service";
import { IWidget, PizzagnaLayer } from "../../../types";
import { kpi } from "../../../widget-types/kpi/kpi";
import { table } from "../../../widget-types/table/table";
import { PreviewService } from "../../services/preview.service";
import { ConfiguratorComponent } from "../configurator/configurator.component";
import { ConfiguratorHeadingComponent } from "../heading/configurator-heading.component";
import { DashwizStepComponent } from "../wizard/dashwiz-step/dashwiz-step.component";
import { DashwizButtonsComponent } from "../wizard/dashwiz/dashwiz-buttons.component";
import { DashwizComponent } from "../wizard/dashwiz/dashwiz.component";
import { IDashwizStepNavigatedEvent } from "../wizard/types";

import { WidgetClonerComponent } from "./widget-cloner.component";

@Component({
    selector: "mock-clone-selection",
    template: ``,
})
class MockCloneSelectionComponent {
    public static lateLoadKey = "MockCloneSelectionComponent";
}

describe("WidgetClonerComponent", () => {
    let component: WidgetClonerComponent;
    let fixture: ComponentFixture<WidgetClonerComponent>;
    let dashwiz: DashwizComponent;

    const testWidget: IWidget = {
        id: "testId",
        type: "kpi",
        pizzagna: {},
    };

    const widgetTypesService = new WidgetTypesService();
    widgetTypesService.registerWidgetType("kpi", 1, kpi);
    widgetTypesService.registerWidgetType("table", 1, table);

    const previewService = new PreviewService();

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                ConfiguratorHeadingComponent,
                DashwizButtonsComponent,
                DashwizComponent,
                DashwizStepComponent,
                WidgetClonerComponent,
                MockCloneSelectionComponent,
                TemplateLoadErrorComponent,
            ],
            imports: [
                ReactiveFormsModule,
                NuiButtonModule,
                NuiBusyModule,
                NuiIconModule,
                NuiPizzagnaModule,
                NuiSpinnerModule,
            ],
            providers: [
                PreviewService,
                ProviderRegistryService,
                ConfiguratorComponent,
                {
                    provide: PreviewService,
                    useValue: previewService,
                },
                {
                    provide: WidgetTypesService,
                    useValue: widgetTypesService,
                },
                {
                    provide: ChangeDetectorRef,
                    useValue: mockChangeDetector,
                },
                {
                    provide: LoggerService,
                    useValue: mockLoggerService,
                },
            ],
        }).overrideModule(BrowserDynamicTestingModule,
            {
                set: {
                    entryComponents: [
                        DashwizButtonsComponent,
                        MockCloneSelectionComponent,
                        TemplateLoadErrorComponent,
                    ],
                },
            }
        ).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetClonerComponent);
        component = fixture.componentInstance;
        component.cloneSelectionComponentType = MockCloneSelectionComponent;
        const dashwizDE = fixture.debugElement.query(By.directive(DashwizComponent));
        dashwiz = dashwizDE.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should reset the form on instantiation", () => {
        expect(component.form.value).toEqual({});
        const spy = spyOn(component.changeDetector, "markForCheck");

        // trigger status change
        component.form.setValue({});

        expect(spy).toHaveBeenCalled();
    });

    it("should preserve id of the previewed widget on update", fakeAsync(() => {
        const configurator = component.configurator;
        const previewWidget: IWidget = {
            id: "aaa",
            type: "table",
            pizzagna: {},
        };
        configurator.updateWidget(previewWidget);

        const selectedWidget: IWidget = {
            id: "bbb",
            type: "kpi",
            pizzagna: {},
        };

        component.onSelect(selectedWidget);

        flush();

        expect(configurator.previewWidget?.id).toEqual(previewWidget.id); // id remained unchanged
        expect(configurator.previewWidget?.type).toEqual(selectedWidget.type);
    }));

    describe("Wizard Navigation > ", () => {
        it("should not allow the user to proceed by default", () => {
            expect(dashwiz.canProceed).toEqual(false);
        });

        it("should allow the user to proceed if the widgetTemplate is set", () => {
            component.widgetTemplate = {} as IWidget;
            fixture.detectChanges();
            component.changeDetector.detectChanges();
            expect(dashwiz.canProceed).toEqual(true);
        });

        it("should not allow the user to finish by default", () => {
            expect(dashwiz.canFinish).toEqual(false);
        });

        it("should not allow the user to finish if the widgetTemplate configuration is set and 'needsConfiguration' is true", () => {
            component.widgetTemplate = {
                pizzagna: { configuration: {} },
                metadata: {
                    needsConfiguration: true,
                },
            } as unknown as IWidget;
            fixture.detectChanges();
            component.changeDetector.detectChanges();
            expect(dashwiz.canFinish).toEqual(false);
        });

        it("should allow the user to finish if the widgetTemplate configuration is set and 'needsConfiguration' is falsy", () => {
            component.widgetTemplate = {
                pizzagna: { configuration: {} },
                metadata: {
                    needsConfiguration: false,
                },
            } as unknown as IWidget;
            fixture.detectChanges();
            component.changeDetector.detectChanges();
            expect(dashwiz.canFinish).toEqual(true);
        });

        it("should invoke onStepNavigated on dashwiz stepNavigated output", () => {
            const testPayload = { currentStepIndex: 0 } as IDashwizStepNavigatedEvent;
            const spy = spyOn(component, "onStepNavigated");
            dashwiz.stepNavigated.next(testPayload);
            expect(spy).toHaveBeenCalledWith(testPayload);
        });
    });

    describe("onStepNavigated > ", () => {
        beforeEach(() => {
            spyOn(component, "onPreviewPizzagnaUpdate");
            component.widgetTemplate = testWidget;
        });

        describe("Wizard Step 0 > ", () => {
            describe("if the currentStepIndex is 0 and the previousStepIndex is 1 > ", () => {
                it("should set the formPizzagna to undefined", () => {
                    component.onStepNavigated({ currentStepIndex: 1 } as IDashwizStepNavigatedEvent);
                    const expectedPizzagna = widgetTypesService.getWidgetType(component.widgetTemplate.type, component.widgetTemplate.version).configurator;
                    expect(component.formPizzagna).toEqual(expectedPizzagna);
                    component.onStepNavigated({ currentStepIndex: 0, previousStepIndex: 1 } as IDashwizStepNavigatedEvent);
                    expect(component.formPizzagna).not.toBeDefined();
                });

                it("should invoke change detection in response to form status changes", () => {
                    const spy = spyOn(component.changeDetector, "markForCheck");
                    component.onStepNavigated({ currentStepIndex: 0, previousStepIndex: 1 } as IDashwizStepNavigatedEvent);

                    // trigger status change
                    component.form.setValue({});

                    expect(spy).toHaveBeenCalled();
                });

                it("should re-instantiate the form", () => {
                    const previousForm = component.form;
                    component.onStepNavigated({ currentStepIndex: 0, previousStepIndex: 1 } as IDashwizStepNavigatedEvent);
                    expect(previousForm).not.toBe(component.form);
                });

                it("should unsubscribe from status changes on the previous form instance", () => {
                    const spy = spyOn(component.changeDetector, "markForCheck");
                    const previousForm = component.form;
                    component.onStepNavigated({ currentStepIndex: 0, previousStepIndex: 1 } as IDashwizStepNavigatedEvent);

                    // trigger status change
                    previousForm.setValue({});

                    expect(spy).not.toHaveBeenCalled();
                });

                it("should unsubscribe from status changes on ngOnDestroy", () => {
                    const spy = spyOn(component.changeDetector, "markForCheck");
                    component.onStepNavigated({ currentStepIndex: 0, previousStepIndex: 1 } as IDashwizStepNavigatedEvent);
                    component.ngOnDestroy();

                    // trigger status change
                    component.form.setValue({});

                    expect(spy).not.toHaveBeenCalled();
                });

                it("should invoke onSelect with the current widgetTemplate", () => {
                    const expectedWidgetTemplate = component.widgetTemplate;
                    const spy = spyOn(component, "onSelect");
                    component.onStepNavigated({ currentStepIndex: 0, previousStepIndex: 1 } as IDashwizStepNavigatedEvent);

                    expect(spy).toHaveBeenCalledWith(expectedWidgetTemplate);
                });
            });
        });

        describe("Wizard Step 1 > ", () => {
            it("should set isFormDisplayed to true", () => {
                expect(component.isFormDisplayed).toEqual(false);
                component.onStepNavigated({ currentStepIndex: 1 } as IDashwizStepNavigatedEvent);
                expect(component.isFormDisplayed).toEqual(true);
            });

            it("should set isFormDisplayed to false if the currentStepIndex is anything but 1", () => {
                component.onStepNavigated({ currentStepIndex: 1 } as IDashwizStepNavigatedEvent);
                expect(component.isFormDisplayed).toEqual(true);
                component.onStepNavigated({ currentStepIndex: 3 } as IDashwizStepNavigatedEvent);
                expect(component.isFormDisplayed).toEqual(false);
                component.onStepNavigated({ currentStepIndex: 1 } as IDashwizStepNavigatedEvent);
                expect(component.isFormDisplayed).toEqual(true);
                component.onStepNavigated({ currentStepIndex: 0 } as IDashwizStepNavigatedEvent);
                expect(component.isFormDisplayed).toEqual(false);
            });

            it("should set the formPizzagna", () => {
                component.onStepNavigated({ currentStepIndex: 1 } as IDashwizStepNavigatedEvent);
                const expectedPizzagna = widgetTypesService.getWidgetType(component.widgetTemplate.type, component.widgetTemplate.version).configurator;
                expect(component.formPizzagna).toEqual(expectedPizzagna);
            });

            it("should set the previewService.preview", () => {
                component.widgetTemplate.pizzagna[PizzagnaLayer.Configuration] = { "test": {} };
                const expectedPreview = component.widgetTemplate.pizzagna.configuration;
                component.onStepNavigated({ currentStepIndex: 1 } as IDashwizStepNavigatedEvent);
                expect(previewService.preview).toEqual(expectedPreview);
            });
        });
    });

    describe("onPreviewPizzagnaUpdate > ", () => {
        it("should not invoke configurator.widgetUpdate if isFormDisplayed is false", () => {
            component.isFormDisplayed = false;
            const spy = spyOn(component.configurator, "updateWidget");
            component.onPreviewPizzagnaUpdate({});
            expect(spy).not.toHaveBeenCalled();
        });

        it("should invoke configurator.widgetUpdate if isFormDisplayed is true", () => {
            component.isFormDisplayed = true;
            component.configurator.previewWidget = testWidget;
            const spy = spyOn(component.configurator, "updateWidget");
            component.onPreviewPizzagnaUpdate({});
            expect(spy).toHaveBeenCalled();
        });
    });

});
