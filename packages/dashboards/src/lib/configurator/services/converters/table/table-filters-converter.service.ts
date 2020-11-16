import { AfterViewInit, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EventBus, IEvent, immutableSet } from "@solarwinds/nova-bits";
import { takeUntil } from "rxjs/operators";

import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../../../types";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

export class TableFiltersConverterService extends BaseConverter implements AfterViewInit {

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                previewService: PreviewService,
                pizzagnaService: PizzagnaService) {
        super(eventBus, previewService, pizzagnaService);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }

    public buildForm(): void {
        let formPizzagna = this.pizzagnaService.pizzagna;

        const table = this.getPreview()?.table;
        const columns = table?.properties?.configuration?.columns;
        const sorterConfiguration = table?.properties?.configuration?.sorterConfiguration;

        formPizzagna = immutableSet(formPizzagna, `${PizzagnaLayer.Data}.filters.properties.columns`, columns);
        formPizzagna = immutableSet(formPizzagna, `${PizzagnaLayer.Data}.filters.properties.sorterConfiguration`, sorterConfiguration);

        this.updateFormPizzagna(formPizzagna);
    }

    public toPreview(form: FormGroup): void {
        form.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(filters => {
                let preview = this.getPreview();
                preview = immutableSet(preview, "table.properties.configuration.sorterConfiguration", filters.sorterConfiguration);
                this.updatePreview(preview);
                // we need to update form with columns that are available
                this.buildForm();
            });
    }
}
