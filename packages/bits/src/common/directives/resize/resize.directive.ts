import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output } from "@angular/core";
import filter from "lodash/filter";
import forEach from "lodash/forEach";

/** @ignore */
interface IResizeEventQueue {
    events: any[];
    add(event: Function): void;
    call(): void;
    remove(event: Function): void;
}
/** @ignore */
interface IResizeElement extends HTMLElement {
    resizedAttached?: IResizeEventQueue;
    resizeSensor?: any;
}

/**
 * Directive that provides resize event for any element
 *
 * __Usage:__
 *
 * In parent components use this to subscribe to resize event:
 *
 *       `@ViewChild(ResizeDirective) child: ResizeDirective;
 *
 *       public checkResize = () => {
 *
 *       this.child.elementResize.subscribe((event: any) => console.log("change", event));
 *
 *       };`
 *
 * To remove resize event handler:
 *
 *       `@ViewChild(ResizeDirective) child: ResizeDirective;
 *
 *        this.child.removeResize()`
 *
 */
/**
 * <example-url>./../examples/index.html#/resize</example-url>
 */
/**
 * @ignore
 */
@Directive({
    selector: "[nuiResize]",
})
export class ResizeDirective implements AfterViewInit, OnDestroy {
    /**
     * Event to be triggered on element resize
     */
    @Output() public elementResize = new EventEmitter<boolean>();

    /**
     * Class for dimension change detection
     * Using nested private class to prevent external class instantiation.
     */
    private resizeEventQueue = class implements IResizeEventQueue {
        public events: any[] = [];

        public add(event: Function) {
            this.events.push(event);
        }

        public call() {
            forEach(this.events, event => event.call());
        }

        public remove(event: Function) {
            this.events = filter(this.events, (item: Function) => item !== event);
        }
    };

    constructor(private element: ElementRef) {}

    public ngAfterViewInit(): void {
        this.attachResizeEvent(this.element.nativeElement, this.resizeEmit);
    }

    public ngOnDestroy(): void {
        this.elementResize.unsubscribe();
        this.removeResize();
    }

    /**
     * Removes resize listener from the element for public use. We could stop resize event
     * listener by using this method in parent through @ViewChild
     */
    public removeResize(): void {
        this.detachResizeEvent(this.element.nativeElement, this.resizeEmit);
    }

    /**
     * Emits resize event
     */
    private resizeEmit = (): void => {
        this.elementResize.emit(true);
    }

    /**
     * Add resize event which will be done by default
     */
    private attachResizeEvent(targetElement: IResizeElement, resizeCallback: Function): void {
        if (targetElement.resizedAttached) {
            targetElement.resizedAttached.add(resizeCallback);
            return;
        }

        targetElement.resizedAttached = new this.resizeEventQueue();
        targetElement.resizedAttached.add(resizeCallback);

        // This elements is hidden and helping to trigger scroll event when user resize element with nuiResize.
        targetElement.resizeSensor = document.createElement("div");
        targetElement.resizeSensor.className = "resize-sensor";
        const style = "position: absolute; left: 0; top: 0; right: 0; " +
            "bottom: 0; overflow: hidden; z-index: -1; visibility: hidden;";
        const styleChild = "position: absolute; left: 0; top: 0; transition: 0s;";

        targetElement.resizeSensor.style.cssText = style;
        targetElement.resizeSensor.innerHTML =
            `<div class="resize-sensor-expand" style="${style}">
                <div style="${styleChild}"></div>
              </div>
              <div class="resize-sensor-shrink" style="${style}">
                <div style="${styleChild} width: 200%; height: 200%"></div>
              </div>`;

        targetElement.appendChild(targetElement.resizeSensor);

        if (targetElement.resizeSensor.offsetParent !== targetElement) {
            targetElement.style.position = "relative";
        }

        const expand = targetElement.resizeSensor.childNodes[0];
        const expandChild = expand.childNodes[1];
        const shrink = targetElement.resizeSensor.childNodes[2];
        let lastWidth = targetElement.offsetWidth;
        let lastHeight = targetElement.offsetHeight;
        let dirty: boolean;
        let rafId: number;
        let newWidth: number;
        let newHeight: number;

        function reset(): void {
            expandChild.style.width = "100000px";
            expandChild.style.height = "100000px";

            expand.scrollLeft = 100000;
            expand.scrollTop = 100000;

            shrink.scrollLeft = 100000;
            shrink.scrollTop = 100000;
        }

        reset();

        function onResized(): void {
            rafId = 0;

            if (!dirty) {
                return;
            }

            lastWidth = newWidth;
            lastHeight = newHeight;

            if (targetElement.resizedAttached) {
                targetElement.resizedAttached.call();
            }
        }

        function onScroll(): void {
            newWidth = targetElement.offsetWidth;
            newHeight = targetElement.offsetHeight;
            dirty = newWidth !== lastWidth || newHeight !== lastHeight;

            if (dirty && !rafId) {
                rafId = requestAnimationFrame(onResized);
            }

            reset();
        }

        function addEvent(element: IResizeElement, event: string, callback: EventListener): void {
            element.addEventListener(event, callback);
        }

        addEvent(expand, "scroll", onScroll);
        addEvent(shrink, "scroll", onScroll);
    }

    /**
     * Removing resize listener from target element
     */
    private detachResizeEvent = (targetElement: IResizeElement, event: Function) => {
        if (targetElement.resizedAttached && typeof event === "function") {
            targetElement.resizedAttached.remove(event);
        }
        if (targetElement.contains(targetElement.resizeSensor)) {
            targetElement.removeChild(targetElement.resizeSensor);
        }

        delete targetElement.resizeSensor;
        delete targetElement.resizedAttached;
    }
}
