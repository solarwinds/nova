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

import { Atom, Camera, Helpers, test } from "@nova-ui/bits/sdk/atoms-playwright";

import { DashboardAtom } from "./dashboard.atom";

const name: string = "Time Series Widget";
const BAR_CHART_WIDGET_TITLE: string = "Bar Chart with Time Interval Scale";

test.describe(`Visual tests: Dashboards - ${name}`, () => {
    let camera: Camera;
    let dashboard: DashboardAtom;

    test.beforeEach(async ({ page }) => {
        await Helpers.prepareBrowser("test/timeseries", page);

        dashboard = Atom.findIn<DashboardAtom>(
            DashboardAtom,
            page.locator(`.${DashboardAtom.CSS_CLASS}`)
        );

        camera = new Camera().loadFilm(page, name, "Dashboards");
    });

    test(`${name} - Default look`, async () => {
        await camera.turn.on();

        // Step 2: Take screenshot of the default state
        await camera.say.cheese(`${name} - Default`);

        // Step 3: Find the widget titled "Bar Chart with Time Interval Scale" and scroll it into view
        const barChartWidget = await dashboard.getWidgetByHeaderTitleText(
            BAR_CHART_WIDGET_TITLE
        );
        await barChartWidget?.getLocator().scrollIntoViewIfNeeded();

        // Step 4: Find the chart inside that widget and hover over it
        const chart = barChartWidget?.getLocator().locator(".nui-chart");
        await chart?.hover();

        // Step 5: Take screenshot of the hovered chart state
        await camera.say.cheese(`${name} - ${BAR_CHART_WIDGET_TITLE} Hovered`);

        await camera.turn.off();
    });
});
