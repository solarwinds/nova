import { Directive, HostListener, Input } from "@angular/core";
import { Subject } from "rxjs";

@Directive({
    selector: "[nuiDelayedMousePresenceDetection]",
})
export class DelayedMousePresenceDetectionDirective {
    // tslint:disable-next-line:no-input-rename
    @Input("nuiDelayedMousePresenceDetection") public enabled: boolean = true;
    @Input() mousePresentSubject: Subject<boolean>;
    @Input() delay: number = 500;

    private timeout: NodeJS.Timeout;

    @HostListener("mouseenter") onHostMouseenter() {
        if (!this.enabled) {
            return;
        }
        this.timeout = setTimeout(() => {
            this.mousePresentSubject.next(true);
        }, this.delay);
    }

    @HostListener("click") onHostClick() {
        if (!this.enabled) {
            return;
        }
        this.mousePresentSubject.next(true);
    }

    @HostListener("mouseleave") onHostMouseleave() {
        if (!this.enabled) {
            return;
        }
        clearTimeout(this.timeout);

        this.mousePresentSubject.next(false);
    }
}
