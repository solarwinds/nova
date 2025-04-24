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
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// eslint-disable-next-line import/no-deprecated
import { combineLatest, Subject } from "rxjs";
import { filter, takeUntil, tap } from "rxjs/operators";

import { LoggerService } from "@nova-ui/bits";

import { RefreshRateConfiguratorComponent } from "./refresh-rate-configurator/refresh-rate-configurator.component";
import {
    TimeUnit,
    TIME_UNITS_SHORT,
} from "./refresh-rate-configurator/time-units";
import { RefresherSettingsService } from "../../../../../components/providers/refresher-settings.service";
import { IHasChangeDetector, IHasForm } from "../../../../../types";

@Component({
    selector: "nui-refresher-configuration",
    templateUrl: "./refresher-configuration.component.html",
    styleUrls: ["./refresher-configuration.component.less"],
    standalone: false,
})
export class RefresherConfigurationComponent
    implements OnInit, OnChanges, OnDestroy, IHasChangeDetector, IHasForm
{
    public static lateLoadKey = "RefresherConfigurationComponent";

    @Input() enabled: boolean;
    @Input() interval: number;
    @Input() minSeconds: number = 1;
    @Input() maxSeconds: number = 86400;
    @Input() overrideDefaultSettingsCaption = $localize`Custom refresh rate`;
    @Input() overrideDefaultSettings = true;
    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;

    private destroyed$ = new Subject<void>();
    @ViewChild(RefreshRateConfiguratorComponent)
    private refreshRateComp: RefreshRateConfiguratorComponent;

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private logger: LoggerService,
        public refresherSettings: RefresherSettingsService,
        private cd: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            enabled: [true, [Validators.required]],
            overrideDefaultSettings: [
                this.overrideDefaultSettings,
                [Validators.required],
            ],
            interval: [this.interval ?? 0, [Validators.required]],
        });

        this.form.statusChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe(() => {
                this.form.markAllAsTouched();
                this.cd.detectChanges();
            });

        // eslint-disable-next-line import/no-deprecated
        combineLatest([
            this.form.controls["enabled"].valueChanges,
            this.form.controls["overrideDefaultSettings"].valueChanges,
        ])
            .pipe(
                filter((values) => values.some((v) => !v)),
                tap(this.resetInterval),
                takeUntil(this.destroyed$)
            )
            .subscribe();

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.enabled) {
            this.form?.get("enabled")?.patchValue(this.enabled);
        }
        if (changes.interval) {
            this.form?.get("interval")?.patchValue(this.interval);
        }
        if (changes.overrideDefaultSettings) {
            this.form
                ?.get("overrideDefaultSettings")
                ?.patchValue(this.overrideDefaultSettings);
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public getHeaderSubtitle(): string {
        let result = "";
        if (this.form.get("enabled")?.value) {
            result += $localize`Enabled`;
            result += ", ";
            if (this.form.get("overrideDefaultSettings")?.value) {
                result += this.getDurationLabel(
                    this.form.get("interval")?.value
                );
            } else {
                result +=
                    $localize`Use default value` +
                    " (" +
                    this.getDurationLabel(
                        this.refresherSettings.refreshRateSeconds
                    ) +
                    ")";
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
            result += hours + " " + TIME_UNITS_SHORT[TimeUnit.Hour] + " ";
        }

        if (minutes > 0) {
            result += minutes + " " + TIME_UNITS_SHORT[TimeUnit.Minute] + " ";
        }

        if (calculatedSeconds > 0) {
            result +=
                calculatedSeconds +
                " " +
                TIME_UNITS_SHORT[TimeUnit.Second] +
                " ";
        }

        result = result.trim();

        if (result === "") {
            return "0 " + TIME_UNITS_SHORT[TimeUnit.Second];
        }

        return result;
    }

    private resetInterval = () => {
        this.refreshRateComp.resetUnits();
        this.form.get("interval")?.setValue(this.interval || this.minSeconds);
    };
}
