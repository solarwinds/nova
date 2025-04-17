// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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

import { IPopoverModalContext } from "./popover-modal.service";
import { PopoverPlacement } from "./public-api";
import { fadeIn } from "../../animations/fadeIn";

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
    standalone: false
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
    onClick(event: MouseEvent): void {
        event.stopPropagation();
    }

    @HostListener("mouseenter")
    onMouseEnter(): void {
        this.popoverModalEventSubject.next("mouse-enter");
    }

    @HostListener("mouseleave")
    onMouseLeave(): void {
        this.popoverModalEventSubject.next("mouse-leave");
    }

    constructor(
        public elRef: ElementRef,
        private zone: NgZone,
        private cdRef: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
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

    public ngAfterViewInit(): void {
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

    public onAnimationEnd(event: AnimationEvent): void {
        if (_isBoolean(event.fromState) && event.fromState) {
            this.popoverAfterHiddenSubject.next();
        }
    }

    public ngOnDestroy(): void {
        this.popoverModalSubscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }
}
