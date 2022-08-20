import { AfterViewInit, Inject, Injectable, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EventBus, IEvent } from "@nova-ui/bits";
import { Subject } from "rxjs";

import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import {
    ISetPropertyPayload,
    SET_PROPERTY_VALUE,
} from "../../../services/types";
import { IPizzagna, IPizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../types";
import { PreviewService } from "../preview.service";

import { IConfiguratorConverter } from "./types";

@Injectable()
export abstract class BaseConverter
    implements AfterViewInit, IConfiguratorConverter, OnDestroy
{
    public component: any;
    public componentId: string;

    public destroy$ = new Subject();

    constructor(
        @Inject(PIZZAGNA_EVENT_BUS) protected eventBus: EventBus<IEvent>,
        private previewService: PreviewService,
        protected pizzagnaService: PizzagnaService
    ) {}

    ngAfterViewInit(): void {
        this.buildForm();

        this.toPreview(this.component.form);
    }

    public abstract buildForm(): void;

    public abstract toPreview(form: FormGroup): void;

    public setComponent(component: any, componentId: string) {
        this.component = component;
        this.componentId = componentId;
    }

    public getPreview(): IPizzagnaLayer {
        return this.previewService.preview;
    }

    public updatePreview(preview: IPizzagnaLayer) {
        this.previewService.preview = preview;
    }

    public updateFormPizzagna(pizzagna: IPizzagna) {
        this.pizzagnaService.updatePizzagna(pizzagna);
        this.eventBus.getStream(SET_PROPERTY_VALUE).next({
            payload: { path: "", value: pizzagna } as ISetPropertyPayload,
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
