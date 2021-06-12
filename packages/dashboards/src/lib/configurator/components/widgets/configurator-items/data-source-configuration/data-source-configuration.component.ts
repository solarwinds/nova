import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Injector,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EventBus, IDataSource, IEvent, LoggerService } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { take } from "rxjs/operators";

import { IDataSourceOutput } from "../../../../../components/providers/types";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";
import { IHasChangeDetector, IHasForm, IProperties, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { DATA_SOURCE_CHANGE, DATA_SOURCE_CREATED, DATA_SOURCE_OUTPUT } from "../../../../types";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";
import { DataSourceErrorComponent } from "../data-source-error/data-source-error.component";

/**
 * This is a basic implementation of a data source configuration component. In the real world scenario, this component will most likely be replaced by a
 * custom one, but still can be used as a template for developing a custom specific solution.
 */
@Component({
    selector: "nui-data-source-configuration",
    templateUrl: "./data-source-configuration.component.html",
    styleUrls: ["./data-source-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSourceConfigurationComponent implements IHasChangeDetector, IHasForm, OnInit, OnChanges {
    public static lateLoadKey = "DataSourceConfigurationComponent";

    /**
     * This component shows a dropdown with options for selecting a data source, this input represents these options.
     */
    @Input() dataSourceProviders: string[] = [];
    @Input() errorComponent: string = DataSourceErrorComponent.lateLoadKey;

    @Input() properties: IProperties;
    @Input() providerId: string;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public hasDataSourceError: boolean = false;
    public dataSource: IDataSource;

    // used by the Broadcaster
    public dsOutput = new Subject<any>();
    public dataFieldIds = new Subject<any>();

    constructor(public changeDetector: ChangeDetectorRef,
                public configuratorHeading: ConfiguratorHeadingService,
                private formBuilder: FormBuilder,
                private providerRegistryService: ProviderRegistryService,
                @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>,
                private injector: Injector,
                private logger: LoggerService) {
    }

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            providerId: [this.providerId || "", [Validators.required]],
            properties: this.formBuilder.group(this.properties || {}),
        });
        this.form.setValidators([() => this.hasDataSourceError ? { dataSourceError: true } : null])

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.providerId && !changes.providerId.isFirstChange()) {
            const previousValue: string = changes.providerId.previousValue;
            if ((previousValue) !== this.providerId) {
                this.form.get("providerId")?.setValue(this.providerId);
                this.invokeDataSource(this.providerId);
            }
        }
    }

    public onDataSourceChange(providerId: string) {
        this.eventBus.next(DATA_SOURCE_CHANGE, {});
        this.invokeDataSource(providerId);
    }

    /**
     * The data source is invoked here to notify the rest of the form about  changes in the data source output.
     * DATA_SOURCE_OUTPUT event is emitted through the event bus carrying the data source result as the payload.
     * This might not be necessary in every situation. If the important information is already stored in the
     * data source properties, this step can be omitted.
     *
     * @param providerId
     */
    public invokeDataSource(providerId: string) {
        if (!providerId) {
            return;
        }
        const provider = this.providerRegistryService.getProvider(providerId);
        if (provider) {
            this.dataSource = this.providerRegistryService.getProviderInstance(provider, this.injector);
            this.eventBus.next(DATA_SOURCE_CREATED, {payload: this.dataSource});
            this.dataSource.outputsSubject
                .pipe(take(1))
                .subscribe((result: any | IDataSourceOutput<any>) => {
                    this.eventBus.next(DATA_SOURCE_OUTPUT, { payload: result });
                    this.dsOutput.next(result);
                    const dataFieldIdsResult = result?.result || result;
                    if (dataFieldIdsResult) {
                        this.dataFieldIds.next(Object.keys(dataFieldIdsResult));
                    }
                });
            // This setTimeout is because the output of the data source might come faster than the data-source-error-component is initiated
            setTimeout(() => {
                this.dataSource.applyFilters();
            });
        } else {
            this.logger.warn("No provider found for id:", providerId);
        }
    }

    public onErrorState(isError: boolean) {
        this.hasDataSourceError = isError;
        this.form.markAsTouched({onlySelf: true});
        this.form.updateValueAndValidity({emitEvent: false});
        this.changeDetector.detectChanges();
    }
}
