import { AnimationEvent } from "@angular/animations";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    TemplateRef,
} from "@angular/core";
import _isBoolean from "lodash/isBoolean";
import { Subject, Subscription } from "rxjs";
import { take } from "rxjs/operators";

import { fadeIn } from "../../animations/fadeIn";

import { IPopoverModalContext } from "./popover-modal.service";
import { PopoverPlacement } from "./public-api";

/**
 * @ignore
 */
export type PopoverModalEvents =
    | "mouse-enter"
    | "mouse-leave"
    | "backdrop-click"
    | "outside-click";

/**
 * @ignore
 */
@Component({
    selector: "nui-popover-modal",
    templateUrl: "./popover-modal.component.html",
    animations: [fadeIn],
    host: { role: "dialog" },
})
export class PopoverModalComponent implements AfterViewInit, OnInit, OnDestroy {
    /**
     * Is backdrop used
     */
    @Input() backdrop: boolean;

    /**
     * Defines settings for popover
     */
    @Input() context: IPopoverModalContext;

    /**
     * Defines popover content
     */
    @Input() template: TemplateRef<string>;

    /**
     * Updates fadeIn property
     */
    @Input() displayChange: Subject<boolean>;

    /**
     * Popover hostElement
     */
    @Input() hostElement: any;

    /**
     * Defines if container has padding.
     */
    @Input() hasPadding: boolean;

    /**
     * Specifies whether the default width and height constraints are in effect for the popover
     */
    @Input() unlimited: boolean;

    public placement: PopoverPlacement = "right";
    public fadeIn = false;
    public popoverBeforeHiddenSubject: Subject<void>;
    public popoverAfterHiddenSubject: Subject<void>;
    public popoverModalEventSubject: Subject<PopoverModalEvents>;

    private popoverModalSubscriptions: Subscription[] = [];

    @HostListener("click", ["$event"])
    onClick(event: MouseEvent) {
        event.stopPropagation();
    }

    @HostListener("mouseenter")
    onMouseEnter() {
        this.popoverModalEventSubject.next("mouse-enter");
    }

    @HostListener("mouseleave")
    onMouseLeave() {
        this.popoverModalEventSubject.next("mouse-leave");
    }

    constructor(
        public elRef: ElementRef,
        private zone: NgZone,
        private cdRef: ChangeDetectorRef
    ) {}

    ngOnInit() {
        const displayChangeSubscription = this.displayChange.subscribe(
            (show: boolean) => {
                if (!show) {
                    this.popoverBeforeHiddenSubject.next();
                    this.fadeIn = false;
                    this.cdRef.markForCheck();
                }
            }
        );

        this.popoverModalSubscriptions.push(displayChangeSubscription);
    }

    ngAfterViewInit() {
        // To prevent from exception 'expression was changed after check'
        const zoneSubscription = this.zone.onStable
            .asObservable()
            .pipe(take(1))
            .subscribe(() => {
                // To be sure, that change detection mechanism was invoked and placement was updated
                this.zone.run(() => (this.fadeIn = true));
            });
        this.popoverModalSubscriptions.push(zoneSubscription);
    }

    public onAnimationEnd(event: AnimationEvent) {
        if (_isBoolean(event.fromState) && event.fromState) {
            this.popoverAfterHiddenSubject.next();
        }
    }

    ngOnDestroy() {
        this.popoverModalSubscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }
}
