import { Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EventBus, IEvent, immutableSet } from "@solarwinds/nova-bits";
import get from "lodash/get";
import pick from "lodash/pick";
import { takeUntil } from "rxjs/operators";

import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../../../../types";
import { PreviewService } from "../../../preview.service";
import { BaseConverter } from "../../base-converter";
import { IConverterFormPartsProperties } from "../../types";

export class GenericArrayConverterService extends BaseConverter {
    private formParts: IConverterFormPartsProperties[];

    private get previewComponentId() {
        return this.componentId.split("/")[0];
    }

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                previewService: PreviewService,
                pizzagnaService: PizzagnaService) {
        super(eventBus, previewService, pizzagnaService);
    }

    public updateConfiguration(properties: { formParts: IConverterFormPartsProperties[]; }) {
        if (properties && properties.formParts) {
            this.formParts = properties.formParts;
        }
    }

    public buildForm() {
        const preview = this.getPreview();

        const updatedPizzagna = this.formParts.reduce((res, v) => {
            const previewSlice = get(preview, v.previewPath) as any[];
            const componentInArray = previewSlice?.find(c => c.id === this.previewComponentId);
            const fromPreview = pick(componentInArray, v.keys);

            res = immutableSet(res, `${PizzagnaLayer.Data}.${this.componentId}.properties`, fromPreview);

            return res;
        }, this.pizzagnaService.pizzagna);
        this.updateFormPizzagna(updatedPizzagna);
    }

    public toPreview(form: FormGroup) {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(formData => {
                const updatedPreview = this.formParts.reduce((p, v) => {
                    const outPath = v.previewOutputPath || v.previewPath;

                    const preview = get(p, outPath) as any[];
                    const compIndex = preview.findIndex(c => c.id === this.previewComponentId);
                    const fromPreview = preview[compIndex];

                    const fromForm = pick(formData, v.keys);
                    const merged = { ...fromPreview, ...fromForm };

                    return immutableSet(p, `${outPath}[${compIndex}]`, merged);
                }, this.getPreview());

                this.updatePreview(updatedPreview);
            });
    }

}
