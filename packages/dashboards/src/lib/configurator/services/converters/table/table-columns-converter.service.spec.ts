import { fakeAsync, flush, tick } from "@angular/core/testing";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { EventBus, IEvent } from "@nova-ui/bits";

import { DynamicComponentCreator } from "../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { PreviewService } from "../../preview.service";

import { EDITOR_PIZZAGNA, TABLE_WIDGET_PREVIEW_PIZZAGNA } from "./mocks";
import { TableColumnsConverterService } from "./table-columns-converter.service";

class MockComponent {
    public static lateLoadKey = "MockComponent";
    public form: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            columns: formBuilder.array([]),
        });
    }

}

const mockedColumnsFormValue = {
    id: "column1",
    properties: {
        description: {
            label: $localize`No`,
            isActive: true,
        },
        presentation: {
            dataFieldIds: ["position"],
            formatterId: "RawFormatterComponent",
        },
    },
};

describe("TableColumnsConverterService >", () => {
    const eventBus = new EventBus<IEvent>();
    const formBuilder = new FormBuilder();
    const component = new MockComponent(formBuilder);
    const previewService = new PreviewService();
    const dynamicComponentCreator = new DynamicComponentCreator();
    const pizzagnaService = new PizzagnaService(eventBus, dynamicComponentCreator);

    let service: TableColumnsConverterService;

    beforeEach(fakeAsync(() => {
        spyOn(pizzagnaService, "createComponentsFromTemplate");
        previewService.preview = TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration;
        pizzagnaService.pizzagna = EDITOR_PIZZAGNA;
        service = new TableColumnsConverterService(eventBus, previewService, pizzagnaService);
        service.setComponent(component as any, "");
        service.ngAfterViewInit();
        service.buildForm();
        flush();
    }));

    it("should have component set", () => {
        expect(service.component).toBeDefined();
    });

    it("should properly build form", () => {
        const columnsInFormPizzagna = pizzagnaService.pizzagna.data.columns.properties?.columns;
        const columnsInPreviewPizzagna = TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration.table.properties.configuration.columns;

        expect(columnsInFormPizzagna).toEqual(columnsInPreviewPizzagna);
    });

    xit("should properly update preview", fakeAsync(() => {
        spyOn(service, "updatePreview");
        const expectedPreviewPizzagna = { ...TABLE_WIDGET_PREVIEW_PIZZAGNA.pizzagna.configuration };
        expectedPreviewPizzagna.table.properties.configuration.columns = [{
            id: "column1",
            label: $localize`No`,
            isActive: true,
            dataFieldIds: ["position"],
            formatterId: "RawFormatterComponent",
        }];
        (component.form.get("columns") as FormArray).push(formBuilder.control(mockedColumnsFormValue));
        tick(0);

        expect(service.updatePreview).toHaveBeenCalledWith(expectedPreviewPizzagna);
    }));

});
