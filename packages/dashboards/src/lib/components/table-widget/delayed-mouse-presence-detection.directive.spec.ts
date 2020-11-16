import { fakeAsync, flush } from "@angular/core/testing";
import { Subject } from "rxjs";

import { DelayedMousePresenceDetectionDirective } from "./delayed-mouse-presence-detection.directive";

describe("TableHideScrollBarDirective", () => {
    let directive: DelayedMousePresenceDetectionDirective;

    beforeEach(() => {
        directive = new DelayedMousePresenceDetectionDirective();
        directive.enabled = true;
        directive.mousePresentSubject = new Subject<boolean>();
    });

    it("should create an instance", () => {
        expect(directive).toBeTruthy();
    });

    it("should return back true on the subject if clicked", () => {
        const nextSpy = spyOn(directive.mousePresentSubject, "next");
        directive.onHostClick();
        expect(nextSpy).toHaveBeenCalledWith(true);
    });

    it("should return back true on the subject onHostMouseenter then false onHostMouseleave", fakeAsync(() => {
        const nextSpy = spyOn(directive.mousePresentSubject, "next");
        directive.onHostMouseenter();
        flush();
        expect(nextSpy).toHaveBeenCalledWith(true);
        directive.onHostMouseleave();
        expect(nextSpy).toHaveBeenCalledWith(false);
    }));
});
