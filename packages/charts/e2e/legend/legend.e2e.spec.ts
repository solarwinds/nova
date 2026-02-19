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

import {
    Atom,
    test,
    expect,
    Helpers,
} from "@nova-ui/bits/sdk/atoms-playwright";

import { LegendSeriesAtom } from "./legend-series.atom";
import { LegendAtom } from "./legend.atom";

test.describe("Legend", () => {
    let basicLegendDefault: LegendAtom;
    let basicLegendInteractive: LegendAtom;
    let richLegendDefault: LegendAtom;
    let richLegendInteractive: LegendAtom;
    let richLegendWithProjectedDescription: LegendAtom;


    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("advanced-usage/legend/test", page);
        basicLegendDefault = Atom.find<LegendAtom>(
            LegendAtom,
            "basic-tile-legend-default-state"
        );
        basicLegendInteractive = Atom.find<LegendAtom>(
            LegendAtom,
            "basic-tile-legend-interactive-state"
        );
        richLegendDefault = Atom.find<LegendAtom>(
            LegendAtom,
            "rich-tile-legend-default-state"
        );
        richLegendInteractive = Atom.find<LegendAtom>(
            LegendAtom,
            "rich-tile-interactive-legend-test"
        );
        richLegendWithProjectedDescription = Atom.find<LegendAtom>(
            LegendAtom,
            "rich-tile-legend-with-projected-description-default-state"
        );
        await basicLegendDefault.toBeVisible();

    });

    test.describe("basic tile legend", () => {
        test.describe("default state", () => {
            let series: LegendSeriesAtom;

            test.beforeEach(async () => {
                series = basicLegendDefault.getSeriesByIndex(0);
            });

            test("should be displayed", async () => {
                await basicLegendDefault.toBeVisible();
            });

            test("should display the correct primary description", async () => {
                expect(await series.getPrimaryDescriptionText()).toEqual(
                    "Primary Description 1"
                );
            });

            test("should not have a rich tile", async () => {
                await expect(series.richTile.getLocator()).toHaveCount(0);
            });

            test("shouldn't show checkbox on tile hover", async () => {
                await expect(series.getLocator().locator(".nui-legend-series__checkbox-wrapper")).toBeHidden();
                await series.hoverTile();
                await expect(series.getLocator().locator(".nui-legend-series__checkbox-wrapper")).toBeHidden();
            });
        });

        test.describe("interactive", () => {
            let firstInteractiveSeries: LegendSeriesAtom;
            let secondInteractiveSeries: LegendSeriesAtom;

            test.beforeEach(async () => {
                firstInteractiveSeries =
                    basicLegendInteractive.getSeriesByIndex(0);
                secondInteractiveSeries =
                    basicLegendInteractive.getSeriesByIndex(1);
            });

            test("series should show checkbox on tile hover", async () => {
                await expect(firstInteractiveSeries.getLocator().locator(".nui-legend-series__checkbox-wrapper")).toBeHidden();
                await firstInteractiveSeries.hoverTile();
                await expect(firstInteractiveSeries.getLocator().locator(".nui-legend-series__checkbox-wrapper")).toBeVisible();
            });

            test("series should not show checkbox on series hover", async () => {
                await expect(firstInteractiveSeries.getLocator().locator(".nui-legend-series__checkbox-wrapper")).toBeHidden();
                await firstInteractiveSeries.hover();
                await expect(firstInteractiveSeries.getLocator().locator(".nui-legend-series__checkbox-wrapper")).toBeHidden();
            });

            test("series should not show its tile on tile hover", async () => {
                await expect(firstInteractiveSeries.getLocator().locator(".nui-legend-series__tile")).toBeVisible();
                await firstInteractiveSeries.hoverTile();
                await expect(firstInteractiveSeries.getLocator().locator(".nui-legend-series__tile")).toBeHidden();
            });

            test("series should show unchecked checkbox instead of tile", async () => {
                expect(await firstInteractiveSeries.isCheckboxChecked()).toEqual(true);
                await firstInteractiveSeries.clickTile();
                await basicLegendDefault.hover();
                expect(await firstInteractiveSeries.isCheckboxChecked()).toEqual(false);
                await expect(firstInteractiveSeries.getLocator().locator(".nui-legend-series__tile")).toBeHidden();
            });

            test("entire series should not be deemphasized when series is deselected", async () => {
                expect(await firstInteractiveSeries.isDeemphasized()).toEqual(false);
                await firstInteractiveSeries.clickTile();
                await basicLegendDefault.hover();
                expect(await firstInteractiveSeries.isDeemphasized()).toEqual(false);
            });

            test("series description should be deemphasized when series is deselected", async () => {
                expect(await firstInteractiveSeries.isDescriptionDeemphasized()).toEqual(false);
                await firstInteractiveSeries.clickTile();
                await basicLegendDefault.hover();
                expect(await firstInteractiveSeries.isDescriptionDeemphasized()).toEqual(true);
            });

            test("entire series should be deemphasized when another series is hovered", async () => {
                expect(await secondInteractiveSeries.isDeemphasized()).toEqual(false);
                await firstInteractiveSeries.hover();
                expect(await secondInteractiveSeries.isDeemphasized()).toEqual(true);
            });
        });
    });

    test.describe("rich tile legend", () => {
        test.describe("default state", () => {
            let series: LegendSeriesAtom;
            let seriesWithProjectedDescription: LegendSeriesAtom;

            test.beforeEach(async () => {
                series = richLegendDefault.getSeriesByIndex(0);
                seriesWithProjectedDescription =
                    richLegendWithProjectedDescription.getSeriesByIndex(0);
            });

            test(`should be displayed`, async () => {
                await richLegendDefault.toBeVisible();
            });

            test(`should display the correct primary description`, async () => {
                expect(await series.getPrimaryDescriptionText()).toEqual(
                    "Primary Description 1"
                );
            });

            test(`should display the correct secondary description`, async () => {
                expect(
                    await series.getSecondaryDescriptionText()
                ).toEqual("Secondary Description 1");
            });

            test(`should display correct descriptions when they're set via content projection`, async () => {
                expect(
                    (
                        await seriesWithProjectedDescription.getProjectedDescriptionText()
                    ).replace(/\s/g, "")
                ).toEqual(`PrimaryDescription1SecondaryDescription1`);
            });

            test(`should display the correct value when it's set via content projection`, async () => {
                expect(
                    await seriesWithProjectedDescription.richTile.getValue()
                ).toEqual("15.5");
            });

            test(`should display the correct unit label when it's set via content projection`, async () => {
                expect(
                    await seriesWithProjectedDescription.richTile.getUnitLabel()
                ).toEqual("Kbps");
            });

            test(`should display the correct value`, async () => {
                expect(await series.richTile.getValue()).toEqual("15.5");
            });

            test(`should display the correct unit label`, async () => {
                expect(await series.richTile.getUnitLabel()).toEqual(
                    "Kbps"
                );
            });

            test("should not show checkbox on hover", async () => {
                await expect(series.getLocator().locator(".nui-legend-series__checkbox-wrapper")).toBeHidden();
                await series.hoverTile();
                await expect(series.getLocator().locator(".nui-legend-series__checkbox-wrapper")).toBeHidden();
            });
        });

        test.describe("interactive", () => {
            let firstInteractiveSeries: LegendSeriesAtom;
            let secondInteractiveSeries: LegendSeriesAtom;

            test.beforeEach(async () => {
                firstInteractiveSeries =
                    richLegendInteractive.getSeriesByIndex(0);
                secondInteractiveSeries =
                    richLegendInteractive.getSeriesByIndex(1);
            });

            test("should show checkbox on tile hover", async () => {
                await expect(firstInteractiveSeries.getLocator().locator(".nui-legend-series__checkbox-wrapper")).toBeHidden();
                await firstInteractiveSeries.hoverTile();
                await expect(firstInteractiveSeries.getLocator().locator(".nui-legend-series__checkbox-wrapper")).toBeVisible();
            });

            test("should not show marker or icon on tile hover", async () => {
                await expect(firstInteractiveSeries.richTile.getLocator().locator(".nui-rich-legend-tile__point-marker")).toBeVisible();
                await expect(firstInteractiveSeries.richTile.getLocator().locator(".nui-rich-legend-tile__icon")).toBeVisible();
                await firstInteractiveSeries.hoverTile();
                await expect(firstInteractiveSeries.richTile.getLocator().locator(".nui-rich-legend-tile__point-marker")).toBeHidden();
                await expect(firstInteractiveSeries.richTile.getLocator().locator(".nui-rich-legend-tile__icon")).toBeHidden();
            });

            test("should show unchecked checkbox instead of marker or icon", async () => {
                expect(await firstInteractiveSeries.isCheckboxChecked()).toEqual(true);
                await firstInteractiveSeries.clickTile();
                await secondInteractiveSeries.hover();
                expect(await firstInteractiveSeries.isCheckboxChecked()).toEqual(false);
                await expect(firstInteractiveSeries.richTile.getLocator().locator(".nui-rich-legend-tile__point-marker")).toBeHidden();
                await expect(firstInteractiveSeries.richTile.getLocator().locator(".nui-rich-legend-tile__icon")).toBeHidden();
            });

            test("series description should be deemphasized when series is deselected", async () => {
                expect(await firstInteractiveSeries.isDescriptionDeemphasized()).toEqual(false);
                await firstInteractiveSeries.clickTile();
                await secondInteractiveSeries.hover();
                expect(await firstInteractiveSeries.isDescriptionDeemphasized()).toEqual(true);
            });
        });
    });
});
