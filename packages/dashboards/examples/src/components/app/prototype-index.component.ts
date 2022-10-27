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

import { Component } from "@angular/core";

/**
 * Navigation helper
 */
@Component({
    template: `
        <h1>Dashboard Developer Links</h1>
        <h2>Prototypes</h2>
        <ul>
            <li *ngFor="let link of prototypes">
                <a [routerLink]="link.path">{{ link.title }}</a>
            </li>
        </ul>
        <h2>Visual Tests</h2>
        <ul>
            <li *ngFor="let link of visualTests">
                <a [routerLink]="link.path">{{ link.title }}</a>
            </li>
        </ul>
    `,
})
export class DeveloperQuickLinksComponent {
    public prototypes = [
        {
            title: "Prototype 1",
            path: "/prototypes/prototype-1",
        },
        {
            title: "Table",
            path: "/prototypes/table",
        },
        {
            title: "Timeseries",
            path: "/prototypes/timeseries",
        },
        {
            title: "Many Widgets",
            path: "/prototypes/many-widgets",
        },
    ];

    public visualTests = [
        {
            title: "Overview",
            path: "/test/overview",
        },
        {
            title: "Proportional",
            path: "/test/proportional",
        },
        {
            title: "Configurator",
            path: "/test/configurator",
        },
        {
            title: "Timeseries",
            path: "/test/timeseries",
        },
        {
            title: "Table",
            path: "/test/table",
        },
        {
            title: "KPI",
            path: "/test/kpi",
        },
        {
            title: "Drilldown",
            path: "/test/drilldown",
        },
    ];
}
