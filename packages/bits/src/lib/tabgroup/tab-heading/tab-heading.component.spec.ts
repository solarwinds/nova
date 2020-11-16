import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TabHeadingComponent } from "./tab-heading.component";

describe("components >", () => {
    describe("tab heading >", () => {
        let componentFixture: ComponentFixture<TabHeadingComponent>;
        let subject: TabHeadingComponent;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [
                    TabHeadingComponent,
                ],
            });
            componentFixture = TestBed.createComponent(TabHeadingComponent);
            subject = componentFixture.componentInstance;
        });

        it("should prove the component instance is created", () => {
            expect(subject).toBeTruthy();
        });

        it("should emit event on calling selectTab()", () => {
            spyOn(subject.selected, "emit");
            subject.selectTab();
            expect(subject.selected.emit).toHaveBeenCalled();
        });
    });
});
