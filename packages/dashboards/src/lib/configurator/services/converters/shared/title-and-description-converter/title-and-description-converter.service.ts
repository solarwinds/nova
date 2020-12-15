import { AfterViewInit, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EventBus, IEvent, immutableSet } from "@nova-ui/bits";
import { takeUntil } from "rxjs/operators";

import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../../../../types";
import { PreviewService } from "../../../preview.service";
import { BaseConverter } from "../../base-converter";

export class TitleAndDescriptionConverterService extends BaseConverter implements AfterViewInit {
    public static readonly PROPERTIES_PATH = `${PizzagnaLayer.Configuration}.titleAndDescription.properties`;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                previewService: PreviewService,
                pizzagnaService: PizzagnaService) {
        super(eventBus, previewService, pizzagnaService);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }

    public buildForm(): void {
        let editorPizzagna = this.pizzagnaService.pizzagna;
        const headerProperties = this.getPreview()?.header?.properties;

        editorPizzagna = immutableSet(editorPizzagna, `${TitleAndDescriptionConverterService.PROPERTIES_PATH}.title`, headerProperties?.title);
        editorPizzagna = immutableSet(editorPizzagna, `${TitleAndDescriptionConverterService.PROPERTIES_PATH}.subtitle`, headerProperties?.subtitle);
        editorPizzagna = immutableSet(editorPizzagna, `${TitleAndDescriptionConverterService.PROPERTIES_PATH}.url`, headerProperties?.url);
        editorPizzagna = immutableSet(editorPizzagna, `${TitleAndDescriptionConverterService.PROPERTIES_PATH}.description`, headerProperties?.description);
        editorPizzagna = immutableSet(editorPizzagna, `${TitleAndDescriptionConverterService.PROPERTIES_PATH}.collapsible`, headerProperties?.collapsible);

        this.updateFormPizzagna(editorPizzagna);
    }

    public toPreview(form: FormGroup): void {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(value => {
                const preview = immutableSet(this.getPreview(), `header.properties`, value);
                this.updatePreview(preview);
            });
    }
}
