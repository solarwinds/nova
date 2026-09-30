// © 2026 SolarWinds Worldwide, LLC. All rights reserved.
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

import {
    AfterViewInit,
    Directive,
    ElementRef,
    inject,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    Renderer2,
} from "@angular/core";

/**
 * Puts the host into the tab sequence as a labelled region while its content overflows,
 * so it can be scrolled by keyboard even without focusable descendants (WCAG 2.1.1, ACT rule 0ssw9k).
 */
@Directive({
    selector: "[nuiFocusableScrollRegion]",
    standalone: false,
})
export class FocusableScrollRegionDirective
    implements AfterViewInit, OnChanges, OnDestroy
{
    /** Space-separated ids of the elements labelling the region */
    @Input("nuiFocusableScrollRegion") public labelledBy: string;

    private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
    private readonly renderer = inject(Renderer2);
    private readonly zone = inject(NgZone);
    private resizeObserver?: ResizeObserver;

    public ngAfterViewInit(): void {
        const host = this.elementRef.nativeElement;

        this.zone.runOutsideAngular(() => {
            this.resizeObserver = new ResizeObserver(() => this.update());
            // Children are observed too: their size (e.g. a virtual scroll spacer) drives the scroll size.
            [host, ...Array.from(host.children)].forEach(el =>
                this.resizeObserver?.observe(el)
            );
        });
        this.update();
    }

    public ngOnChanges(): void {
        if (this.resizeObserver) {
            this.update();
        }
    }

    public ngOnDestroy(): void {
        this.resizeObserver?.disconnect();
    }

    private update(): void {
        const host = this.elementRef.nativeElement;
        // Scroll size is measured even while overflow is hidden, because the host enables scrolling once focused.
        const overflows =
            host.scrollWidth > host.clientWidth ||
            host.scrollHeight > host.clientHeight;

        if (overflows) {
            this.renderer.setAttribute(host, "tabindex", "0");
            this.renderer.setAttribute(host, "role", "region");
            if (this.labelledBy) {
                this.renderer.setAttribute(
                    host,
                    "aria-labelledby",
                    this.labelledBy
                );
            } else {
                this.renderer.removeAttribute(host, "aria-labelledby");
            }
        } else {
            this.renderer.removeAttribute(host, "tabindex");
            this.renderer.removeAttribute(host, "role");
            this.renderer.removeAttribute(host, "aria-labelledby");
        }
    }
}
