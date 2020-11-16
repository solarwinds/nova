import { Highlightable } from "@angular/cdk/a11y";
import { ChangeDetectionStrategy, Component, ElementRef, forwardRef, HostBinding, HostListener, Inject, Input, Optional } from "@angular/core";

import { OVERLAY_ITEM } from "../../overlay/constants";
import { OverlayItemComponent } from "../../overlay/overlay-item/overlay-item.component";
import { IOption, OptionValueType } from "../../overlay/types";
import { NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "../constants";
import { IOptionedComponent } from "../types";

/**
 * @ignore
 */
@Component({
    selector: "nui-select-v2-option",
    template: `<ng-content></ng-content>`,
    styleUrls: ["./select-v2-option.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "nui-select-v2-option",
    },
    providers: [
        { provide: OVERLAY_ITEM, useExisting: forwardRef(() => SelectV2OptionComponent) },
    ],
})
export class SelectV2OptionComponent extends OverlayItemComponent implements Highlightable, IOption {
    /** Sets value */
    @Input() public value: OptionValueType;

    /** Datasource index. Used to track correct items for virtual scroll */
    @Input() public index: number;

    /** Used to pass context for the custom template */
    @Input() public displayValueContext: any;

    /** Whether the Option outfiltered */
    @HostBinding("class.hidden")
    @Input() public outfiltered: boolean = false;

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

    constructor(@Optional() @Inject(NUI_SELECT_V2_OPTION_PARENT_COMPONENT) parent: IOptionedComponent,
                public element: ElementRef<HTMLElement>) {
        super(element);
        this.select = parent;
    }

    /** Handles Mouse click */
    @HostListener("click", ["$event"])
    public onClick(event: UIEvent) {
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
