// import { async, ComponentFixture, TestBed } from "@angular/core/testing";
//
// import { IFormatterDefinition } from "../../../../../../../components/types";
// import { NuiDashboardsModule } from "../../../../../../../dashboards.module";
// import { ProviderRegistryService } from "../../../../../../../services/provider-registry.service";
//
// import { PresentationConfigurationV2Component } from "./presentation-configuration-v2.component";
//
// describe("PresentationConfigurationComponent", () => {
//     let component: PresentationConfigurationV2Component;
//     let fixture: ComponentFixture<PresentationConfigurationV2Component>;
//     const rawFormatter: IFormatterDefinition = {
//         componentType: "RawFormatterComponent",
//         label: $localize`No Formatter`,
//         dataTypes: {
//             // @ts-ignore: Suppressed for test purposes
//             value: null,
//         },
//     };
//     const linkFormatter: IFormatterDefinition = {
//         componentType: "LinkFormatterComponent",
//         label: $localize`Link`,
//         configurationComponent: "LinkConfiguratorComponent",
//         dataTypes: {
//             value: "label",
//             link: "link",
//         },
//     };
//
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [NuiDashboardsModule],
//             providers: [
//                 ProviderRegistryService,
//             ],
//         }).compileComponents();
//     }));
//
//     beforeEach(() => {
//         fixture = TestBed.createComponent(PresentationConfigurationV2Component);
//         component = fixture.componentInstance;
//     });
//
//     it("should create", () => {
//         expect(component).toBeTruthy();
//     });
//
//     describe("should filter formatters based on the dataTypes provided in the dataFields input propriety", () => {
//         // multiple datasets for the same test
//         [
//             {
//                 providedDataFields: [
//                     { id: "position", label: $localize`Position`, dataType: "number" },
//                 ],
//                 expectedFormatters: [rawFormatter],
//             },
//             {
//                 providedDataFields: [
//                     { id: "position", label: $localize`Position`, dataType: "number" },
//                     { id: "firstUrlLabel", label: $localize`First Url Label`, dataType: "label" },
//                 ],
//                 expectedFormatters: [rawFormatter, linkFormatter],
//             },
//         ].forEach(testData => {
//             const dataTypes = testData.providedDataFields.map(df => df.dataType);
//             it(`- case ${dataTypes}`, () => {
//                 component.formatters = [rawFormatter, linkFormatter];
//                 component.dataFields = testData.providedDataFields;
//
//                 fixture.detectChanges();
//
//                 expect(component.formatters).toEqual(testData.expectedFormatters);
//             });
//         });
//     });
//
//     describe("createFormatterConfigurator", () => {
//         it("clears formatter datafields on componentType change", () => {
//             component.formatters = [rawFormatter, linkFormatter];
//             component.formatter = {
//                 componentType: rawFormatter.componentType,
//                 properties: {
//                     dataFieldIds: {
//                         value: "john",
//                     },
//                 },
//             };
//
//             component.ngOnInit();
//
//             expect(component.formatterConfiguratorProps.formatter?.properties?.dataFieldIds?.value).toEqual("john");
//             component.form.controls["componentType"].setValue(linkFormatter.componentType);
//
//             expect(component.formatterConfiguratorProps.formatter?.properties?.dataFieldIds?.value).toBeFalsy(); // null
//         });
//     });
// });
