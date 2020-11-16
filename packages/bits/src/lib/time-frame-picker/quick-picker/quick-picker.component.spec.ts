import { ChangeDetectorRef } from "@angular/core";

import { QuickPickerComponent } from "./quick-picker.component";

describe("components >", () => {
    describe("quick picker >", () => {
        let quickPicker: QuickPickerComponent;

        beforeEach(() => {
            quickPicker = new QuickPickerComponent(<ChangeDetectorRef>{});
        });

        describe("if selectedPreset is defined", () => {
            beforeEach(() => {
                quickPicker.presets = {
                    "95": {
                        name: "99-th percentile",
                    },
                    "99": {
                        name: "95-th percentile",
                    },
                };
                quickPicker.selectedPreset = "99";
            });
            it("isPresetSelected returns true for selected preset", () => {
                expect(quickPicker.isPresetSelected("99")).toBe(true);
            });
            it("isPresetSelected returns false for others preset", () => {
                expect(quickPicker.isPresetSelected("95")).toBe(false);
            });
            it("isPresetSelected returns false for random non-existent preset", () => {
                expect(quickPicker.isPresetSelected("9")).toBe(false);
            });
        });

        describe("if selectedPreset is not defined", () => {
            beforeEach(() => {
                quickPicker.presets = {
                    "95": {
                        name: "99-th percentile",
                    },
                    "99": {
                        name: "95-th percentile",
                    },
                };
            });
            it("isPresetSelected returns false for any preset", () => {
                expect(quickPicker.isPresetSelected("99")).toBe(false);
            });
            it("isPresetSelected returns false for others preset", () => {
                expect(quickPicker.isPresetSelected("95")).toBe(false);
            });
            it("isPresetSelected returns false for random non-existent preset", () => {
                expect(quickPicker.isPresetSelected("9")).toBe(false);
            });
        });

        describe("getter presetKeys", () => {
            beforeEach(() => {
                quickPicker.presets = {
                    "75": {
                        name: "75-th percentile",
                    },
                    "95": {
                        name: "99-th percentile",
                    },
                    "99": {
                        name: "95-th percentile",
                    },
                };
            });
            it("respects presetKeysOrder if it is defined", () => {
                quickPicker.presetKeysOrder = ["95", "75", "99"];
                expect(quickPicker.presetKeys).toBe(quickPicker.presetKeysOrder); // it returns the same reference indeed
            });
            it("returns all keys if presetKeysOrder is not defined", () => {
                expect(quickPicker.presetKeys.sort()).toEqual(["75", "95", "99"]);
            });
        });


    });
});
