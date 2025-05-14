import { Component, DebugElement, ViewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { ClickFilterDirective } from "./click-filter.directive";
import { isTargetAnAnchor, makePredicate } from "./public-api";

@Component({
    template: `<div id="parent">
        <div id="target" nuiClickFilter>
            <a id="link" href="javascript:0">Link</a>
            <span id="span">Span</span>
        </div>
    </div>`,
    standalone: false,
})
class TestComponent {
    @ViewChild(ClickFilterDirective, { static: true })
    public cancelBubbleDirective!: ClickFilterDirective;
}

describe(ClickFilterDirective.name, () => {
    let fixture: ComponentFixture<TestComponent>;
    let cancelBubble: ClickFilterDirective;
    let spyPassed: jasmine.Spy;
    let spyCancelled: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ClickFilterDirective, TestComponent],
        });
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        await fixture.whenStable();
        cancelBubble = fixture.componentInstance.cancelBubbleDirective;
        spyPassed = spyOn(cancelBubble.passed$, "emit");
        spyCancelled = spyOn(cancelBubble.canceled$, "emit");
    });

    const triggerClick = (debugElement: DebugElement): void => {
        const target = debugElement.nativeElement as HTMLElement;
        target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    };

    const formatFilter = (pass: boolean): string => (pass ? "pass" : "filter");

    const expectCall = async (pass: boolean) => {
        await fixture.whenStable();
        pass
            ? expect(spyPassed).toHaveBeenCalled()
            : expect(spyCancelled).toHaveBeenCalled();
    };

    const testTarget = (pass: boolean) =>
        it(`should ${formatFilter(pass)} target events`, async () => {
            triggerClick(fixture.debugElement.query(By.css("#target")));
            await expectCall(pass);
        });

    const testChildLink = (pass: boolean) =>
        it(`should ${formatFilter(pass)} child link events`, () => {
            triggerClick(fixture.debugElement.query(By.css("#link")));
            expectCall(pass);
        });

    const testChildSpan = (pass: boolean) =>
        it(`should ${formatFilter(pass)} child span events`, () => {
            triggerClick(fixture.debugElement.query(By.css("#span")));
            expectCall(pass);
        });

    describe("when set to filter events targetted on anchors", () => {
        beforeEach(() => {
            cancelBubble.cancelBubble = isTargetAnAnchor;
            cancelBubble.preventDefault = isTargetAnAnchor;
        });
        testTarget(true);
        testChildLink(false);
        testChildSpan(true);
    });

    describe("when set to filter all events", () => {
        beforeEach(() => {
            cancelBubble.cancelBubble = makePredicate(true);
            cancelBubble.preventDefault = makePredicate(true);
        });
        testTarget(false);
        testChildLink(false);
        testChildSpan(false);
    });
});
