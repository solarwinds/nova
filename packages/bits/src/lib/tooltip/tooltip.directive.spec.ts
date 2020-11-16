import { OverlayModule } from "@angular/cdk/overlay";
import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { NuiButtonModule } from "../button/button.module";

import { TooltipPosition } from "./public-api";
import { TooltipDirective } from "./tooltip.directive";
import { NuiTooltipModule } from "./tooltip.module";

@Component({
    selector: "nui-tooltip-unit",
    template: `
    <span [nuiTooltip]="tooltipValue" [nuiTooltipDisabled]="isDisabled">Tooltip</span>`,
})

class TooltipTestComponent {
    public tooltipValue ? = "test tooltip";
    public isDisabled = false;
}

@Component({
    selector: "nui-tooltip-unit",
    template: `
    <span [nuiTooltip]="tooltipValue" [nuiTooltipDisabled]="isDisabled" [tooltipPlacement]="position">Tooltip</span>`,
})

class TooltipWithPositionTestComponent {
    public tooltipValue = "test tooltip";
    public isDisabled = false;
    public position: TooltipPosition = "top";
}

@Component({
    selector: "nui-tooltip-unit",
    template: `
    <button nui-button displayStyle="primary" type="button"
        [nuiTooltip]="tooltipValue"
        [nuiTooltipDisabled]="isDisabled"
        [tooltipPlacement]="position">Tooltip</button>`,
})

class TooltipOnButtonTestComponent {
    public tooltipValue = "test tooltip";
    public isDisabled = false;
    public position: TooltipPosition = "top";
}

