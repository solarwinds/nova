import { FormBuilder } from "@angular/forms";
import { TimeframeService } from "@nova-ui/bits";

import { IPizzagnaLayer, WellKnownProviders } from "../../../../types";
import { IConfiguratorForm } from "../types";

import { TimeseriesMetadataConverterService } from "./timeseries-metadata-converter.service";

describe("TimeseriesPresentationConverterService", () => {
    // TODO: uncomment when API will be stable
    // let service: TimeseriesMetadataConverterService;
    // let mockConfiguratorForm: IConfiguratorForm;
    // let emptyConfiguratorForm: IConfiguratorForm;
    // let mockPreview: IPizzagnaLayer;
    // let timeframeService: TimeframeService;
    //
    // beforeEach(() => {
    //     timeframeService = new TimeframeService((translate: string) => translate);
    //     service = new TimeseriesMetadataConverterService(timeframeService);
    //     const formBuilder = new FormBuilder();
    //     mockConfiguratorForm = {
    //         formGroup: formBuilder.group({
    //             presentation: formBuilder.group({
    //                 titleAndDescription: formBuilder.group({
    //                     title: formBuilder.control("Test Title"),
    //                     subtitle: formBuilder.control("Test Subtitle"),
    //                 }),
    //                 [WellKnownProviders.DataSource]: {
    //                     providerId: "testId",
    //                 },
    //                 timeseriesMetadata: formBuilder.group({
    //                     startingTimespan: formBuilder.control({
    //                         id: "last7Days",
    //                         name: "Last 7 days",
    //                     }),
    //                     legendPlacement: formBuilder.control("Right"),
    //                     leftAxisLabel: formBuilder.control("Test Label"),
    //                 }),
    //             }),
    //         }),
    //     } as unknown as IConfiguratorForm;
    //     emptyConfiguratorForm = {
    //         formGroup: formBuilder.group({
    //             presentation: formBuilder.group({
    //                 titleAndDescription: formBuilder.group({
    //                     title: formBuilder.control(""),
    //                     subtitle: formBuilder.control(""),
    //                 }),
    //                 [WellKnownProviders.DataSource]: {
    //                     providerId: "",
    //                 },
    //                 timeseriesMetadata: formBuilder.group({
    //                     startingTimespan: formBuilder.control({
    //                         id: "",
    //                         name: "",
    //                     }),
    //                     legendPlacement: formBuilder.control(""),
    //                     leftAxisLabel: formBuilder.control(""),
    //                 }),
    //             }),
    //         }),
    //     } as IConfiguratorForm;
    //     mockPreview = {
    //         "/": {
    //             providers: {
    //                 [WellKnownProviders.DataSource]: {
    //                     providerId: "testId",
    //                 },
    //             },
    //         },
    //         header: {
    //             properties: {
    //                 title: "Test Title",
    //                 subtitle: "Test Subtitle",
    //             },
    //         },
    //         chart: {
    //             properties: {
    //                 configuration: {
    //                     leftAxisLabel: "Test Label",
    //                     legendPlacement: "Right",
    //                 },
    //             },
    //         },
    //         timeframeSelection: {
    //             properties: {
    //                 timeframe: {
    //                     selectedPresetId: "last7Days",
    //                 },
    //             },
    //         },
    //     };
    // });
    //
    // it("should create", () => {
    //     expect(service).toBeTruthy();
    // });
    //
    // describe("toForm > ", () => {
    //     it("should return the form with metadata transformations", () => {
    //         const metadataForm = service.toForm(mockPreview, emptyConfiguratorForm).formGroup.value.presentation.timeseriesMetadata;
    //         const metadataMock = mockConfiguratorForm.formGroup.value.presentation.timeseriesMetadata;
    //
    //         expect(metadataForm).toEqual(metadataMock);
    //     });
    //
    //     it("should append the available timeframe presets to the form pizzagna", () => {
    //         const timeSpans = Object.keys(timeframeService.currentPresets)
    //             .map(k => ({ id: k, name: timeframeService.currentPresets[k].name }));
    //         expect(service.toForm(mockPreview, emptyConfiguratorForm).pizzagna.data.timeseriesMetadata.properties.timeSpans).toEqual(timeSpans);
    //     });
    // });
    //
    // describe("toPreview > ", () => {
    //     it("should return the preview IPizzagnaLayer", () => {
    //         const transformedPreview = service.toPreview(mockConfiguratorForm, {});
    //
    //         expect(transformedPreview.timeframeSelection).toEqual(mockPreview.timeframeSelection);
    //         expect(transformedPreview.chart).toEqual(mockPreview.chart);
    //     });
    // });
});
