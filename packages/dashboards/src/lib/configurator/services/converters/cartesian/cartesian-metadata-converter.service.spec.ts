// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

/* eslint-disable @typescript-eslint/no-unused-vars */
// import { FormBuilder } from "@angular/forms";

// import { TimeframeService } from "@nova-ui/bits";

// import { IPizzagnaLayer, WellKnownProviders } from "../../../../types";
// import { IConfiguratorForm } from "../types";
// import { CartesianMetadataConverterService } from "./cartesian-metadata-converter.service";
/* eslint-enable @typescript-eslint/no-unused-vars */

// describe("CartesianPresentationConverterService", () => {
//     // TODO: uncomment when API will be stable
//     // let service: CartesianMetadataConverterService;
//     // let mockConfiguratorForm: IConfiguratorForm;
//     // let emptyConfiguratorForm: IConfiguratorForm;
//     // let mockPreview: IPizzagnaLayer;
//     // let timeframeService: TimeframeService;
//     //
//     // beforeEach(() => {
//     //     timeframeService = new TimeframeService((translate: string) => translate);
//     //     service = new CartesianMetadataConverterService(timeframeService);
//     //     const formBuilder = new FormBuilder();
//     //     mockConfiguratorForm = {
//     //         formGroup: formBuilder.group({
//     //             presentation: formBuilder.group({
//     //                 titleAndDescription: formBuilder.group({
//     //                     title: formBuilder.control("Test Title"),
//     //                     subtitle: formBuilder.control("Test Subtitle"),
//     //                 }),
//     //                 [WellKnownProviders.DataSource]: {
//     //                     providerId: "testId",
//     //                 },
//     //                 cartesianMetadata: formBuilder.group({
//     //                     startingTimespan: formBuilder.control({
//     //                         id: "last7Days",
//     //                         name: "Last 7 days",
//     //                     }),
//     //                     legendPlacement: formBuilder.control("Right"),
//     //                     leftAxisLabel: formBuilder.control("Test Label"),
//     //                 }),
//     //             }),
//     //         }),
//     //     } as unknown as IConfiguratorForm;
//     //     emptyConfiguratorForm = {
//     //         formGroup: formBuilder.group({
//     //             presentation: formBuilder.group({
//     //                 titleAndDescription: formBuilder.group({
//     //                     title: formBuilder.control(""),
//     //                     subtitle: formBuilder.control(""),
//     //                 }),
//     //                 [WellKnownProviders.DataSource]: {
//     //                     providerId: "",
//     //                 },
//     //                 cartesianMetadata: formBuilder.group({
//     //                     startingTimespan: formBuilder.control({
//     //                         id: "",
//     //                         name: "",
//     //                     }),
//     //                     legendPlacement: formBuilder.control(""),
//     //                     leftAxisLabel: formBuilder.control(""),
//     //                 }),
//     //             }),
//     //         }),
//     //     } as IConfiguratorForm;
//     //     mockPreview = {
//     //         "/": {
//     //             providers: {
//     //                 [WellKnownProviders.DataSource]: {
//     //                     providerId: "testId",
//     //                 },
//     //             },
//     //         },
//     //         header: {
//     //             properties: {
//     //                 title: "Test Title",
//     //                 subtitle: "Test Subtitle",
//     //             },
//     //         },
//     //         chart: {
//     //             properties: {
//     //                 configuration: {
//     //                     leftAxisLabel: "Test Label",
//     //                     legendPlacement: "Right",
//     //                 },
//     //             },
//     //         },
//     //         timeframeSelection: {
//     //             properties: {
//     //                 timeframe: {
//     //                     selectedPresetId: "last7Days",
//     //                 },
//     //             },
//     //         },
//     //     };
//     // });
//     //
//     // it("should create", () => {
//     //     expect(service).toBeTruthy();
//     // });
//     //
//     // describe("toForm > ", () => {
//     //     it("should return the form with metadata transformations", () => {
//     //         const metadataForm = service.toForm(mockPreview, emptyConfiguratorForm).formGroup.value.presentation.cartesianMetadata;
//     //         const metadataMock = mockConfiguratorForm.formGroup.value.presentation.cartesianMetadata;
//     //
//     //         expect(metadataForm).toEqual(metadataMock);
//     //     });
//     //
//     //     it("should append the available timeframe presets to the form pizzagna", () => {
//     //         const timeSpans = Object.keys(timeframeService.currentPresets)
//     //             .map(k => ({ id: k, name: timeframeService.currentPresets[k].name }));
//     //         expect(service.toForm(mockPreview, emptyConfiguratorForm).pizzagna.data.cartesianMetadata.properties.timeSpans).toEqual(timeSpans);
//     //     });
//     // });
//     //
//     // describe("toPreview > ", () => {
//     //     it("should return the preview IPizzagnaLayer", () => {
//     //         const transformedPreview = service.toPreview(mockConfiguratorForm, {});
//     //
//     //         expect(transformedPreview.timeframeSelection).toEqual(mockPreview.timeframeSelection);
//     //         expect(transformedPreview.chart).toEqual(mockPreview.chart);
//     //     });
//     // });
// });
