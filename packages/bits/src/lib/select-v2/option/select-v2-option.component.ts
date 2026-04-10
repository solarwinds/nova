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

import { Highlightable } from "@angular/cdk/a11y";
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostBinding, HostListener, Input, inject } from "@angular/core";

import { OVERLAY_ITEM } from "../../overlay/constants";
import { OverlayItemComponent } from "../../overlay/overlay-item/overlay-item.component";
import { IOption, OptionValueType } from "../../overlay/types";
import { NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "../constants";
import { IOptionedComponent } from "../types";

/**
 * @ignore
 * Will be renamed in scope of the NUI-5797
 */
@Component({
    selector: "nui-select-v2-option",
    template: `<ng-content></ng-content>`,
    styleUrls: ["./select-v2-option.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "nui-select-v2-option",
        role: "option",
    },
    providers: [
        {
            provide: OVERLAY_ITEM,
            useExisting: forwardRef(() => SelectV2OptionComponent),
        },
    ],
    standalone: false,
})
export class SelectV2OptionComponent
    extends OverlayItemComponent
    implements Highlightable, IOption
{
    element: ElementRef<HTMLElement>;

    /** Sets value */
    @Input() public value: OptionValueType;

    /** Datasource index. Used to track correct items for virtual scroll */
    @Input() public index: number;

    /** Used to pass context for the custom template */
    @Input() public displayValueContext: any;

    /** Whether the Option outfiltered */
    @HostBinding("class.hidden")
    @Input()
    public outfiltered: boolean = false;

    /** Whether the Option selected */
    @HostBinding("class.selected")
    public get selected(): boolean | undefined {
        if (!this.select.multiselect && this.select?.selectedOptions[0]) {
            return !isNaN(this.index)
                ? this.select.selectedOptions[0]?.index === this.index
                : this.select.selectedOptions[0] === this;
        }
    }

    private select: IOptionedComponent;

    constructor() {
        const parent = inject<IOptionedComponent>(NUI_SELECT_V2_OPTION_PARENT_COMPONENT, { optional: true })!;
        const element = inject<ElementRef<HTMLElement>>(ElementRef);

        super();
        this.element = element;

        this.select = parent;
    }

    /** Handles Mouse click */
    @HostListener("click", ["$event"])
    public onClick(event: UIEvent): void {
        event.preventDefault();
        event.stopPropagation();
        if (this.isDisabled) {
            return;
        }
        this.select.selectOption(this);
    }

    /** Gets value displayed in the Option */
    public get viewValue(): string {
        return (this.element.nativeElement.textContent || "").trim();
    }
}
