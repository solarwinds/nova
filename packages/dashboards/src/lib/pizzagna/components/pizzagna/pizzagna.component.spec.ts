import { PortalModule } from "@angular/cdk/portal";
import { ScrollingModule } from "@angular/cdk/scrolling";
import {
    ChangeDetectorRef,
    Component,
    Input,
    LOCALE_ID,
    SimpleChange,
    SimpleChanges,
    TRANSLATIONS,
    TRANSLATIONS_FORMAT,
} from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    waitForAsync,
} from "@angular/core/testing";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import {
    LoggerService,
    NuiBusyModule,
    NuiIconModule,
    NuiImageModule,
    NuiMenuModule,
    NuiMessageModule,
    NuiPopupModule,
    NuiSpinnerModule,
    NuiTableModule,
} from "@nova-ui/bits";

import { KpiComponent } from "../../../components/kpi-widget/kpi.component";
import { StackComponent } from "../../../components/layouts/stack/stack.component";
import { TilesComponent } from "../../../components/layouts/tiles/tiles.component";
import { TableWidgetComponent } from "../../../components/table-widget/table-widget.component";
import { TemplateLoadErrorComponent } from "../../../components/template-load-error/template-load-error.component";
import { WidgetHeaderComponent } from "../../../components/widget/widget-header/widget-header.component";
import { mockLoggerService } from "../../../mocks";
import { ProviderRegistryService } from "../../../services/provider-registry.service";
import {
    ISetPropertyPayload,
    NOVA_DASHBOARD_EVENT_PROXY,
    NOVA_DATASOURCE_INTERVAL_REFRESHER,
    SET_PROPERTY_VALUE,
    WIDGET_RESIZE,
} from "../../../services/types";
import { IPizzagna, WellKnownProviders } from "../../../types";
import { ComponentPortalDirective } from "../../directives/component-portal/component-portal.directive";

import { PizzagnaComponent } from "./pizzagna.component";

@Component({
    selector: "pizzagna-test",
    template: ` <nui-pizzagna [(pizzagna)]="pizzagna"></nui-pizzagna>`,
})
class PizzagnaTestComponent {
    @Input()
    public pizzagna: IPizzagna;

    constructor(public changeDetector: ChangeDetectorRef) {}
}

