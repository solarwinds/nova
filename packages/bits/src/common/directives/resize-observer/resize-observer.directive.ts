import {
    AfterViewInit,
    Directive,
    ElementRef,
    EventEmitter,
    NgZone,
    OnDestroy,
    Output,
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

    @Output()
    public containerResize = new EventEmitter();
    public resizeHandler: Function;
    private _debounceTime = RESIZE_DEBOUNCE_TIME;
    private resizeObserver?: ResizeObserver;

    constructor (private _element: ElementRef,
                 private ngZone: NgZone) {}

    public set debounceTime(debounceTime: number) {
        this._debounceTime = debounceTime;
    }

    public ngAfterViewInit(): void {
        this.resizeHandler = debounce(entry => this.containerResize.emit(entry), this._debounceTime);
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

    ngOnDestroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.unobserve(<Element>(this._element.nativeElement));
        }
    }
}
