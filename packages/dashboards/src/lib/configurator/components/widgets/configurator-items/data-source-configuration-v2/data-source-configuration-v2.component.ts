import {
    AfterViewInit,
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
import { EventBus, IEvent, LoggerService } from "@nova-ui/bits";
import isEqual from "lodash/isEqual";
import { Subject } from "rxjs/internal/Subject";
import { take } from "rxjs/operators";

import { ProviderRegistryService } from "../../../../../services/provider-registry.service";
import { IHasChangeDetector, IHasForm, IProperties, IProviderConfiguration, IProviderConfigurationForDisplay, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { DATA_SOURCE_CHANGE, DATA_SOURCE_CREATED, DATA_SOURCE_OUTPUT } from "../../../../types";
import { ConfiguratorHeadingService } from "../../../../services/configurator-heading.service";
import { DataSourceErrorHandlingComponent } from "../data-source-error-handling/data-source-error-handling.component";

/**
 * This is a basic implementation of a data source configuration component. In the real world scenario, this component will most likely be replaced by a
 * custom one, but still can be used as a template for developing a custom specific solution.
 */
@Component({
    selector: "nui-data-source-configuration",
    templateUrl: "./data-source-configuration-v2.component.html",
    styleUrls: ["./data-source-configuration-v2.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataSourceConfigurationV2Component implements IHasChangeDetector, IHasForm, OnInit, OnChanges, AfterViewInit {
    public static lateLoadKey = "DataSourceConfigurationV2Component";

    /**
     * This component shows a dropdown with options for selecting a data source, this input represents these options.
     */
    @Input() dataSourceProviders: IProviderConfigurationForDisplay[] = [];

    @Input() properties: IProperties;
    @Input() providerId: string;
    @Input() errorHandlingComponent: string = DataSourceErrorHandlingComponent.lateLoadKey;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public hasDataSourceError: boolean = false;

    // used by the Broadcaster
    public dataFieldIds = new Subject<any>();

    constructor(public changeDetector: ChangeDetectorRef,
                public configuratorHeading: ConfiguratorHeadingService,
                protected formBuilder: FormBuilder,
                protected providerRegistryService: ProviderRegistryService,
                @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>,
                protected injector: Injector,
                protected logger: LoggerService) {
    }

    public ngOnInit(): void {
        this.form = this.formBuilder.group({
            // Widget properties, form inputs and form values need to be in sync to work with generic converter
            // which is why we have providerId and properties as a form group even if we don't explicitly use it in the file.
            providerId: [this.providerId || "", [Validators.required]],
            properties: [this.properties || {}],
            dataSource: [null, [Validators.required]],
        });
        this.form.setValidators([() => this.hasDataSourceError ? { dataSourceError: true } : null])

        this.form.get("dataSource")?.valueChanges.subscribe((selectedDataSource) => {
            this.form.get("providerId")?.setValue(selectedDataSource?.providerId);
            if (selectedDataSource?.properties) {
                this.form.get("properties")?.setValue(selectedDataSource?.properties);
            }
        });

        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if ((changes.providerId && !changes.providerId.isFirstChange()) ||
            (changes.properties && !changes.properties.isFirstChange())) {
            const previousProvider: string = changes.providerId?.previousValue;
            const previousProperties: IProperties = changes.properties?.previousValue;
            if (previousProvider !== this.providerId || previousProperties !== this.properties) {
                const dataSource = this.dataSourceProviders
                    .find(provider =>
                        provider.providerId === this.providerId && isEqual(provider.properties ?? {}, this.properties ?? {})
                    );
                if (!dataSource) {
                    this.form?.get("providerId")?.setValue(this.providerId);
                    this.form?.get("properties")?.setValue(this.properties);
                    this.invokeDataSource({
                        properties: this.properties,
                        providerId: this.providerId,
                    });
                } else {
                    this.form?.get("dataSource")?.setValue(dataSource);
                    this.invokeDataSource(dataSource);
                }
            }
        }
        if (changes.dataSourceProviders && !changes.dataSourceProviders.isFirstChange() && this.dataSourceProviders.length === 1) {
            const dataSource = this.dataSourceProviders[0];
            this.form.get("dataSource")?.setValue(dataSource);
            this.invokeDataSource(dataSource);
        }
    }

    public ngAfterViewInit(): void {
        if (this.dataSourceProviders && this.dataSourceProviders.length === 1) {
            const dataSource = this.dataSourceProviders[0];
            this.form.get("dataSource")?.setValue(dataSource);
            this.invokeDataSource(dataSource);
        }
    }

    public onDataSourceSelected(selectedDataSource: IProviderConfigurationForDisplay) {
        this.eventBus.next(DATA_SOURCE_CHANGE, {});
        this.invokeDataSource(selectedDataSource);
    }

    /**
     * The data source is invoked here to notify the rest of the form about  changes in the data source output.
     * DATA_SOURCE_OUTPUT event is emitted through the event bus carrying the data source result as the payload.
     * This might not be necessary in every situation. If the important information is already stored in the
     * data source properties, this step can be omitted.
     *
     * @param data
     */
    public invokeDataSource(data: IProviderConfiguration) {
        if (!data.providerId) {
            return;
        }
        const provider = this.providerRegistryService.getProvider(data.providerId);
        if (provider) {
            const dataSource = this.providerRegistryService.getProviderInstance(provider, this.injector);

            this.eventBus.next(DATA_SOURCE_CREATED, { payload: dataSource });

            dataSource.outputsSubject
                .pipe(take(1))
                .subscribe((result: any) => {
                    this.eventBus.next(DATA_SOURCE_OUTPUT, { payload: result });
                    this.dataFieldIds.next(Object.keys(result.result || result));
                });
            if (dataSource.updateConfiguration) {
                dataSource.updateConfiguration(data.properties);
            }
            dataSource.applyFilters();
        } else {
            this.logger.warn("No provider found for id:", data.providerId);
        }
    }

    public onErrorState(isError: boolean) {
        this.hasDataSourceError = isError;
        this.form.markAsTouched({onlySelf: true});
        this.form.updateValueAndValidity({emitEvent: false});
        this.changeDetector.detectChanges();
    }
}
