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

import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    ViewChild,
} from "@angular/core";

import { ResizerDirective } from "../../../common/directives";
import {
    ResizeDirection,
    resizeDirectionHelpers,
    ResizeUnit,
} from "../../../common/directives/resizer/public-api";
import { EventBusService } from "../../../services/event-bus.service";
import { UtilService } from "../../../services/util.service";

/**
 * @ignore
 */
@Component({
    selector: "nui-layout-resizer",
    templateUrl: "./layout-resizer.component.html",
    styleUrls: ["./layout-resizer.component.less"],
    host: {
        "[class.nui-layout-resizer]": "true",
        "[class.nui-layout-resizer--vertical]": "!isResizeHorizontal()",
        "[class.nui-layout-resizer--horizontal]": "isResizeHorizontal()",
    },
})
export class LayoutResizerComponent
    extends ResizerDirective
    implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
    @Input() resizeDirection: ResizeDirection;
    @Input() resizeElement: any;
    @Input() resizeUnit: ResizeUnit;
    @Input() disabled = false;
    @Input() enableSeparateOffsetSize: boolean;
    @ViewChild("resizerSplit") resizerSplitEl: ElementRef;

    constructor(
        private _elRef: ElementRef,
        private _renderer: Renderer2,
        private _utilService: UtilService,
        private _targetElement: ElementRef,
        private _ngZone: NgZone,
        private _eventBusService: EventBusService
    ) {
        super(
            _elRef,
            _renderer,
            _utilService,
            _targetElement,
            _ngZone,
            _eventBusService
        );
    }

    public resizeClass = "nui-layout-resizer";

    /*
     * From template can be accessed only public properties
     * Changing original method access modifier by overriding original protected method
     */
    public isResizeHorizontal(): boolean {
        return super.isResizeHorizontal();
    }

    public ngOnInit() {
        this.resizerDirection = this.resizeDirection;
        this.resizerDisabled = this.disabled;
        this.resizerValue = this.resizeUnit;
        this.isMultiple = true;
        this.offsetSize = this.enableSeparateOffsetSize ? 0 : this._size / 2;
    }

    public ngAfterViewInit() {
        // This Overrides ResizerDirective's ngAfterViewInit
        this.resizePropObj = resizeDirectionHelpers[this.resizeDirection];
        this.targetElement = this.resizeElement.elRef;
        this.parentContainerNode =
            this.targetElement.nativeElement.parentElement;
        this.resizeGutter = this._elRef.nativeElement;
        this.resizerSplit = this.resizerSplitEl.nativeElement;
        this.addSubscription();
        this.addResizeObserver();
        this.appendEvents();
        this.refreshStyle();
    }

    public ngOnDestroy() {
        this.unlistenEvents();
    }
}
