import { FormBuilder, FormGroup } from "@angular/forms";
import { EventBus, IEvent } from "@solarwinds/nova-bits";
import get from "lodash/get";

import { DynamicComponentCreator } from "../../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { IPizzagnaLayer, IProperties } from "../../../../../types";
import { PreviewService } from "../../../preview.service";
import { BaseConverter } from "../../base-converter";

import { TitleAndDescriptionConverterService } from "./title-and-description-converter.service";

describe("TitleAndDescriptionConverterService", () => {
    let service: TitleAndDescriptionConverterService;
    let preview: IPizzagnaLayer;
    let eventBus: EventBus<IEvent>;
    let pizzagnaService: PizzagnaService;
    let previewService: PreviewService;
    let form: FormGroup;
    let dynamicComponentCreator: DynamicComponentCreator;

    beforeEach(() => {
        eventBus = new EventBus();
        previewService = new PreviewService();
        dynamicComponentCreator = new DynamicComponentCreator();
        pizzagnaService = new PizzagnaService(eventBus, dynamicComponentCreator);
        service = new TitleAndDescriptionConverterService(eventBus, previewService, pizzagnaService);
        const formBuilder = new FormBuilder();
        form = formBuilder.group({
            title: "",
            subtitle: "",
            description: "",
            url: "",
        });
        preview = {
            header: {
                // @ts-ignore: Suppressed for test purposes
                properties: null,
            },
        };

        service.updatePreview(preview);
        service.updateFormPizzagna({});
    });

    it("should create", () => {
        expect(service).toBeTruthy();
    });

    describe("buildForm > ", () => {
        it("should update the form pizzagna based on the preview", () => {
            const testValue: IProperties = {
                title: "testTitle",
                subtitle: "testSubtitle",
                description: "testDesc",
                url: "testUrl",
                collapsible: false,
            };
            preview.header.properties = testValue;
            service.buildForm();
            expect(get(pizzagnaService.pizzagna, TitleAndDescriptionConverterService.PROPERTIES_PATH)).toEqual(testValue);
        });
    });

    describe("toPreview > ", () => {
        it("should subscribe to form value changes and update the preview accordingly", () => {
            const oldValue: IProperties = {
                title: "oldTitle",
                subtitle: "oldSubtitle",
                description: "oldDesc",
                url: "oldUrl",
            };
            const newValue: IProperties = {
                title: "newTitle",
                subtitle: "newSubtitle",
                description: "newDesc",
                url: "newUrl",
            };
            preview.header.properties = oldValue;
            service.buildForm();

            service.toPreview(form);
            form.setValue(newValue);
            expect(service.getPreview().header.properties).toEqual(newValue);
        });
    });

    describe("ngAfterViewInit", () => {
        it("should call super ngAfterViewInit", () => {
            const spy = spyOn(BaseConverter.prototype, "ngAfterViewInit");
            service.ngAfterViewInit();
            expect(spy).toHaveBeenCalled();
        });
    });


    describe("ngOnDestroy", () => {
        it("should unsubscribe from form value changes", () => {
            const oldValue: IProperties = {
                title: "oldTitle",
                subtitle: "oldSubtitle",
                description: "oldDesc",
            };
            const newValue: IProperties = {
                title: "newTitle",
                subtitle: "newSubtitle",
                description: "newDesc",
                url: "newUrl",
            };
            preview.header.properties = oldValue;
            service.buildForm();

            service.toPreview(form);
            service.ngOnDestroy();
            form.setValue(newValue);
            expect(service.getPreview().header.properties).toEqual(oldValue);
        });
    });
});
