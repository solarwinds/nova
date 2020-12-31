import { SimpleChange, SimpleChanges } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NuiPopoverModule, PopoverComponent } from "@nova-ui/bits";

import { ChartPopoverPlugin } from "../core/plugins/chart-popover-plugin";

import { ChartPopoverComponent } from "./chart-popover.component";

describe("ChartPopoverComponent", () => {
    let component: ChartPopoverComponent;
    let fixture: ComponentFixture<ChartPopoverComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                ChartPopoverComponent,
            ],
            imports: [
                NuiPopoverModule,
            ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartPopoverComponent);
        component = fixture.componentInstance;
        component.plugin = new ChartPopoverPlugin();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("plugin.updatePositionSubject subscription", () => {
        it("should update the host element's position", () => {
            component.plugin.updatePositionSubject.next({ top: 5, left: 5, height: 0, width: 0 });

            expect(component.element.nativeElement.style.top).toEqual("5px");
            expect(component.element.nativeElement.style.left).toEqual("5px");
        });

        it("should invoke popover.updatePosition", () => {
            component.popover = { updatePosition: () => { } } as PopoverComponent;

            const spy = spyOn(component.popover, "updatePosition");
            component.plugin.updatePositionSubject.next({ top: 5, left: 5, height: 0, width: 0 });

            expect(spy).toHaveBeenCalled();
        });

        it("should emit 'update'", () => {
            component.plugin.dataPoints = {
                "series-1": {
                    index: 1,
                    seriesId: "series-1",
                    // @ts-ignore: Disabled for testing purposes
                    dataSeries: null,
                    data: {},
                    position: {
                        x: 100,
                        y: 100,
                        height: 50,
                        width: 50,
                    },
                },
            };

            const spy = spyOn(component.update, "next");
            component.plugin.updatePositionSubject.next({ top: 5, left: 5, height: 0, width: 0 });

            expect(spy).toHaveBeenCalledWith(component.plugin.dataPoints);
        });

        it("should be unsubscribed on component destruction", () => {
            component.popover = { updatePosition: () => { } } as PopoverComponent;

            component.ngOnDestroy();

            const spy = spyOn(component.popover, "updatePosition");
            component.plugin.updatePositionSubject.next({ top: 5, left: 5, height: 0, width: 0 });

            expect(spy).not.toHaveBeenCalled();
        });

        it("should be unsubscribed when the plugin changes", () => {
            component.popover = { updatePosition: () => { } } as PopoverComponent;
            const oldPopoverPlugin = component.plugin;

            component.plugin = new ChartPopoverPlugin();
            component.ngOnChanges({ plugin: { isFirstChange: () => false } as SimpleChange } as SimpleChanges);

            const spy = spyOn(component.popover, "updatePosition");
            oldPopoverPlugin.updatePositionSubject.next({ top: 5, left: 5, height: 0, width: 0 });

            expect(spy).not.toHaveBeenCalled();
        });
    });

});
