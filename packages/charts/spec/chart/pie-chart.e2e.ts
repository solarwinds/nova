import { Animations, Helpers } from "@nova-ui/bits/sdk/atoms/helpers";

import { RadialSeriesAtom } from "./atoms/radial-series.atom";
import { PieChartTestPage } from "./pie-chart-test.po";

describe("Pie chart", async () => {
    const page = new PieChartTestPage();

    beforeAll(async () => {
        await Helpers.prepareBrowser("chart-types/pie-and-donut/pie-test");
        await Helpers.disableCSSAnimations(
            Animations.TRANSITIONS_AND_ANIMATIONS
        );
    });

    it("should be displayed", async () => {
        await expect(await page.chart.isPresent()).toBe(true);
        await expect(await page.chart.isDisplayed()).toBe(true);
    });

    it("should highlight active segments and fade inactive ones", async () => {
        const series = await page.chart.getAllVisibleDataSeries(
            RadialSeriesAtom
        );
        await series?.[0].getElement().click();
        await expect(await series?.[0].getOpacity()).toBe(1);
        await expect(await series?.[1].getOpacity()).toBe(0.1);
        await expect(await series?.[2].getOpacity()).toBe(0.1);
        await expect(await series?.[3].getOpacity()).toBe(0.1);
        // Checking that the first segment, if not active, fades as well
        await series?.[1].getElement().click();
        await expect(await series?.[0].getOpacity()).toBe(0.1);
    });
});
