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
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    ViewEncapsulation,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter, take } from "rxjs/operators";

const FOCUSABLE_SELECTOR =
    "a, button, input, textarea, select, details, [tabindex]:not([tabindex='-1'])";

/*
 * <example-url>./../examples/index.html#/dialog</example-url><br />
 *
 * @dynamic
 */
@Component({
    selector: "nui-dialog-window",
    host: {
        "[class]": `"nui-dialog fade in show" + (windowClass ? " " + windowClass : "")`,
        role: "dialog",
        "aria-modal": "true",
        tabindex: "-1",
        "[attr.aria-label]": "ariaLabel || null",
        "[attr.aria-labelledby]": "ariaLabelledby || null",
        "[attr.aria-describedby]": "ariaDescribedby || null",
        "(keyup.esc)": "escKey($event)",
        "(mousedown)": "backdropMouseDown($event)",
        "(mouseup)": "backdropMouseUp($event)",
    },
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false,
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
     * Explicit aria-label for screen readers.
     */
    @Input() ariaLabel?: string;

    /**
     * ID of the element that labels the dialog window.
     */
    @Input() ariaLabelledby?: string;

    /**
     * ID of the element that describes the dialog window.
     */
    @Input() ariaDescribedby?: string;

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
        private router: Router
    ) {}

    @HostListener("window:keydown.shift.tab", ["$event"])
    onShiftTab(event: any): void {
        const activeElement = this.document.activeElement;
        // When the focus is inside another overlay (e.g. a nui-overlay rendered
        // on top of this dialog), let that overlay manage its own focus trapping.
        if (this.isFocusInsideForeignOverlay(activeElement)) {
            return;
        }

        if (
            this.elRef.nativeElement === activeElement ||
            !this.elRef.nativeElement.contains(activeElement)
        ) {
            this.handleFocus(event);
        }
    }

    @HostListener("window:keydown.tab", ["$event"])
    onTab(event: any): void {
        const activeElement = this.document.activeElement;
        // When the focus is inside another overlay (e.g. a nui-overlay rendered
        // on top of this dialog), let that overlay manage its own focus trapping.
        if (this.isFocusInsideForeignOverlay(activeElement)) {
            return;
        }

        if (!this.elRef.nativeElement.contains(activeElement)) {
            this.handleFocus(event);
        }
    }

    private isFocusInsideForeignOverlay(
        activeElement: Element | null
    ): boolean {
        if (!activeElement || typeof activeElement.closest !== "function") {
            return false;
        }
        const activeOverlayPane = activeElement.closest(".cdk-overlay-pane");
        const dialogOverlayPane =
            this.elRef.nativeElement.closest(".cdk-overlay-pane");
        return Boolean(
            activeOverlayPane && activeOverlayPane !== dialogOverlayPane
        );
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

    dismiss(reason: any): void {
        this.dismissEvent.emit(reason);
    }

    public ngOnInit(): void {
        this.elWithFocus = this.document.activeElement;
        this.renderer.addClass(this.document.body, "dialog-open");
        this.router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => this.dismiss("ROUTE_CHANGED"));
    }

    public ngAfterViewInit(): void {
        if (!this.elRef.nativeElement.contains(document.activeElement)) {
            this.elRef.nativeElement["focus"].apply(
                this.elRef.nativeElement,
                []
            );
        }
    }

    public ngOnDestroy(): void {
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
    }

    private handleFocus(event: KeyboardEvent): void {
        event.preventDefault();
        this.elRef.nativeElement.querySelector(FOCUSABLE_SELECTOR).focus();
    }
}
