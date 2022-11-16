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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";

import { EventBus, IEvent, LoggerService } from "@nova-ui/bits";
import {
    ConfiguratorHeadingService,
    DATA_SOURCE_CHANGE,
    DATA_SOURCE_OUTPUT,
    IDataSourceOutput,
    IHasChangeDetector,
    IProperties,
    PIZZAGNA_EVENT_BUS,
    ProviderRegistryService,
} from "@nova-ui/dashboards";

@Component({
    selector: "acme-proportional-ds-config",
    templateUrl: "./proportional-ds-config.component.html",
    styleUrls: ["./proportional-ds-config.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcmeProportionalDSConfigComponent
    implements IHasChangeDetector, OnInit, OnChanges, OnDestroy
{
    public static lateLoadKey = "AcmeProportionalDSConfigComponent";

    @Input() dataSourceProviders: string[] = [];

    @Input() properties: IProperties;
    @Input() providerId: string;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;

    // used by the Broadcaster
    public dsOutput = new ReplaySubject<any>(1);

    private readonly destroy$ = new Subject<void>();

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        public configuratorHeading: ConfiguratorHeadingService,
        private providerRegistryService: ProviderRegistryService,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
        private injector: Injector,
        private logger: LoggerService
    ) {}

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            providerId: [this.providerId || "", [Validators.required]],
            properties: this.formBuilder.group({
                isEuropeOnly: false,
            }),
        });

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.providerId && !changes.providerId.isFirstChange()) {
            const previousValue: string = changes.providerId.previousValue;
            if (previousValue !== this.providerId) {
                this.form.get("providerId")?.setValue(this.providerId);
                this.invokeDataSource(this.providerId);
            }
        }

        if (changes.properties && !changes.properties.isFirstChange()) {
            if (
                changes.properties.previousValue?.isEuropeOnly !==
                this.properties.isEuropeOnly
            ) {
                this.form
                    .get("properties.isEuropeOnly")
                    ?.setValue(this.properties.isEuropeOnly);
            }
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public onDataSourceChange(providerId: string): void {
        this.eventBus.next(DATA_SOURCE_CHANGE, {});
        this.invokeDataSource(providerId);
    }

    public invokeDataSource(providerId: string): void {
        if (!providerId) {
            return;
        }
        const provider = this.providerRegistryService.getProvider(providerId);
        if (provider) {
            const dataSource = this.providerRegistryService.getProviderInstance(
                provider,
                this.injector
            );
            // This subscriptions is only meant to emit actual datasource value to event bus
            dataSource.outputsSubject
                .pipe(take(1))
                .subscribe((result: any | IDataSourceOutput<any>) => {
                    this.eventBus.next(DATA_SOURCE_OUTPUT, { payload: result });
                });

            // This subscription emits filtered set of datasource values defined by the from properties changes
            dataSource.outputsSubject
                .pipe(takeUntil(this.destroy$))
                .subscribe((result: any | IDataSourceOutput<any>) => {
                    this.dsOutput.next(result);
                });

            this.form
                .get("properties")
                ?.valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe(async (value) => {
                    // Updating changed properties to let datasource properly update the datasource if there are any filters
                    // in the configuration (isEuropeOnly property in our case).
                    await dataSource.updateConfiguration({
                        ...this.properties,
                        ...value,
                    });
                    await dataSource.applyFilters();
                });
        } else {
            this.logger.warn("No provider found for id:", providerId);
        }
    }
}
