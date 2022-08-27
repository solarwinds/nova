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

import { IHasChangeDetector, IHasForm } from "../../../../../types";

@Component({
    selector: "nui-table-column-description-configuration",
    templateUrl: "./timeseries-tile-description-configuration.component.html",
    styleUrls: ["./timeseries-tile-description-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeseriesTileDescriptionConfigurationComponent
    implements OnInit, OnDestroy, OnChanges, IHasChangeDetector, IHasForm
{
    static lateLoadKey = "TimeseriesTileDescriptionConfigurationComponent";

    @Input() label: string;

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
            label: [this.label, Validators.required],
        });

        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.label) {
            const value = changes.label.currentValue;
            if (value) {
                this.form.patchValue({ label: value });
            }
        }
    }

    ngOnDestroy(): void {
        this.formDestroy.emit(this.form);
    }
}