describe("Pizzagna", () => {
    let component: PizzagnaComponent;
    let fixture: ComponentFixture<PizzagnaComponent>;
    const emptyPizzagna: IPizzagna = {
        structure: {
            "/": {
                componentType: "StackComponent",
            },
        },
    };

    beforeEach(waitForAsync(() => {
        const entryComponents = [
            TemplateLoadErrorComponent,
            StackComponent,
            KpiComponent,
            TableWidgetComponent,
            TilesComponent,
            WidgetHeaderComponent,
        ];
        TestBed.configureTestingModule({
            imports: [
                PortalModule,
                ScrollingModule,
                NuiBusyModule,
                NuiTableModule,
                NuiImageModule,
                NuiMenuModule,
                NuiPopupModule,
                NuiIconModule,
                NuiMessageModule,
                NuiSpinnerModule,
            ],
            declarations: [
                ComponentPortalDirective,
                PizzagnaTestComponent,
                PizzagnaComponent,
                ...entryComponents,
            ],
            providers: [
                ProviderRegistryService,
                {
                    provide: LoggerService,
                    useValue: mockLoggerService,
                },
                // format of translations that you use
                { provide: TRANSLATIONS_FORMAT, useValue: "xlf" },
                // the translations that you need to load on your own
                { provide: TRANSLATIONS, useValue: "" },
                // locale id that you're using (default en-US)
                { provide: LOCALE_ID, useValue: "fr" },
            ],
        })
            .overrideModule(BrowserDynamicTestingModule, {
                set: { entryComponents },
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PizzagnaComponent);
        component = fixture.componentInstance;
        component.pizzagna = emptyPizzagna;
        const changes: SimpleChanges = {
            pizzagna: {
                currentValue: emptyPizzagna,
            } as SimpleChange,
        };
        component.ngOnChanges(changes);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should emit pizzagnaChange on SET_PROPERTY_VALUE event", () => {
        const spy = spyOn(component.pizzagnaChange, "emit");
        const propertyPathPayload: ISetPropertyPayload = {
            path: "testPath",
            value: "test value",
        };
        component.eventBus
            .getStream(SET_PROPERTY_VALUE)
            .next({ payload: propertyPathPayload });
        expect(spy).toHaveBeenCalledWith({
            [propertyPathPayload.path]: propertyPathPayload.value,
            ...emptyPizzagna,
        });
    });

    describe("ngOnChanges > ", () => {
        it("should invoke pizzagnaService.updatePizzagna", () => {
            const changedPizzagna = {
                ...component.pizzagna,
                structure: {
                    ...component.pizzagna.structure,
                    test: {
                        id: "testId",
                        componentType: "testType",
                    },
                },
            };
            const changes: SimpleChanges = {
                pizzagna: new SimpleChange(
                    component.pizzagna,
                    changedPizzagna,
                    false
                ),
            };
            component.pizzagna = changedPizzagna;
            const spy = spyOn(component.pizzagnaService, "updatePizzagna");
            component.ngOnChanges(changes);
            expect(spy).toHaveBeenCalledWith(changedPizzagna);
        });

        it("should merge the changes into a new pizza", () => {
            const changedPizzagna = {
                ...component.pizzagna,
                structure: {
                    ...component.pizzagna.structure,
                    test: {
                        id: "testId",
                        componentType: "testType",
                    },
                },
            };
            const expectedPizza = { ...changedPizzagna.structure };
            const changes: SimpleChanges = {
                pizzagna: new SimpleChange(
                    component.pizzagna,
                    changedPizzagna,
                    false
                ),
            };
            component.pizzagna = changedPizzagna;
            component.ngOnChanges(changes);
            expect(component.pizza).toEqual(expectedPizza);
        });

        it("should invoke pizzagnaService.updateComponents", () => {
            const changedPizzagna = {
                ...component.pizzagna,
                structure: {
                    ...component.pizzagna.structure,
                    test: {
                        id: "testId",
                        componentType: "testType",
                    },
                },
            };
            const expectedPizza = { ...changedPizzagna.structure };
            const changes: SimpleChanges = {
                pizzagna: new SimpleChange(
                    component.pizzagna,
                    changedPizzagna,
                    false
                ),
            };
            component.pizzagna = changedPizzagna;
            const spy = spyOn(component.pizzagnaService, "updateComponents");
            component.ngOnChanges(changes);
            expect(spy).toHaveBeenCalledWith(expectedPizza);
        });
    });

    describe("onOutput > ", () => {
        it("should emit the output Output", () => {
            const testEvent = { payload: "testPayload" };
            spyOn(component.output, "emit");
            component.onOutput(testEvent);
            expect(component.output.emit).toHaveBeenCalledWith(testEvent);
        });
    });

    describe("pizzagna change detection", () => {
        it("works", fakeAsync(() => {
            const pizzagnaTest = TestBed.createComponent(PizzagnaTestComponent);
            const instance = pizzagnaTest.componentInstance;
            instance.pizzagna = {};
            instance.changeDetector.detectChanges();

            const kpi = {
                structure: {
                    "/": {
                        id: "/",
                        componentType: StackComponent.lateLoadKey,
                        providers: {
                            [WellKnownProviders.Refresher]: {
                                providerId: NOVA_DATASOURCE_INTERVAL_REFRESHER,
                                properties: {
                                    interval: 5,
                                },
                            },
                            [WellKnownProviders.EventProxy]: {
                                providerId: NOVA_DASHBOARD_EVENT_PROXY,
                            },
                        },
                        properties: {
                            direction: "column",
                            nodes: ["header", "tiles"],
                        },
                    },
                    header: {
                        id: "header",
                        componentType: WidgetHeaderComponent.lateLoadKey,
                    },
                    tiles: {
                        id: "tiles",
                        componentType: TilesComponent.lateLoadKey,
                        properties: {
                            elementClass: "flex-grow-1 mx-3 mb-3 overflow-auto",
                        },
                    },
                },
            };
            const table = {
                structure: {
                    "/": {
                        id: "/",
                        componentType: StackComponent.lateLoadKey,
                        providers: {
                            [WellKnownProviders.EventProxy]: {
                                providerId: NOVA_DASHBOARD_EVENT_PROXY,
                                properties: {
                                    downstreams: [WIDGET_RESIZE],
                                },
                            },
                        },
                        properties: {
                            direction: "column",
                            nodes: ["header", "stack"],
                        },
                    },
                    header: {
                        id: "header",
                        componentType: WidgetHeaderComponent.lateLoadKey,
                    },
                    stack: {
                        id: "stack",
                        componentType: StackComponent.lateLoadKey,
                        properties: {
                            nodes: ["table"],
                        },
                    },
                    table: {
                        id: "table",
                        componentType: TableWidgetComponent.lateLoadKey,
                        properties: {
                            elementClass: "flex-grow-1 m-3",
                        },
                    },
                },
                configuration: {
                    header: {
                        properties: {
                            title: $localize`Table Widget!`,
                            subtitle: $localize`Basic table widget`,
                        },
                    },
                    table: {
                        properties: {
                            configuration: {
                                columns: [
                                    {
                                        id: "column1",
                                        label: $localize`No.`,
                                        isActive: true,
                                        dataFieldIds: ["position"],
                                        formatterId: "raw",
                                    },
                                    {
                                        id: "column2",
                                        label: $localize`Name`,
                                        isActive: true,
                                        dataFieldIds: ["name"],
                                        formatterId: "raw",
                                    },
                                    {
                                        id: "column3",
                                        label: $localize`CPU Load`,
                                        isActive: true,
                                        dataFieldIds: ["cpu-load"],
                                        formatterId: "raw",
                                    },
                                ],
                            },
                        },
                    },
                },
            };

            expect(() => {
                instance.pizzagna = kpi;
                instance.changeDetector.detectChanges();

                instance.pizzagna = table;
                instance.changeDetector.detectChanges();

                instance.pizzagna = kpi;
                instance.changeDetector.detectChanges();

                instance.pizzagna = {};
                instance.changeDetector.detectChanges();

                flush();
            }).not.toThrow();
        }));
    });
});
