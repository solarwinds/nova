import {
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostBinding,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import _debounce from "lodash/debounce";
import _isEmpty from "lodash/isEmpty";
import _isNil from "lodash/isNil";
import _toString from "lodash/toString";

import { UtilService } from "../../services/util.service";
import { NuiFormFieldControl } from "../form-field/public-api";
import { MenuComponent } from "../menu";

import { BaseSelect } from "./base-select";

// <example-url>./../examples/index.html#/select</example-url>

@Component({
    selector: "nui-select",
    host: {"class": "nui-select"},
    templateUrl: "./select.component.html",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => SelectComponent),
            multi: true,
        },
    ],
    styleUrls: ["./select.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class SelectComponent extends BaseSelect implements OnInit, OnChanges, OnDestroy {
    /**
     * A value that tells popup to be attached right after it's parent declaration or in <body>
     */
    @Input() appendToBody: boolean;

    /**
     * Input that indicates text which is displayed if "isRemoveValueEnabled" set to true
     */
    @Input() removeValueText: string = "Unspecified";

    /**
     * Callback event that provides split-button behavior and interaction.
     */
    @Output() secondaryAction = new EventEmitter<any>();

    private debouncedBlur = _debounce(() => {
        this.handleBlur();
    }, 300);

    @HostBinding("class.nui-select--justified")
    get isJustified() {
        return this.justified;
    }

    @HostBinding("class.nui-select--inline")
    get isInline() {
        return this.inline;
    }

    @ViewChild("menu") public menu: MenuComponent;

    constructor(utilService: UtilService, private renderer: Renderer2, public elRef: ElementRef) {
        super(utilService);
    }

    private unsubscriber: () => void;

    ngOnInit() {
        super.ngOnInit();
        this.unsubscriber = this.renderer.listen(this.elRef.nativeElement, "focusout", () => {
            // Blur is debounced cause when you click on menu item blur is triggered twice: from textbox and when popup is closed.
            this.debouncedBlur();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    public displayPlaceholder(): boolean {
        return !_isNil(this.placeholder) && _isEmpty(this.getSelectedItem());
    }

    public displayedValue(): string {
        return this.displayPlaceholder() ? this.placeholder :
            _toString(this.getDisplayValueFormatted(this.getSelectedItem()));
    }

    public handleBlur() {
        this.select(this.selectedItem);
    }

    public getWidth(): string {
        // when appendToBody=true popup goes to body, so it's out of nui-select and it's width needs to be set explicitly
        return this.appendToBody || this.isJustified ? this.elRef.nativeElement.getBoundingClientRect().width + "px" : "";
    }

    ngOnDestroy(): void {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }
}
