import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { IHasChangeDetector } from "../../../../../../../types";

@Component({
    selector: "nui-table-column-description-configuration",
    templateUrl: "./description-configuration.component.html",
    styleUrls: ["./description-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionConfigurationComponent
    implements OnInit, OnDestroy, OnChanges, IHasChangeDetector
{
    static lateLoadKey = "DescriptionConfigurationComponent";

    @Input() label: string;
    @Input() isActive: string;
    @Input() width: number;
    @Input() isWidthMessageDisplayed: boolean;

    @Output() formReady: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();
    @Output() formDestroy: EventEmitter<FormGroup> =
        new EventEmitter<FormGroup>();

    public form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        public changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            label: [this.label || null, [Validators.required]],
            isActive: this.isActive ?? true,
            width: this.width || undefined,
        });

        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.label) {
            this.form?.patchValue({ label: changes.label.currentValue });
        }
        if (changes.isActive) {
            this.form?.patchValue({ isActive: changes.isActive.currentValue });
        }
        if (changes.width) {
            this.form?.patchValue({ width: changes.width.currentValue });
        }
    }

    public stub() {}

    ngOnDestroy(): void {
        this.formDestroy.emit(this.form);
    }
}
