import { LiveAnnouncer } from "@angular/cdk/a11y";
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
    TemplateRef,
    ViewEncapsulation,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { merge } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { NuiFormFieldControl, OptionValueType } from "../../public-api";
import { BaseSelectV2 } from "../base-select-v2";
import { NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "../constants";
import { OptionKeyControlService } from "../option-key-control.service";
import { SelectV2OptionComponent } from "../option/select-v2-option.component";

// <example-url>./../examples/index.html#/select-v2</example-url>
@Component({
    selector: "nui-select-v2",
    templateUrl: "./select-v2.component.html",
    styleUrls: ["./select-v2.component.less"],
    encapsulation: ViewEncapsulation.None,
    providers: [
        OptionKeyControlService,
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectV2Component),
            multi: true,
        },
        {
            provide: NuiFormFieldControl,
            useExisting: forwardRef(() => SelectV2Component),
            multi: true,
        },
        {
            provide: NUI_SELECT_V2_OPTION_PARENT_COMPONENT,
            useExisting: SelectV2Component,
        },
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: "nui-select-v2",
        role: "button",
    },
})

// Will be renamed in scope of the NUI-5797
export class SelectV2Component
    extends BaseSelectV2
    implements AfterContentInit, OnDestroy, OnChanges
{
    /** Sets a custom template for displaying it in the Option */
    @Input() public displayValueTemplate: TemplateRef<any>;

    /** Value of the selected Option that derives in the Select */
    public displayText: string;

    constructor(
        elRef: ElementRef<HTMLElement>,
        optionKeyControlService: OptionKeyControlService<SelectV2OptionComponent>,
        cdRef: ChangeDetectorRef,
        public liveAnnouncer: LiveAnnouncer
    ) {
        super(optionKeyControlService, cdRef, elRef, liveAnnouncer);
    }

    public ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
    }

    public ngAfterContentInit(): void {
        // applying changes to content immediately after it was initialized (checked)
        // causes "Expression has changed after it was checked" error
        setTimeout(() => {
            super.ngAfterContentInit();

            if (!this.multiselect) {
                this.defineDisplayText();
            }

            this.cdRef.markForCheck();
        });

        // options may be received after value changes, that's why
        // we check "selectedOptions" and "valueChanged" to be set per "value" again in "handleValueChange"
        merge(
            this.optionsChanged(),
            this.valueChanged.pipe(takeUntil(this.destroy$))
        ).subscribe(() => {
            if (!this.multiselect) {
                this.defineDisplayText();
            }
            this.cdRef.markForCheck();
        });
    }

    /** Selects specific Option and set its value to the model */
    public selectOption(option: SelectV2OptionComponent) {
        if (option.outfiltered || option.isDisabled) {
            return;
        }

        super.selectOption(option);
        if (!this.multiselect) {
            this.defineDisplayText();
        }
        this.cdRef.markForCheck();
    }

    /** Sets value to the model */
    public writeValue(value: OptionValueType | OptionValueType[]): void {
        super.writeValue(value);
        this.defineDisplayText();
        this.cdRef.markForCheck();
    }

    /** Checks whether value of the Select is empty */
    public get isEmpty(): boolean {
        return !this.getLastSelectedOption();
    }

    /**
     * Calls to ngOnDestroy do not automatically get propagated to base classes.
     * This can lead to memory leaks.
     * This is a safe guard for preventing memory leaks in derived classes.
     */
    public ngOnDestroy() {
        super.ngOnDestroy();
    }

    private defineDisplayText() {
        this.displayText = this.selectedOptions[0]?.viewValue || "";
    }
}
