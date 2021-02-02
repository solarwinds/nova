import { ComponentPortal, PortalModule } from "@angular/cdk/portal";
import {
    ApplicationRef,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    InjectFlags,
    InjectionToken,
    Injector,
    Renderer2,
    RendererFactory2,
    Type
} from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { NuiPanelModule } from "@nova-ui/bits";
import { GridsterModule } from "angular-gridster2";
import { of } from "rxjs";

import { PreviewOverlayComponent } from "../../common/components/preview-overlay/preview-overlay.component";
import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { WidgetComponent } from "../../components/widget/widget.component";
import { GridsterItemWidgetIdDirective } from "../../directives/gridster-item-widget-id/gridster-item-widget-id.directive";
import { mockLoggerService } from "../../mocks";
import { PizzagnaComponent } from "../../pizzagna/components/pizzagna/pizzagna.component";
import { ComponentPortalDirective } from "../../pizzagna/directives/component-portal/component-portal.directive";
import { WidgetTypesService } from "../../services/widget-types.service";
import { proportional } from "../../widget-types/proportional/proportional";
import { table } from "../../widget-types/table/table";
import { ConfiguratorComponent } from "../components/configurator/configurator.component";

import { ConfiguratorService } from "./configurator.service";
import { IConfigurator } from "./types";

class MockComponentFactoryResolver {
    constructor(private configuratorComponentRef: ComponentRef<ConfiguratorComponent>) {
    }

    public resolveComponentFactory<T>(): Partial<ComponentFactory<T>> {
        const componentRef = this.configuratorComponentRef;
        return {
            create(): ComponentRef<any> {
                componentRef.instance.changeDetector.detectChanges = () => {
                };
                return componentRef;
            },
        };
    }
}

class MockInjector implements Injector {
    public get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T {
        // @ts-ignore: Suppressed for test purposes
        return null;
    }
}

class MockRenderer implements Partial<Renderer2> {
    public appendChild() {
    }

    public setStyle() {
    }

    public removeStyle() {
    }

    public removeChild() {
    }
}

class MockRendererFactory {
    public createRenderer(): Partial<Renderer2> {
        return new MockRenderer();
    }

    public begin(): void {
    }

    public end(): void {
    }

    public async whenRenderingDone?(): Promise<any> {
        return Promise.resolve(null);
    }
}

describe("ConfiguratorService > ", () => {
    let service: ConfiguratorService;
    let dashboardComponent: DashboardComponent;
    let configuratorNativeElement: any;
    let configuratorArgs: IConfigurator;
    let widgetTypesService: WidgetTypesService;
    let configComponentFixture: ComponentFixture<ConfiguratorComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                GridsterModule,
                PortalModule,
                NuiPanelModule,
                RouterTestingModule.withRoutes([]),
            ],
            declarations: [
                GridsterItemWidgetIdDirective,
                ComponentPortalDirective,
                ConfiguratorComponent,
                DashboardComponent,
                PizzagnaComponent,
                PreviewOverlayComponent,
                WidgetComponent,
            ],
            providers: [
                WidgetTypesService,
            ],
        });
        dashboardComponent = TestBed.createComponent(DashboardComponent).componentInstance;
        configComponentFixture = TestBed.createComponent(ConfiguratorComponent);
        configuratorNativeElement = configComponentFixture.debugElement.nativeElement;
        const appRef = TestBed.inject(ApplicationRef) as ApplicationRef;
        const router = TestBed.inject(Router);
        appRef.attachView = (): void => {
        };

        widgetTypesService = new WidgetTypesService();
        widgetTypesService.registerWidgetType("table", 2, table);
        widgetTypesService.registerWidgetType("proportional", 1, proportional);

        service = new ConfiguratorService(
            new MockComponentFactoryResolver(configComponentFixture.componentRef) as ComponentFactoryResolver,
            widgetTypesService,
            new MockInjector(),
            appRef,
            mockLoggerService,
            new MockRendererFactory() as RendererFactory2,
            router
        );

        configuratorArgs = {
            dashboardComponent,
            portalBundle: {
                portal: {} as ComponentPortal<any>,
            },
        };

    });

    afterEach(() => {
        document.body.removeChild(configuratorNativeElement);
    });

    describe("open > ", () => {
        it("should append the configurator to the document body", () => {
            const spy = spyOn((<any>service), "appendComponentToBody").and.callThrough();
            service.open(configuratorArgs);
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("handleSubmit >", () => {
        it("should update widget on dashboard", fakeAsync(() => {
            const originalWidget = {
                id: "id",
                type: "proportional",
                pizzagna: {
                    structure: {
                        structureComponent: {
                            id: "structureComponent",
                            componentType: "StructureComponentType",
                        },
                    },
                    configuration: {
                        configurationComponent: {
                            id: "configurationComponent",
                            componentType: "ConfigurationComponentType",
                        },
                    },
                    data: {
                        dataComponent: {
                            id: "dataComponent",
                            componentType: "DataComponentType",
                        },
                    },
                },
                version: 1,
            };

            const newWidget = {
                id: "id",
                type: "table",
                pizzagna: {
                    structure: {
                        structureComponent: {
                            id: "structureComponent2",
                            componentType: "StructureComponentType2",
                        },
                    },
                    configuration: {
                        configurationComponent: {
                            id: "configurationComponent2",
                            componentType: "ConfigurationComponentType2",
                        },
                    },
                    data: {
                        dataComponent: {
                            id: "dataComponent2",
                            componentType: "DataComponentType2",
                        },
                    },
                },
                version: 2,
            };

            dashboardComponent.dashboard = {
                positions: {
                    [originalWidget.id]: {
                        x: 0,
                        y: 0,
                        rows: 1,
                        cols: 1,
                    },
                },
                widgets: {
                    [originalWidget.id]: originalWidget,
                },
            };

            // we don't want anything to happen here
            service.close = () => {
            };

            const removeWidgetSpy = spyOn(dashboardComponent, "removeWidget").and.callThrough();

            of(newWidget)
                .pipe(service.handleSubmit({
                    widget: originalWidget,
                    dashboardComponent: dashboardComponent,
                    // @ts-ignore: Suppressed for test purposes
                }, undefined))
                .subscribe();

            flush();

            configComponentFixture.whenStable().then(() => {
                expect(removeWidgetSpy).toHaveBeenCalledWith("id", false);

                const dashboardWidget = dashboardComponent.dashboard.widgets["id"];

                expect(dashboardWidget.type).toBe(newWidget.type);
                expect(dashboardWidget.version).toBe(newWidget.version);

                expect(dashboardWidget.pizzagna.data).toBeUndefined("data to be erased");

                expect(dashboardWidget.pizzagna.configuration).toBe(
                    newWidget.pizzagna.configuration, "configuration to be taken from the updated widget");

                expect(dashboardWidget.pizzagna.structure).toBe(
                    widgetTypesService.getWidgetType(newWidget.type, newWidget.version).widget.structure,
                    "structure to be taken from the new widget's type");
            });
        }));
    });

});
