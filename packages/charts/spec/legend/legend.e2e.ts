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

import { Atom } from "@nova-ui/bits/sdk/atoms";
import { Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { LegendSeriesAtom } from "./legend-series.atom";
import { LegendAtom } from "./legend.atom";

describe("Legend", () => {
    let basicLegendDefault: LegendAtom;
    let basicLegendInteractive: LegendAtom;
    let richLegendDefault: LegendAtom;
    let richLegendInteractive: LegendAtom;
    let richLegendWithProjectedDescription: LegendAtom;

    const pageRefresh = async () =>
        await Helpers.prepareBrowser("advanced-usage/legend/test");

    beforeAll(async () => {
        await pageRefresh();
        basicLegendDefault = Atom.find(
            LegendAtom,
            "basic-tile-legend-default-state"
        );
        basicLegendInteractive = Atom.find(
            LegendAtom,
            "basic-tile-legend-interactive-state"
        );
        richLegendDefault = Atom.find(
            LegendAtom,
            "rich-tile-legend-default-state"
        );
        richLegendInteractive = Atom.find(
            LegendAtom,
            "rich-tile-interactive-legend-test"
        );
        richLegendWithProjectedDescription = Atom.find(
            LegendAtom,
            "rich-tile-legend-with-projected-description-default-state"
        );
    });

    describe("basic tile legend", () => {
        describe("default state", () => {
            let series: LegendSeriesAtom;

            beforeAll(async () => {
                series = basicLegendDefault.getSeriesByIndex(0);
            });

            it("should be displayed", async () => {
                await expect(await basicLegendDefault.isDisplayed()).toEqual(
                    true
                );
            });

            it("should display the correct primary description", async () => {
                await expect(await series.getPrimaryDescriptionText()).toEqual(
                    "Primary Description 1"
                );
            });

            it("should not have a rich tile", async () => {
                await expect(await series.richTile.isPresent()).toEqual(false);
            });

            it("shouldn't show checkbox on tile hover", async () => {
                await expect(await series.isCheckboxVisible()).toEqual(false);
                await series.hoverTile();
                await expect(await series.isCheckboxVisible()).toEqual(false);
            });
        });

        describe("interactive", () => {
            let firstInteractiveSeries: LegendSeriesAtom;
            let secondInteractiveSeries: LegendSeriesAtom;

            beforeAll(async () => {
                firstInteractiveSeries =
                    basicLegendInteractive.getSeriesByIndex(0);
                secondInteractiveSeries =
                    basicLegendInteractive.getSeriesByIndex(1);
            });

            beforeEach(async () => {
                await pageRefresh();
            });

            it("series should show checkbox on tile hover", async () => {
                await expect(
                    await firstInteractiveSeries.isCheckboxVisible()
                ).toEqual(false);
                await firstInteractiveSeries.hoverTile();
                await expect(
                    await firstInteractiveSeries.isCheckboxVisible()
                ).toEqual(true);
            });

            it("series should not show checkbox on series hover", async () => {
                await expect(
                    await firstInteractiveSeries.isCheckboxVisible()
                ).toEqual(false);
                await firstInteractiveSeries.hover();
                await expect(
                    await firstInteractiveSeries.isCheckboxVisible()
                ).toEqual(false);
            });

            it("series should not show its tile on tile hover", async () => {
                await expect(
                    await firstInteractiveSeries.isTileVisible()
                ).toEqual(true);
                await firstInteractiveSeries.hoverTile();
                await expect(
                    await firstInteractiveSeries.isTileVisible()
                ).toEqual(false);
            });

            it("series should show unchecked checkbox instead of tile", async () => {
                await expect(
                    await firstInteractiveSeries.isCheckboxChecked()
                ).toEqual(true);
                await firstInteractiveSeries.clickTile();
                await basicLegendDefault.hover();
                await expect(
                    await firstInteractiveSeries.isCheckboxChecked()
                ).toEqual(false);
                await expect(
                    await firstInteractiveSeries.isTileVisible()
                ).toEqual(false);
            });

            it("entire series should not be deemphasized when series is deselected", async () => {
                await expect(
                    await firstInteractiveSeries.isDeemphasized()
                ).toEqual(false);
                await firstInteractiveSeries.clickTile();
                await basicLegendDefault.hover();
                await expect(
                    await firstInteractiveSeries.isDeemphasized()
                ).toEqual(false);
            });

            it("series description should be deemphasized when series is deselected", async () => {
                await expect(
                    await firstInteractiveSeries.isDescriptionDeemphasized()
                ).toEqual(false);
                await firstInteractiveSeries.clickTile();
                await basicLegendDefault.hover();
                await expect(
                    await firstInteractiveSeries.isDescriptionDeemphasized()
                ).toEqual(true);
            });

            it("entire series should be deemphasized when another series is hovered", async () => {
                await expect(
                    await secondInteractiveSeries.isDeemphasized()
                ).toEqual(false);
                await firstInteractiveSeries.hover();
                await expect(
                    await secondInteractiveSeries.isDeemphasized()
                ).toEqual(true);
            });
        });
    });

    describe("rich tile legend", () => {
        describe("default state", () => {
            let series: LegendSeriesAtom;
            let seriesWithProjectedDescription: LegendSeriesAtom;

            beforeAll(async () => {
                series = richLegendDefault.getSeriesByIndex(0);
                seriesWithProjectedDescription =
                    richLegendWithProjectedDescription.getSeriesByIndex(0);
            });

            it(`should be displayed`, async () => {
                await expect(await richLegendDefault.isDisplayed()).toEqual(
                    true
                );
            });

            it(`should display the correct primary description`, async () => {
                await expect(await series.getPrimaryDescriptionText()).toEqual(
                    "Primary Description 1"
                );
            });

            it(`should display the correct secondary description`, async () => {
                await expect(
                    await series.getSecondaryDescriptionText()
                ).toEqual("Secondary Description 1");
            });

            it(`should display correct descriptions when they're set via content projection`, async () => {
                await expect(
                    (
                        await seriesWithProjectedDescription.getProjectedDescriptionText()
                    ).replace(/\s/g, "")
                ).toEqual(`PrimaryDescription1SecondaryDescription1`);
            });

            it(`should display the correct value when it's set via content projection`, async () => {
                await expect(
                    await seriesWithProjectedDescription.richTile.getValue()
                ).toEqual("15.5");
            });

            it(`should display the correct unit label when it's set via content projection`, async () => {
                await expect(
                    await seriesWithProjectedDescription.richTile.getUnitLabel()
                ).toEqual("Kbps");
            });

            it(`should display the correct value`, async () => {
                await expect(await series.richTile.getValue()).toEqual("15.5");
            });

            it(`should display the correct unit label`, async () => {
                await expect(await series.richTile.getUnitLabel()).toEqual(
                    "Kbps"
                );
            });

            it("should not show checkbox on hover", async () => {
                await expect(await series.isCheckboxVisible()).toEqual(false);
                await series.hoverTile();
                await expect(await series.isCheckboxVisible()).toEqual(false);
            });
        });

        describe("interactive", () => {
            let firstInteractiveSeries: LegendSeriesAtom;
            let secondInteractiveSeries: LegendSeriesAtom;

            beforeAll(async () => {
                firstInteractiveSeries =
                    richLegendInteractive.getSeriesByIndex(0);
                secondInteractiveSeries =
                    richLegendInteractive.getSeriesByIndex(1);
            });

            beforeEach(async () => {
                await pageRefresh();
            });

            it("should show checkbox on tile hover", async () => {
                await expect(
                    await firstInteractiveSeries.isCheckboxVisible()
                ).toEqual(false);
                await firstInteractiveSeries.hoverTile();
                await expect(
                    await firstInteractiveSeries.isCheckboxVisible()
                ).toEqual(true);
            });

            it("should not show marker or icon on tile hover", async () => {
                await expect(
                    await firstInteractiveSeries.richTile.isMarkerVisible()
                ).toEqual(true);
                await expect(
                    await firstInteractiveSeries.richTile.isIconVisible()
                ).toEqual(true);
                await firstInteractiveSeries.hoverTile();
                await expect(
                    await firstInteractiveSeries.richTile.isMarkerVisible()
                ).toEqual(false);
                await expect(
                    await firstInteractiveSeries.richTile.isIconVisible()
                ).toEqual(false);
            });

            it("should show unchecked checkbox instead of marker or icon", async () => {
                await expect(
                    await firstInteractiveSeries.isCheckboxChecked()
                ).toEqual(true);
                await firstInteractiveSeries.clickTile();
                await secondInteractiveSeries.hover();
                await expect(
                    await firstInteractiveSeries.isCheckboxChecked()
                ).toEqual(false);
                await expect(
                    await firstInteractiveSeries.richTile.isMarkerVisible()
                ).toEqual(false);
                await expect(
                    await firstInteractiveSeries.richTile.isIconVisible()
                ).toEqual(false);
            });

            it("series description should be deemphasized when series is deselected", async () => {
                await expect(
                    await firstInteractiveSeries.isDescriptionDeemphasized()
                ).toEqual(false);
                await firstInteractiveSeries.clickTile();
                await secondInteractiveSeries.hover();
                await expect(
                    await firstInteractiveSeries.isDescriptionDeemphasized()
                ).toEqual(true);
            });
        });
    });
});
