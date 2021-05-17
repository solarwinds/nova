import { CdkScrollable, ScrollDispatcher } from "@angular/cdk/scrolling";
import { DOCUMENT } from "@angular/common";
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Inject,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    ViewEncapsulation,
} from "@angular/core";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";

const FOCUSABLE_SELECTOR = "a, button, input, textarea, select, details, [tabindex]:not([tabindex='-1'])";

/*
 * <example-url>./../examples/index.html#/dialog</example-url><br />
 *
 * @dynamic
 */
@Component({
    selector: "nui-dialog-window",
    host: {
        "[class]": "\"nui-dialog fade in show\" + (windowClass ? \" \" + windowClass : \"\")",
        "role": "dialog",
        "aria-modal": "true",
        "tabindex": "-1",
        "(keyup.esc)": "escKey($event)",
        "(mousedown)": "backdropMouseDown($event)",
        "(mouseup)": "backdropMouseUp($event)",
    },
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class DialogComponent implements OnInit, AfterViewInit, OnDestroy {
    private elWithFocus: any;
    /**
     * Whether a backdrop element should be created for a given dialog (true by default).
     * Alternatively, specify 'static' for a backdrop which doesn't close the dialog on click.
     */
    @Input() backdrop: boolean | string = true;

    /**
     * Whether to close the dialog when escape key is pressed (true by default).
     */
    @Input() keyboard = true;

    /**
     * Size of a new dialog window.
     */
    @Input() size: string;

    /**
     * Custom class to append to the dialog window
     */
    @Input() windowClass: string;

    /**
     * Event fired on dismiss of the dialog window
     */
    @Output() dismissEvent = new EventEmitter();

    private scrollableElement: CdkScrollable;
    private mouseDownOrigin: MouseEvent;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private elRef: ElementRef,
        private renderer: Renderer2,
        private ngZone: NgZone,
        private scrollDispatcher: ScrollDispatcher,
        private router: Router
    ) {}

    @HostListener("window:keydown.shift.tab", ["$event"])
    onShiftTab(event: KeyboardEvent): void {
        if (this.elRef.nativeElement === this.document.activeElement || !this.elRef.nativeElement.contains(this.document.activeElement)) {
            this.handleFocus(event);
        }
    }

    @HostListener("window:keydown.tab", ["$event"])
    onTab(event: KeyboardEvent): void {
        if (!this.elRef.nativeElement.contains(this.document.activeElement)) {
            this.handleFocus(event);
        }
    }

    backdropMouseDown($event: any): void {
        this.mouseDownOrigin = $event.target;
    }

    backdropMouseUp($event: any): void {
        if (this.backdrop === true) {
            if (this.mouseDownOrigin !== this.elRef.nativeElement) {
                return;
            } else if (this.elRef.nativeElement === $event.target) {
                this.dismiss("BACKDROP_CLICK");
            }
        }
    }

    escKey($event: any): void {
        if (this.keyboard && !$event.defaultPrevented) {
            this.dismiss("ESC");
        }
    }

    dismiss(reason: any): void { this.dismissEvent.emit(reason); }

    ngOnInit() {
        this.elWithFocus = this.document.activeElement;
        this.renderer.addClass(this.document.body, "dialog-open");
        this.scrollableElement = new CdkScrollable(this.elRef, this.scrollDispatcher, this.ngZone);
        this.scrollDispatcher.register(this.scrollableElement);
        this.router.events.pipe(take(1)).subscribe(() => {
            this.dismiss("ROUTE_CHANGED");
        });
    }

    ngAfterViewInit() {
        if (!this.elRef.nativeElement.contains(document.activeElement)) {
            this.elRef.nativeElement["focus"].apply(this.elRef.nativeElement, []);
        }
    }

    ngOnDestroy() {
        const body = this.document.body;
        const elWithFocus = this.elWithFocus;

        let elementToFocus;
        if (elWithFocus && elWithFocus["focus"] && body.contains(elWithFocus)) {
            elementToFocus = elWithFocus;
        } else {
            elementToFocus = body;
        }
        elementToFocus["focus"].apply(elementToFocus, []);

        this.elWithFocus = null;
        this.renderer.removeClass(body, "dialog-open");
        this.scrollDispatcher.deregister(this.scrollableElement);
    }

    private handleFocus(event: KeyboardEvent): void {
        event.preventDefault();
        this.elRef.nativeElement.querySelector(FOCUSABLE_SELECTOR).focus();
    }
}
