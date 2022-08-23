import { Directive, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import find from "lodash/find";
import isNil from "lodash/isNil";
import { Subscription } from "rxjs";

import { IHighlightArgs, SwitchState } from "../../services/notification-args";
import { NotificationService } from "../../services/notification-service";

/**
 * <example-url>./../examples/index.html#/toast</example-url>
 */
/** @ignore */
@Directive({
    selector: "[nuiToast]",
})
/**
 * __Name :__
 * Toast Directive
 *
 * __Description :__
 * Is used for highlighting elements
 */
export class ToastDirective implements OnInit, OnDestroy {
    /**
     * sets model for directive to check whether corresponding element should be highlighted or not
     */
    @Input() public nuiToast: any;

    private notificationSubscription: Subscription;
    private get highlightOnClass() {
        return "highlight-on";
    }
    private get highlightFadeOutClass() {
        return "highlight-fadeout";
    }
    private isHighlighted: boolean;
    private status: string;

    constructor(
        private elRef: ElementRef,
        private notificationService: NotificationService
    ) {}

    ngOnInit() {
        this.notificationSubscription = this.notificationService.subscribe(
            "Highlight",
            this.onHighlight
        );
    }

    private onHighlight = (args: any): void => {
        if (!this.elRef) {
            return;
        }
        const highlightArgs = <IHighlightArgs>args;

        const currentItem = find(
            highlightArgs.items,
            (item) =>
                item[highlightArgs.itemIdentificator] ===
                this.nuiToast[highlightArgs.itemIdentificator]
        );
        if (!isNil(currentItem)) {
            if (highlightArgs.highlightState === SwitchState.on) {
                if (this.isHighlighted) {
                    return;
                }
                this.isHighlighted = true;
                this.status = highlightArgs.status;
                this.elRef.nativeElement.classList.add(this.highlightOnClass);
                this.elRef.nativeElement.classList.add(this.status);
            } else if (this.isHighlighted) {
                this.elRef.nativeElement.classList.remove(
                    this.highlightOnClass
                );
                this.elRef.nativeElement.classList.remove(this.status);
                this.elRef.nativeElement.classList.add(
                    this.highlightFadeOutClass
                );
                this.isHighlighted = false;
            }
        }
    };

    ngOnDestroy() {
        this.notificationSubscription.unsubscribe();
    }
}
