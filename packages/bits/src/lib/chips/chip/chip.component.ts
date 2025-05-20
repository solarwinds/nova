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
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";

import { IChipsItem } from "../public-api";

/**
 * @ignore
 */
@Component({
    selector: "nui-chip",
    templateUrl: "./chip.component.html",
    styleUrls: ["./chip.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: "nui-chip",
        role: "listitem",
    },
})
export class ChipComponent implements AfterViewInit {
    /**
     * Value passed to display as a chip.
     */
    @Input() public item: IChipsItem;
    /**
     * Value passed to display a tooltip for the 'close' button
     */
    @Input() public closeButtonTooltip: string;

    /** Custom css class to be added to the chip element */
    @Input() public customClass:
        | string
        | string[]
        | Set<string>
        | { [klass: string]: any };

    /**
     * Event that is fired when single item is cleared (by clicking on remove icon).
     */
    @Output() public remove = new EventEmitter<any>();

    public isContentProjected: boolean;

    @ViewChild("projection") private contentTemplate: TemplateRef<any>;

    constructor(public host: ElementRef, private cdRef: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        this.isContentProjected = Boolean(
            this.contentTemplate.createEmbeddedView(undefined).rootNodes.length
        );
        this.cdRef.detectChanges();
    }

    public onRemove(): void {
        this.remove.emit();
    }
}
