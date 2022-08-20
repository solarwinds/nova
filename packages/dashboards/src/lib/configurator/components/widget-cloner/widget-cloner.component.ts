import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import cloneDeep from "lodash/cloneDeep";
import { BehaviorSubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { WidgetTypesService } from "../../../services/widget-types.service";
import {
    IHasChangeDetector,
    IPizzagna,
    IPizzagnaLayer,
    PizzagnaLayer,
} from "../../../types";
import { IWidget } from "../../../components/widget/types";
import { PreviewService } from "../../services/preview.service";
import { ConfiguratorComponent } from "../configurator/configurator.component";
import { IDashwizStepNavigatedEvent, IDashwizWaitEvent } from "../wizard/types";

@Component({
    selector: "nui-widget-cloner",
    templateUrl: "./widget-cloner.component.html",
    host: { class: "d-flex flex-column h-100" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetClonerComponent
    implements OnInit, OnDestroy, AfterViewInit, IHasChangeDetector
{
    public static lateLoadKey = "WidgetClonerComponent";

    @Input() formPizzagna?: IPizzagna;
    @Input() cloneSelectionComponentType: Function;

    public form: FormGroup;
    public widgetTemplate: IWidget;
    public navigationControl: BehaviorSubject<IDashwizWaitEvent> =
        new BehaviorSubject<IDashwizWaitEvent>({
            busyState: { busy: false },
            allowStepChange: true,
        });

    private destroy$ = new Subject();
    private resetForm$ = new Subject();
    public busy = false;
    public isFormDisplayed = false;

    constructor(
        public changeDetector: ChangeDetectorRef,
        public configurator: ConfiguratorComponent,
        private previewService: PreviewService,
        private formBuilder: FormBuilder,
        private widgetTypesService: WidgetTypesService
    ) {
        this.resetForm();
    }

    public ngOnInit(): void {
        this.previewService.previewChanged
            .pipe(takeUntil(this.destroy$))
            .subscribe((pizzagna: IPizzagnaLayer) => {
                this.onPreviewPizzagnaUpdate(pizzagna);
            });

        this.configurator.submitError
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.toggleBusy();
            });
    }

    public ngAfterViewInit(): void {
        // trigger dashwiz to update its button configuration
        this.changeDetector.markForCheck();
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.resetForm$.complete();
    }

    // --------------------------------------------------------------------------------

    public onPreviewPizzagnaUpdate(configLayer: IPizzagnaLayer) {
        if (!this.isFormDisplayed) {
            return;
        }

        const previewWidget = {
            ...this.configurator.previewWidget,
            pizzagna: {
                ...this.configurator.previewWidget?.pizzagna,
                [PizzagnaLayer.Configuration]: configLayer,
            },
        };
        // TODO: Make previewWidget to be assignable to IWidget
        // @ts-ignore: Type '{ pizzagna: { configuration: IPizzagnaLayer; }; }' is missing the following properties from type 'IWidget': id, type
        this.configurator.updateWidget(previewWidget);
    }

    public canFinish() {
        return (
            !!this.widgetTemplate?.pizzagna?.configuration &&
            !this.widgetTemplate?.metadata?.needsConfiguration
        );
    }

    public onFinish() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            // is used to trigger valueChanges to detect changes in forms
            // as form is invalid and marking as touched doesn't trigger neither statusChanges nor valueChanges
            // and validation messages and styles are not applied in that cases
            this.form.patchValue(this.form.value);
            this.form.updateValueAndValidity({ onlySelf: false });
            return;
        }

        this.toggleBusy();
        this.configurator.formSubmit();
    }

    public onCancel() {
        this.configurator.formCancel();
    }

    public onStepNavigated(event: IDashwizStepNavigatedEvent) {
        this.isFormDisplayed = event.currentStepIndex === 1;

        if (event.currentStepIndex === 0 && event.previousStepIndex === 1) {
            this.formPizzagna = undefined;
            this.resetForm();
            this.onSelect(this.widgetTemplate);
        } else if (event.currentStepIndex === 1) {
            this.formPizzagna = this.widgetTypesService.getWidgetType(
                this.widgetTemplate.type,
                this.widgetTemplate.version
            ).configurator;
            this.previewService.preview =
                this.widgetTemplate.pizzagna[PizzagnaLayer.Configuration];
        }
    }

    public onSelect(widget: IWidget) {
        this.widgetTemplate = widget;
        const previewWidget = {
            ...widget,
            id: this.configurator.previewWidget?.id || null,
        };

        // clear out the old widget first because we want to recreate the widget from scratch
        this.configurator.updateWidget(null);

        // the new widget is assigned in a setTimeout to apply the change in the next change detection cycle
        setTimeout(() => {
            // @ts-ignore: Type 'null' is not assignable to type 'string' on id property
            this.configurator.updateWidget(cloneDeep(previewWidget));
        });
    }

    private toggleBusy() {
        this.busy = !this.busy;
        this.navigationControl.next({
            busyState: { busy: this.busy },
            allowStepChange: !this.busy,
        });
    }

    private resetForm() {
        this.resetForm$.next();
        this.form = this.formBuilder.group({});
        this.form.statusChanges
            .pipe(takeUntil(this.resetForm$), takeUntil(this.destroy$))
            .subscribe(() => {
                this.changeDetector.markForCheck();
            });
    }
}
