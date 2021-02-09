import { Inject, Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";
import get from "lodash/get";
import pick from "lodash/pick";
import { takeUntil } from "rxjs/operators";

import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { PreviewService } from "../../../preview.service";
import { BaseConverter } from "../../base-converter";
import { IConverterFormPartsProperties } from "../../types";

@Injectable()
export class GenericConverterService extends BaseConverter {
    private formParts: IConverterFormPartsProperties[];

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
            // TODO: Define correct index type
            const previewSlice: Record<string, any> = get(preview, v.previewPath);

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
                    const outPath = v.previewOutputPath || v.previewPath;
                    const fromPreview = get(p, outPath);
                    const fromForm = pick(formData, v.keys);
                    const merged = { ...fromPreview, ...fromForm };

                    return immutableSet(p, outPath, merged);
                }, this.getPreview());

                this.updatePreview(updatedPreview);
            });
    }
}
