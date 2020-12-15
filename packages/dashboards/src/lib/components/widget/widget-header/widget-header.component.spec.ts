import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../dashboards.module";
import { DynamicComponentCreator } from "../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { REFRESH, WIDGET_EDIT, WIDGET_REMOVE } from "../../../services/types";
import { WidgetToDashboardEventProxyService } from "../../../services/widget-to-dashboard-event-proxy.service";
import { PIZZAGNA_EVENT_BUS } from "../../../types";

import { WidgetHeaderComponent } from "./widget-header.component";

describe("WidgetHeaderComponent", () => {
    let component: WidgetHeaderComponent;
    let fixture: ComponentFixture<WidgetHeaderComponent>;
    let pizzagnaService: PizzagnaService;
    let bannerElement: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                PizzagnaService,
                DynamicComponentCreator,
                WidgetToDashboardEventProxyService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetHeaderComponent);
        component = fixture.componentInstance;
        pizzagnaService = component.pizzagnaService;
        fixture.detectChanges();
        bannerElement = fixture.nativeElement;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("removable configuration >", () => {
        [true, false]
            .forEach(removable => {
                it(`is removable button shown ${removable}`, () => {
                    component.removable = removable;
                    fixture.detectChanges();
                    const removeEl = bannerElement.querySelector(".nui-widget-header__action-remove");
                    expect(!!removeEl).toBe(removable);
                });
            });

        it("should show the remove button by default", () => {
            const removeEl = bannerElement.querySelector(".nui-widget-header__action-remove");
            expect(removeEl).toBeTruthy();
        });
    });

    describe("editable configuration > ", () => {
        [true, false]
            .forEach(editable => {
                it(`is edit button shown ${editable}`, () => {
                    component.editable = editable;
                    fixture.detectChanges();
                    const pencilEl = bannerElement.querySelector(".nui-widget-header__action-edit");
                    expect(!!pencilEl).toBe(editable);
                });
            });

        it("should show the edit button by default", () => {
            const pencilEl = bannerElement.querySelector(".nui-widget-header__action-edit");
            expect(pencilEl).toBeTruthy();
        });
    });


    describe("ngOnInit > ", () => {
        it("should not collapse the header if collapsible is false", () => {
            component.collapsible = false;
            component.ngOnInit();
            expect(component.collapsed).toEqual(false);
        });

        it("should collapse the header if collapsible is true", () => {
            const spy = spyOn(pizzagnaService, "setProperty");

            component.collapsible = true;
            component.ngOnInit();
            expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
                propertyPath: ["isCollapsed"],
            }), true);
        });

        it("should not set the state to 'collapsed' if collapsible is false", () => {
            component.collapsed = false;
            component.ngOnInit();
            expect(component.state).toEqual("expanded");
        });

        it("should set the state to 'collapsed' if collapsible is true", () => {
            component.collapsible = true;
            component.collapsed = true;
            component.ngOnInit();
            expect(component.state).toEqual("collapsed");
        });
    });

    describe("removeWidget > ", () => {
        it("should invoke next on the event bus REMOVE stream", () => {
            spyOn((<any>component).eventBus.getStream(WIDGET_REMOVE), "next");
            component.removeWidget();
            expect((<any>component).eventBus.getStream(WIDGET_REMOVE).next).toHaveBeenCalled();
        });
    });

    describe("toggleCollapsed > ", () => {
        it("should toggle collapsed and state", () => {
            const spy = spyOn(pizzagnaService, "setProperty");

            component.collapsed = false;
            component.toggleCollapsed();
            expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
                propertyPath: ["collapsed"],
            }), true);
        });
    });

    describe("onWidgetEdit > ", () => {
        it("should invoke next on the event bus WIDGET_EDIT stream", () => {
            spyOn((<any>component).eventBus.getStream(WIDGET_EDIT), "next");
            component.onEditWidget();
            expect((<any>component).eventBus.getStream(WIDGET_EDIT).next).toHaveBeenCalled();
        });
    });

    describe("onReloadData > ", () => {
        it("should invoke next on the event bus REFRESH stream", () => {
            component.reloadable = true;
            spyOn((<any>component).eventBus.getStream(REFRESH), "next");
            component.onReloadData();
            expect((<any>component).eventBus.getStream(REFRESH).next).toHaveBeenCalled();
        });

        it("should throw an error if widget is not reloadable", () => {
            component.reloadable = false;
            spyOn((<any>component).eventBus.getStream(REFRESH), "next");
            expect(() => {
                component.onReloadData();
            }).toThrow();
            expect((<any>component).eventBus.getStream(REFRESH).next).not.toHaveBeenCalled();
        });
    });
});
