import { ChangeDetectorRef, Component, HostBinding, Inject, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { ControlContainer, FormGroup, FormGroupDirective } from "@angular/forms";
import { EventBus, IEvent, LoggerService } from "@solarwinds/nova-bits";

import { BaseLayout } from "../../../components/layouts/base-layout";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS } from "../../../types";

/**
 * This component registers multiple nested form groups in a parent form
 */
@Component({
    selector: "nui-form-stack",
    templateUrl: "./form-stack.component.html",
    viewProviders: [
        {
            provide: ControlContainer,
            useExisting: FormGroupDirective,
        }],
})
export class FormStackComponent extends BaseLayout implements OnInit, OnChanges {
    static lateLoadKey = "FormStackComponent";

    @Input() nodes: [];

    @HostBinding("class")
    public elementClass = "";

    public form: FormGroup;

    constructor(changeDetector: ChangeDetectorRef,
                pizzagnaService: PizzagnaService,
                logger: LoggerService,
                public formDirective: FormGroupDirective,
                @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>) {
        super(changeDetector, pizzagnaService, logger);
    }

    public ngOnInit() {
        this.form = this.formDirective.form;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
    }

    public onEvent(componentId: string, event: IEvent) {
        if (event.id === "formReady") {
            this.addFormGroup(componentId, event.payload);
        }
    }

    public addFormGroup(name: string, formGroup: FormGroup) {
        this.form.addControl(name, formGroup);
    }

    public getNodes(): string[] {
        return this.nodes;
    }

}
