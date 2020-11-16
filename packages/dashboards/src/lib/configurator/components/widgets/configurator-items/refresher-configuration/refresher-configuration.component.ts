import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoggerService } from "@solarwinds/nova-bits";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { RefresherSettingsService } from "../../../../../components/providers/refresher-settings.service";
import { IHasChangeDetector, IHasForm } from "../../../../../types";

import { TIME_UNITS_SHORT, TimeUnit } from "./refresh-rate-configurator/time-units";

@Component({
    selector: "nui-refresher-configuration",
    templateUrl: "./refresher-configuration.component.html",
    styleUrls: ["./refresher-configuration.component.less"],
})
export class RefresherConfigurationComponent implements OnInit, OnChanges, OnDestroy, IHasChangeDetector, IHasForm {
    public static lateLoadKey = "RefresherConfigurationComponent";

    @Input() enabled: boolean;
    @Input() interval: number;
    @Input() minSeconds: number = 1;
    @Input() maxSeconds: number = 86400;
    @Input() overrideDefaultSettingsCaption = $localize`Custom refresh rate`;
    @Input() overrideDefaultSettings = true;
    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;

    private destroyed$ = new Subject();

    constructor(public changeDetector: ChangeDetectorRef,
                private formBuilder: FormBuilder,
                private logger: LoggerService,
                public refresherSettings: RefresherSettingsService,
                private cd: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            enabled: [true, [Validators.required]],
            overrideDefaultSettings: [this.overrideDefaultSettings, [Validators.required]],
            interval: [this.interval ?? 0, [Validators.required]],
        });

        this.form.statusChanges.pipe(
            takeUntil(this.destroyed$)
        ).subscribe(() => {
            this.form.markAllAsTouched();
            this.cd.detectChanges();
        });

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.enabled) {
            this.form.get("enabled")?.patchValue(this.enabled);
        }
        if (changes.interval) {
            this.form.get("interval")?.patchValue(this.interval);
        }
        if (changes.overrideDefaultSettings) {
            this.form.get("overrideDefaultSettings")?.patchValue(this.overrideDefaultSettings);
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public getHeaderSubtitle() {
        let result = "";
        if (this.form.get("enabled")?.value) {
            result += $localize`Enabled`;
            result += ", ";
            if (this.form.get("overrideDefaultSettings")?.value) {
                result += this.getDurationLabel(this.form.get("interval")?.value);
            } else {
                result += $localize`Use default value` + " (" + this.getDurationLabel(this.refresherSettings.refreshRateSeconds) + ")";
            }
        } else {
            result += $localize`Disabled`;
        }

        return result;
    }

    // TODO: make reusable
    public getDurationLabel(seconds: number): string {

        let totalSeconds = seconds;
        let result: string = "";
        const hours = Math.floor(totalSeconds / 3600);

        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);

        const calculatedSeconds = totalSeconds % 60;

        if (hours > 0) {
            result += hours + TIME_UNITS_SHORT[TimeUnit.Hour] + " ";
        }

        if (minutes > 0) {
            result += minutes + TIME_UNITS_SHORT[TimeUnit.Minute] + " ";
        }

        if (calculatedSeconds > 0) {
            result += calculatedSeconds + TIME_UNITS_SHORT[TimeUnit.Second] + " ";
        }

        result = result.trim();

        if (result === "") {
            return "0" + TIME_UNITS_SHORT[TimeUnit.Second];
        }

        return result;
    }
}