describe("directives >", () => {
    describe("tooltip >", () => {

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NuiTooltipModule, OverlayModule],
                declarations: [TooltipTestComponent, TooltipWithPositionTestComponent, TooltipOnButtonTestComponent],
            });

            TestBed.compileComponents();
        });

        describe("basic usage >", () => {
            let fixture: ComponentFixture<TooltipTestComponent>;
            let positionFixture: ComponentFixture<TooltipWithPositionTestComponent>;
            let buttonFixture: ComponentFixture<TooltipOnButtonTestComponent>;
            let spanDebugElement, buttonDebugElement: DebugElement;
            let spanElement: HTMLElement;
            let tooltipDirective: TooltipDirective;
            let showSpy, hideSpy: jasmine.Spy;

            beforeEach(() => {
                fixture = TestBed.createComponent(TooltipTestComponent);
                fixture.detectChanges();
                spanDebugElement = fixture.debugElement.query(By.css("span"));
                spanElement = <HTMLElement>spanDebugElement.nativeElement;
                tooltipDirective = spanDebugElement.injector.get<TooltipDirective>(TooltipDirective);
            });

            afterEach(() => {
                fixture.destroy();
            });

            it("should instantiate directive", () => {
                expect(tooltipDirective).toBeDefined();
            });

            it("should be invisible by default", () => {
                expect(tooltipDirective._isTooltipVisible()).toBeFalsy();
            });

            it("should not create instance of tooltip by default", () => {
                expect(tooltipDirective._tooltipInstance).not.toBeDefined();
            });

            it("should have correct tooltip value in directive", () => {
                expect(fixture.componentInstance.tooltipValue).toEqual(tooltipDirective.message);
            });

            it("should open on mouseenter mouse event", fakeAsync(() => {
                spanElement.dispatchEvent(new Event("mouseenter"));
                fixture.detectChanges();
                tick();
                expect(tooltipDirective._isTooltipVisible()).toBeTruthy();
            }));

            it("should close on mouseleave mouse event", fakeAsync(() => {
                tooltipDirective.show();
                fixture.detectChanges();
                tick();
                spanElement.dispatchEvent(new Event("mouseleave"));
                tick(200);
                expect(tooltipDirective._isTooltipVisible()).toBeFalsy();
            }));

            describe("show() >", () => {
                beforeEach(fakeAsync(() => {
                    tooltipDirective.show();
                    fixture.detectChanges();
                    tick();
                }));

                it("should show() be called once", () => {
                    showSpy = spyOn(tooltipDirective, "show");
                    tooltipDirective.show();
                    fixture.detectChanges();
                    expect(showSpy).toHaveBeenCalled();
                    expect(showSpy).toHaveBeenCalledTimes(1);
                });

                it("should tooltip be visible", () => {
                    expect(tooltipDirective._isTooltipVisible()).toBeTruthy();
                });

                it("should close tooltip on toggle", fakeAsync(() => {
                    tooltipDirective.toggle();
                    tick(200);
                    expect(tooltipDirective._isTooltipVisible()).toBeFalsy();
                }));

                it("should create an instance of tooltip", () => {
                    expect(tooltipDirective._tooltipInstance).toBeDefined();
                });

                it("should tooltip contain tooltip text", () => {
                    const expectedText = document.querySelector(".nui-tooltip-body")?.textContent;
                    if (!expectedText) {
                        throw new Error("ExpectedText was not found");
                    }
                    expect(fixture.componentInstance.tooltipValue).toEqual(expectedText?.trim());
                });

                it("should stay open on show() call when opened", fakeAsync(() => {
                    tooltipDirective.show();
                    tick();
                    expect(tooltipDirective._isTooltipVisible).toBeTruthy();
                }));
            });

            describe("hide() >", () => {
                it("should close on hide() call", fakeAsync(() => {
                    tooltipDirective.show();
                    fixture.detectChanges();
                    tick();
                    tooltipDirective.hide();
                    fixture.detectChanges();
                    tick(200);
                    expect(tooltipDirective._isTooltipVisible()).toBeFalsy();
                }));

                it("should open on toggle", fakeAsync(() => {
                    tooltipDirective.toggle();
                    fixture.detectChanges();
                    tick();
                    expect(tooltipDirective._isTooltipVisible()).toBeTruthy();
                }));

                it("should call hide() if disabled", () => {
                    hideSpy = spyOn(tooltipDirective, "hide");
                    fixture.componentInstance.isDisabled = true;
                    fixture.detectChanges();
                    expect(hideSpy).toHaveBeenCalled();
                    expect(hideSpy).toHaveBeenCalledTimes(1);
                });

                it("should convert to string and return empty string on negative values", () => {
                    const values = <any>[null, undefined];
                    for (const value of values) {
                        fixture.componentInstance.tooltipValue = value;
                        fixture.detectChanges();
                        expect(typeof (tooltipDirective.message)).toBe("string");
                        expect(tooltipDirective.message).toEqual("");
                    }
                });

                it("should convert numbers to string and return string", () => {
                    const values = <any>[0, 123456789, NaN];
                    for (const value of values) {
                        fixture.componentInstance.tooltipValue = value;
                        fixture.detectChanges();
                        expect(typeof (tooltipDirective.message)).toBe("string");
                        expect(tooltipDirective.message).toEqual(`${value}`);
                    }
                });

                it("should call hide() if opened and then !message", fakeAsync(() => {
                    tooltipDirective.show();
                    fixture.detectChanges();
                    tick();
                    expect(tooltipDirective._tooltipInstance?.isVisible()).toBeTruthy();
                    fixture.componentInstance.tooltipValue = undefined;
                    fixture.detectChanges();
                    tick(200);

                    expect(tooltipDirective._tooltipInstance?.isVisible()).toBeFalsy();
                }));

            });

            describe("position >", () => {
                beforeEach(() => {
                    TestBed.resetTestingModule()
                        .configureTestingModule({
                            imports: [NuiTooltipModule, OverlayModule],
                            declarations: [TooltipTestComponent, TooltipWithPositionTestComponent, TooltipOnButtonTestComponent],
                        }).compileComponents();
                    positionFixture = TestBed.createComponent(TooltipWithPositionTestComponent);
                    positionFixture.detectChanges();
                    tooltipDirective = positionFixture.debugElement.query(By.css("span")).injector.get(TooltipDirective);
                });

                it("should be positioned to the top by default", fakeAsync(() => {
                    tooltipDirective.show();
                    positionFixture.detectChanges();
                    tick();
                    expect(tooltipDirective.position).toEqual("top");
                }));

                it("should be able to set position", fakeAsync(() => {
                    positionFixture.componentInstance.position = "bottom";
                    positionFixture.detectChanges();
                    tick();
                    tooltipDirective.show();
                    positionFixture.detectChanges();
                    tick();
                    expect(tooltipDirective.position).toEqual("bottom");
                }));

            });
            describe("with button >", () => {
                beforeEach(() => {
                    TestBed.resetTestingModule()
                        .configureTestingModule({
                            imports: [NuiTooltipModule, OverlayModule, NuiButtonModule],
                            declarations: [TooltipTestComponent, TooltipWithPositionTestComponent, TooltipOnButtonTestComponent],
                        }).compileComponents();
                    buttonFixture = TestBed.createComponent(TooltipOnButtonTestComponent);
                    buttonFixture.detectChanges();
                    buttonDebugElement = buttonFixture.debugElement.query(By.css("button"));
                    tooltipDirective = buttonDebugElement.injector.get(TooltipDirective);
                });

                it("should not be displayed on click event", fakeAsync(() => {
                    expect(tooltipDirective._isTooltipVisible()).toBeFalsy();
                    buttonDebugElement.nativeElement.dispatchEvent(new Event("click"));
                    tick();
                    buttonFixture.detectChanges();
                    expect(tooltipDirective._isTooltipVisible()).toBeFalsy();
                }));

                it("should be displayed on mouseenter and hidden on mouseleave events", fakeAsync(() => {
                    buttonDebugElement.nativeElement.dispatchEvent(new Event("mouseenter"));
                    buttonFixture.detectChanges();
                    tick();
                    expect(tooltipDirective._isTooltipVisible()).toBeTruthy();

                    buttonDebugElement.nativeElement.dispatchEvent(new Event("mouseleave"));
                    buttonFixture.detectChanges();
                    tick(200);
                    expect(tooltipDirective._isTooltipVisible()).toBeFalsy();
                }));
            });
        });
    });
});
