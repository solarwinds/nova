import {ComponentFixture, TestBed} from "@angular/core/testing";

import {ToolbarItemType} from "./public-api";
import {ToolbarItemComponent} from "./toolbar-item.component";

describe("components >", () => {
    describe("toolbar-item >", () => {
        let fixture: ComponentFixture<ToolbarItemComponent>;
        let testComponent: ToolbarItemComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    ToolbarItemComponent,
                ],
            });
            fixture = TestBed.createComponent(ToolbarItemComponent);
            fixture.detectChanges();

            testComponent = fixture.componentInstance;
        });

        describe("ngAfterContentInit >", () => {
            it("should set menu to hidden", () => {
                expect(testComponent.menuHidden).toBeFalsy();
                testComponent.type = ToolbarItemType.secondary;
                testComponent.ngAfterContentInit();
                expect(testComponent.menuHidden).toBeTruthy();
            });
            it("should not set menu to hidden", () => {
                expect(testComponent.menuHidden).toBeFalsy();
                testComponent.type = ToolbarItemType.primary;
                testComponent.ngAfterContentInit();
                expect(testComponent.menuHidden).toBeFalsy();
            });
        });
    });
});
