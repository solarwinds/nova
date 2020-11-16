import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    NgZone,
    OnDestroy,
    Output
} from "@angular/core";
import debounce from "lodash/debounce";
import ResizeObserver from "resize-observer-polyfill";

import { RESIZE_DEBOUNCE_TIME } from "../../../constants/index";

/**
 * @ignore
 */
@Directive({
    selector: "[nuiResizeObserver]",
})
export class ResizeObserverDirective implements OnDestroy, AfterViewInit {
    private resizeObserver?: ResizeObserver;

    @Output()
    public containerResize = new EventEmitter();
    public resizeHandler: Function;

    constructor (private _element: ElementRef,
                 private ngZone: NgZone) {}

    public ngAfterViewInit() {
        this.resizeHandler = debounce(entry => this.containerResize.emit(entry), RESIZE_DEBOUNCE_TIME);
        this.resizeObserver = new ResizeObserver(entries => {
            entries.forEach((entry: ResizeObserverEntry) => {
                this.ngZone.run(() => {
                    this.resizeHandler(entry);
                });
            });
        });
        this.ngZone.runOutsideAngular(() => {
            this.resizeObserver?.observe(<Element>(this._element.nativeElement));
        });
    }

    ngOnDestroy() {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(<Element>(this._element.nativeElement));
        }
    }
}
