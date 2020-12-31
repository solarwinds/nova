import { ChangeDetectorRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoggerService } from "@nova-ui/bits";

import { IHasChangeDetector, IHasForm, IProperties } from "../../../../types";

export abstract class DonutChartFormatterConfiguratorComponent implements IHasChangeDetector, IHasForm, OnChanges, OnInit {
    @Input() contentFormatterProperties: IProperties;
    @Input() dsOutput: any;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;

    constructor(public changeDetector: ChangeDetectorRef,
                protected formBuilder: FormBuilder,
                public logger: LoggerService) {
    }

    public ngOnChanges(changes: SimpleChanges) {
        // In case we change the formatter the configurator's form gets destroyed.
        // We need it recreated if it is selected once again
        if (!this.form) {
            this.initForm();
        }
        // In case we have already stored some values in the configuration we want to retreive them
        if (this.contentFormatterProperties) {
            Object.keys(this.contentFormatterProperties).forEach(p => {
                this.form?.get(p)?.setValue(this.contentFormatterProperties[p]);
            });
        } else {
            // In case 'properties' are not set in configuration we assign the value of the very first metric
            this.form?.get("currentMetric")?.patchValue(this.properMetric);
        }
    }

    public ngOnInit() {
        this.initForm();
    }

    public initForm(): void {
        this.form = this.formBuilder.group({
            currentMetric: [this.properMetric, Validators.required],
        });
        this.addCustomFormControls(this.form);
        this.formReady.emit(this.form);
    }

    get currentMetric(): AbstractControl {
        return this.form.get("currentMetric") as AbstractControl;
    }

    /**
     * Returns the valid metric including cases when current selected metric does not exist eny more.
     */
    get properMetric(): string {
        const currentMetric = this.contentFormatterProperties?.currentMetric;
        // This verifies whether the current metric still exists in the list of metric received from the datasource
        const hasMetric = this.dsOutput?.result.find((m: any) => m.id === currentMetric);
        // We return current metric if it is still in the list. Otherwise we fallback to the very first item of the
        // list received from the datasource
        return hasMetric ? currentMetric : this.dsOutput?.result[0]?.id;
    }

    /**
     * Add your custom form controls here
     *
     * @param form
     */
    protected addCustomFormControls(form: FormGroup): void {
    }
}
