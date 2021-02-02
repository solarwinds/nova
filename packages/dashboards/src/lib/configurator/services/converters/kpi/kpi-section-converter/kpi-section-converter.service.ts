import { Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";
import get from "lodash/get";
import pick from "lodash/pick";
import { takeUntil } from "rxjs/operators";

import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../../../../types";
import { PreviewService } from "../../../preview.service";
import { BaseConverter } from "../../base-converter";
import { IConverterFormPartsProperties } from "../../types";

@Injectable()
export class KpiSectionConverterService extends BaseConverter {
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
            const previewPath = `${this.previewComponentId}.${v.previewPath}`;
            // TODO: Define correct index type
            const previewSlice: Record<string, any> = get(preview, previewPath);

            if (previewSlice) {
                for (const key of v.keys) {
                    if (previewSlice[key] !== undefined) {
                        res = immutableSet(res, `${PizzagnaLayer.Data}.${this.componentId}.properties.${key}`, previewSlice[key]);
                    }
                }
            }

            return res;
        }, this.pizzagnaService.pizzagna);
        this.updateFormPizzagna(updatedPizzagna);
    }

    public toPreview(form: FormGroup) {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(formData => {
                const updatedPreview = this.formParts.reduce((p, v) => {
                    let outPath = v.previewOutputPath || v.previewPath;
                    outPath = `${this.previewComponentId}.${outPath}`;

                    const preview = get(p, outPath) as any[];

                    const fromForm = pick(formData, v.keys);
                    const merged = { ...preview, ...fromForm };

                    return immutableSet(p, `${outPath}`, merged);
                }, this.getPreview());

                this.updatePreview(updatedPreview);
            });
    }

}
