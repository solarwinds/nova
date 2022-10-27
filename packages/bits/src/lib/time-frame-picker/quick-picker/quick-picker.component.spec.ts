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
                expect(quickPicker.presetKeys).toBe(
                    quickPicker.presetKeysOrder
                ); // it returns the same reference indeed
            });
            it("returns all keys if presetKeysOrder is not defined", () => {
                expect(quickPicker.presetKeys.sort()).toEqual([
                    "75",
                    "95",
                    "99",
                ]);
            });
        });
    });
});
