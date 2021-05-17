import { Overlay } from "@angular/cdk/overlay";
import { AfterViewInit, Component, ElementRef, Input, NO_ERRORS_SCHEMA, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import set from "lodash/set";
import { first } from "rxjs/operators";

import { EventBusService } from "../../../services/event-bus.service";
import { NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "../../select-v2/constants";
import { SelectV2OptionComponent } from "../../select-v2/option/select-v2-option.component";
import { NuiOverlayModule } from "../overlay.module";

import { OverlayComponent } from "./overlay.component";

@Component({
    template: `
        <nui-overlay [toggleReference]="elRef.nativeElement" *ngIf="!destroyed">
            <nui-select-v2-option *ngFor="let item of items" [value]="item">
                <span class="mr-3">{{ item }}</span>
            </nui-select-v2-option>
        </nui-overlay>
    `,
})
class PopupWrapperComponent implements AfterViewInit {
    public items = Array.from({ length : 50 }).map((_, i) => `Item ${i}`);
    public selectedOptions = this.items[0];
    @Input() destroyed: boolean = false;

    @ViewChild(OverlayComponent) dropdown: OverlayComponent;

    constructor(public elRef: ElementRef) { }

    ngAfterViewInit() { }
}

describe("components >", () => {
    describe("OverlayComponent", () => {
        let component: OverlayComponent;
        let wrapperComponent: PopupWrapperComponent;
        let fixture: ComponentFixture<OverlayComponent>;
        let wrapperFixture: ComponentFixture<PopupWrapperComponent>;

        beforeEach(waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [
                    PopupWrapperComponent,
                    OverlayComponent,
                    SelectV2OptionComponent,
                ],
                imports: [NuiOverlayModule],
                providers: [
                    Overlay,
                    EventBusService,
                    {
                        provide: NUI_SELECT_V2_OPTION_PARENT_COMPONENT,
                        useClass: PopupWrapperComponent,
                    },
                ],
                schemas: [ NO_ERRORS_SCHEMA ],
            })
                .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(OverlayComponent);
            component = fixture.componentInstance;
            component.toggleReference = document.createElement("div");
            fixture.detectChanges();

            wrapperFixture = TestBed.createComponent(PopupWrapperComponent);
            wrapperComponent = wrapperFixture.componentInstance;
            wrapperFixture.detectChanges();
        });

        afterEach(() => {
            wrapperComponent.dropdown.hide();
            wrapperFixture.destroy();
            component.hide();
            fixture.destroy();
        });

        it("should create", () => {
            expect(component).toBeTruthy();
            expect(wrapperComponent).toBeTruthy();
        });

        describe("ngAfterContentChecked()", () => {
            it("dropdown content should be empty", () => {
                component.empty$.subscribe((isEmpty) => {
                    expect(isEmpty).toBe(true);
                });
                component.ngAfterContentChecked();
            });

            it("dropdown content should not be empty", () => {
                wrapperComponent.dropdown.empty$.subscribe((isEmpty) => {
                    expect(isEmpty).toBe(false);
                });
                component.ngAfterContentChecked();
            });
        });

        describe("show()", () => {
            it("should show dropdown", async () => {
                wrapperComponent.dropdown.show();

                expect(wrapperComponent.dropdown.getOverlayRef()).toBeTruthy();
                expect(wrapperComponent.dropdown.showing).toBe(true);
                const isEmpty = await wrapperComponent.dropdown.empty$.pipe(first()).toPromise();
                expect(isEmpty).toBe(false);
            });

            it("should set default config", () => {
                wrapperComponent.dropdown.show();
                expect(wrapperComponent.dropdown.getOverlayRef().getConfig()).toBeTruthy();
            });

            it("should extend overlay config by user", () => {
                wrapperComponent.dropdown.overlayConfig = {hasBackdrop: true, backdropClass: "mock-class", width: "300px"};
                wrapperComponent.dropdown.show();

                const config = wrapperComponent.dropdown.getOverlayRef().getConfig();
                expect(config.hasBackdrop).toBe(true);
                expect(config.backdropClass).toBe("mock-class");
                expect(config.width).toBe("300px");
            });
        });

        describe("hide()", () => {
            it("should hide dropdown", () => {
                wrapperComponent.dropdown.show();
                wrapperComponent.dropdown.hide();

                expect(wrapperComponent.dropdown.getOverlayRef().overlayElement).toBeFalsy();
                expect(wrapperComponent.dropdown.showing).toBe(false);
                wrapperComponent.dropdown.clickOutside.subscribe((e: MouseEvent) => expect(e).toBeTruthy());
            });
        });

        describe("toggle()", () => {
            it("should show dropdown", () => {
                set(wrapperComponent.dropdown, "showing", false);
                wrapperComponent.dropdown.toggle();

                expect(wrapperComponent.dropdown.showing).toBe(true);
            });

            it("should hide dropdown", () => {
                wrapperComponent.dropdown.show();
                wrapperComponent.dropdown.toggle();

                expect(wrapperComponent.dropdown.showing).toBe(false);
            });
        });

        describe("clickOutside", () => {
            it("should next and complete hide$", () => {
                const spy = jasmine.createSpy();

                wrapperComponent.dropdown.clickOutside.subscribe(() => spy());
                wrapperComponent.dropdown.show();
                document.body.click();
                wrapperFixture.detectChanges();

                expect(spy).toHaveBeenCalled();
            });
        });
    });
});

