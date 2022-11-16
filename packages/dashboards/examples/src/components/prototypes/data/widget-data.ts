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

import moment from "moment/moment";

import { CHART_PALETTE_CS_S_EXTENDED } from "@nova-ui/charts";
import { ITimeseriesWidgetData } from "@nova-ui/dashboards";

import { BasicTableModel } from "./table/types";

export interface IProportionalWidgetData {
    id: string;
    name: string;
    data: number[];
    icon: string;
    link: string;
    value: string;
    color?: string;
}

export function getFixedProportionalWidgetData(
    citiesToInclude?: string[]
): IProportionalWidgetData[] {
    let data: IProportionalWidgetData[] = [
        {
            id: "Down",
            name: "Down",
            data: [1],
            icon: "status_down",
            link: "https://en.wikipedia.org/wiki/London",
            value: "London",
            color: "var(--nui-color-chart-eight)",
        },
        {
            id: "Critical",
            name: "Critical",
            data: [2],
            icon: "status_critical",
            link: "https://en.wikipedia.org/wiki/Paris",
            value: "Paris",
            color: "var(--nui-color-chart-nine)",
        },
        {
            id: "Warning",
            name: "Warning",
            data: [3],
            icon: "status_warning",
            link: "https://en.wikipedia.org/wiki/Rio_de_Janeiro",
            value: "Rio",
            color: "var(--nui-color-chart-ten)",
        },
    ];

    if (citiesToInclude) {
        data = data.filter((d) => citiesToInclude.includes(d.value));
    }

    return data;
}

export function getRandomProportionalWidgetData(
    citiesToInclude?: string[]
): IProportionalWidgetData[] {
    let data: IProportionalWidgetData[] = [
        {
            id: "Down",
            name: "Down",
            data: [Math.round(Math.random() * 100)],
            icon: "status_down",
            link: "https://en.wikipedia.org/wiki/Brno",
            value: "Brno",
        },
        {
            id: "Critical",
            name: "Critical Long Name Test Long Name Test Long Name Test",
            data: [Math.round(Math.random() * 100)],
            icon: "status_critical",
            link: "https://en.wikipedia.org/wiki/Kyiv",
            value: "Kyiv",
        },
        {
            id: "Warning",
            name: "Warning",
            data: [Math.round(Math.random() * 100)],
            icon: "status_warning",
            link: "https://en.wikipedia.org/wiki/Austin",
            value: "Austin",
        },
        {
            id: "Unknown",
            name: "Unknown",
            data: [Math.round(Math.random() * 100)],
            icon: "status_unknown",
            link: "https://en.wikipedia.org/wiki/Lisbon",
            value: "Lisbon",
        },
        {
            id: "Up",
            name: "Up",
            data: [Math.round(Math.random() * 100)],
            icon: "status_up",
            link: "https://en.wikipedia.org/wiki/Sydney",
            value: "Sydney",
        },
        {
            id: "Unmanaged",
            name: "Unmanaged",
            data: [Math.round(Math.random() * 100)],
            icon: "status_unmanaged",
            link: "https://en.wikipedia.org/wiki/Nur-Sultan",
            value: "Nur-Sultan",
        },
    ];

    if (citiesToInclude) {
        data = data.filter((d) => citiesToInclude.includes(d.value));
    }

    return data;
}

const startOfToday = moment().startOf("day").toDate();

export function getTimeseriesWidgetData(): ITimeseriesWidgetData[] {
    return [
        {
            id: "series-1",
            name: "Average CPU Load",
            description: "AII ESXi Hosts",
            // link: "https://en.wikipedia.org/wiki/Nur-Sultan",
            // secondaryLink: "https://en.wikipedia.org/wiki",
            data: [
                { x: moment(startOfToday).subtract(59, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(58, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(57, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(56, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(55, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(54, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(53, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(52, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(51, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(50, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(49, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(48, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(47, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(46, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(45, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(44, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(43, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(42, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(41, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(40, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(39, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(38, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(37, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(36, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(35, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(34, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(33, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(32, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(31, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(30, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(29, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(28, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(27, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(26, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(25, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(24, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(23, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(22, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(21, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(20, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(19, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(18, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(17, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(16, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(15, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(14, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(13, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(12, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(11, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(10, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(9, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(8, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(7, "day").toDate(), y: 36 },
                { x: moment(startOfToday).subtract(6, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(5, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(4, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(3, "day").toDate(), y: 32 },
                { x: moment(startOfToday).subtract(2, "day").toDate(), y: 31 },
                { x: moment(startOfToday).subtract(1, "day").toDate(), y: 34 },
                { x: moment(startOfToday).toDate(), y: 25 },
            ],
        },
        {
            id: "series-2",
            name: "Average CPU Load",
            description: "test1234.demo.lab",
            link: "https://en.wikipedia.org/wiki/Brno",
            secondaryLink: "https://en.wikipedia.org/wiki",
            data: [
                { x: moment(startOfToday).subtract(59, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(58, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(57, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(56, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(55, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(54, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(53, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(52, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(51, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(50, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(49, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(48, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(47, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(46, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(45, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(44, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(43, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(42, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(41, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(40, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(39, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(38, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(37, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(36, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(35, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(34, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(33, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(32, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(31, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(30, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(29, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(28, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(27, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(26, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(25, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(24, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(23, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(22, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(21, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(20, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(19, "day").toDate(), y: 64 },
                { x: moment(startOfToday).subtract(18, "day").toDate(), y: 70 },
                { x: moment(startOfToday).subtract(17, "day").toDate(), y: 55 },
                { x: moment(startOfToday).subtract(16, "day").toDate(), y: 55 },
                { x: moment(startOfToday).subtract(15, "day").toDate(), y: 45 },
                { x: moment(startOfToday).subtract(14, "day").toDate(), y: 10 },
                { x: moment(startOfToday).subtract(13, "day").toDate(), y: 65 },
                { x: moment(startOfToday).subtract(12, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(11, "day").toDate(), y: 60 },
                { x: moment(startOfToday).subtract(10, "day").toDate(), y: 61 },
                { x: moment(startOfToday).subtract(9, "day").toDate(), y: 65 },
                { x: moment(startOfToday).subtract(8, "day").toDate(), y: 63 },
                { x: moment(startOfToday).subtract(7, "day").toDate(), y: 58 },
                { x: moment(startOfToday).subtract(6, "day").toDate(), y: 64 },
                { x: moment(startOfToday).subtract(5, "day").toDate(), y: 63 },
                { x: moment(startOfToday).subtract(4, "day").toDate(), y: 60 },
                { x: moment(startOfToday).subtract(3, "day").toDate(), y: 62 },
                { x: moment(startOfToday).subtract(2, "day").toDate(), y: 61 },
                { x: moment(startOfToday).subtract(1, "day").toDate(), y: 62 },
                { x: moment(startOfToday).toDate(), y: 55 },
            ],
        },
        {
            id: "series-3",
            name: "Average CPU Load",
            description: "test2334.demo.lab",
            link: "https://en.wikipedia.org/wiki/Austin",
            // secondaryLink: "https://en.wikipedia.org/wiki",
            data: [
                { x: moment(startOfToday).subtract(59, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(58, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(57, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(56, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(55, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(54, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(53, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(52, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(51, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(50, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(49, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(48, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(47, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(46, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(45, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(44, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(43, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(42, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(41, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(40, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(39, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(38, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(37, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(36, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(35, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(34, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(33, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(32, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(31, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(30, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(29, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(28, "day").toDate(), y: 33 },
                { x: moment(startOfToday).subtract(27, "day").toDate(), y: 40 },
                { x: moment(startOfToday).subtract(26, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(25, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(24, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(23, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(22, "day").toDate(), y: 30 },
                { x: moment(startOfToday).subtract(21, "day").toDate(), y: 35 },
                { x: moment(startOfToday).subtract(20, "day").toDate(), y: 34 },
                { x: moment(startOfToday).subtract(19, "day").toDate(), y: 80 },
                { x: moment(startOfToday).subtract(18, "day").toDate(), y: 70 },
                { x: moment(startOfToday).subtract(17, "day").toDate(), y: 95 },
                { x: moment(startOfToday).subtract(16, "day").toDate(), y: 90 },
                { x: moment(startOfToday).subtract(15, "day").toDate(), y: 85 },
                { x: moment(startOfToday).subtract(14, "day").toDate(), y: 70 },
                { x: moment(startOfToday).subtract(13, "day").toDate(), y: 75 },
                { x: moment(startOfToday).subtract(12, "day").toDate(), y: 69 },
                { x: moment(startOfToday).subtract(11, "day").toDate(), y: 75 },
                { x: moment(startOfToday).subtract(10, "day").toDate(), y: 81 },
                { x: moment(startOfToday).subtract(9, "day").toDate(), y: 93 },
                { x: moment(startOfToday).subtract(8, "day").toDate(), y: 83 },
                { x: moment(startOfToday).subtract(7, "day").toDate(), y: 70 },
                { x: moment(startOfToday).subtract(6, "day").toDate(), y: 74 },
                { x: moment(startOfToday).subtract(5, "day").toDate(), y: 73 },
                { x: moment(startOfToday).subtract(4, "day").toDate(), y: 68 },
                { x: moment(startOfToday).subtract(3, "day").toDate(), y: 72 },
                { x: moment(startOfToday).subtract(2, "day").toDate(), y: 61 },
                { x: moment(startOfToday).subtract(1, "day").toDate(), y: 69 },
                { x: moment(startOfToday).toDate(), y: 60 },
            ],
        },
    ];
}

export function getTimeseriesWidgetData2(): ITimeseriesWidgetData[] {
    return [
        {
            id: "series-a",
            name: "Average CPU Load",
            description: "lastchance.demo.lab",
            link: "https://en.wikipedia.org/wiki/Brno",
            data: [
                { x: moment(startOfToday).subtract(20, "day").toDate(), y: 10 },
                { x: moment(startOfToday).subtract(19, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(18, "day").toDate(), y: 13 },
                { x: moment(startOfToday).subtract(17, "day").toDate(), y: 20 },
                { x: moment(startOfToday).subtract(16, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(15, "day").toDate(), y: 10 },
                { x: moment(startOfToday).subtract(14, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(13, "day").toDate(), y: 5 },
                { x: moment(startOfToday).subtract(12, "day").toDate(), y: 10 },
                { x: moment(startOfToday).subtract(11, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(10, "day").toDate(), y: 14 },
                { x: moment(startOfToday).subtract(9, "day").toDate(), y: 13 },
                { x: moment(startOfToday).subtract(8, "day").toDate(), y: 15 },
                { x: moment(startOfToday).subtract(7, "day").toDate(), y: 16 },
                { x: moment(startOfToday).subtract(6, "day").toDate(), y: 14 },
                { x: moment(startOfToday).subtract(5, "day").toDate(), y: 13 },
                { x: moment(startOfToday).subtract(4, "day").toDate(), y: 10 },
                { x: moment(startOfToday).subtract(3, "day").toDate(), y: 12 },
                { x: moment(startOfToday).subtract(2, "day").toDate(), y: 11 },
                { x: moment(startOfToday).subtract(1, "day").toDate(), y: 14 },
            ],
        },
        {
            id: "series-b",
            name: "Average CPU Load",
            description: "newhope.demo.lab",
            data: [
                { x: moment(startOfToday).subtract(20, "day").toDate(), y: 81 },
                { x: moment(startOfToday).subtract(19, "day").toDate(), y: 85 },
                { x: moment(startOfToday).subtract(18, "day").toDate(), y: 83 },
                { x: moment(startOfToday).subtract(17, "day").toDate(), y: 88 },
                { x: moment(startOfToday).subtract(16, "day").toDate(), y: 84 },
                { x: moment(startOfToday).subtract(15, "day").toDate(), y: 83 },
                { x: moment(startOfToday).subtract(14, "day").toDate(), y: 80 },
                { x: moment(startOfToday).subtract(13, "day").toDate(), y: 82 },
                { x: moment(startOfToday).subtract(12, "day").toDate(), y: 81 },
                { x: moment(startOfToday).subtract(11, "day").toDate(), y: 82 },
                { x: moment(startOfToday).subtract(10, "day").toDate(), y: 80 },
                { x: moment(startOfToday).subtract(9, "day").toDate(), y: 84 },
                { x: moment(startOfToday).subtract(8, "day").toDate(), y: 80 },
                { x: moment(startOfToday).subtract(7, "day").toDate(), y: 75 },
                { x: moment(startOfToday).subtract(6, "day").toDate(), y: 95 },
                { x: moment(startOfToday).subtract(5, "day").toDate(), y: 85 },
                { x: moment(startOfToday).subtract(4, "day").toDate(), y: 80 },
                { x: moment(startOfToday).subtract(3, "day").toDate(), y: 85 },
                { x: moment(startOfToday).subtract(2, "day").toDate(), y: 85 },
                { x: moment(startOfToday).subtract(1, "day").toDate(), y: 80 },
            ],
        },
        {
            id: "series-c",
            name: "Average CPU Load",
            description: "empire.demo.lab",
            data: [
                { x: moment(startOfToday).subtract(20, "day").toDate(), y: 65 },
                { x: moment(startOfToday).subtract(19, "day").toDate(), y: 66 },
                { x: moment(startOfToday).subtract(18, "day").toDate(), y: 70 },
                { x: moment(startOfToday).subtract(17, "day").toDate(), y: 65 },
                { x: moment(startOfToday).subtract(16, "day").toDate(), y: 60 },
                { x: moment(startOfToday).subtract(15, "day").toDate(), y: 65 },
                { x: moment(startOfToday).subtract(14, "day").toDate(), y: 60 },
                { x: moment(startOfToday).subtract(13, "day").toDate(), y: 65 },
                { x: moment(startOfToday).subtract(12, "day").toDate(), y: 69 },
                { x: moment(startOfToday).subtract(11, "day").toDate(), y: 65 },
                { x: moment(startOfToday).subtract(10, "day").toDate(), y: 61 },
                { x: moment(startOfToday).subtract(9, "day").toDate(), y: 63 },
                { x: moment(startOfToday).subtract(8, "day").toDate(), y: 63 },
                { x: moment(startOfToday).subtract(7, "day").toDate(), y: 60 },
                { x: moment(startOfToday).subtract(6, "day").toDate(), y: 64 },
                { x: moment(startOfToday).subtract(5, "day").toDate(), y: 63 },
                { x: moment(startOfToday).subtract(4, "day").toDate(), y: 68 },
                { x: moment(startOfToday).subtract(3, "day").toDate(), y: 62 },
                { x: moment(startOfToday).subtract(2, "day").toDate(), y: 61 },
                { x: moment(startOfToday).subtract(1, "day").toDate(), y: 69 },
            ],
        },
    ];
}

enum Status {
    Unknown = "unknown",
    Up = "up",
    Warning = "warning",
    Down = "down",
    Critical = "critical",
}

const statusColors: Record<Status, string> = {
    [Status.Unknown]: CHART_PALETTE_CS_S_EXTENDED[6],
    [Status.Up]: CHART_PALETTE_CS_S_EXTENDED[8],
    [Status.Warning]: CHART_PALETTE_CS_S_EXTENDED[4],
    [Status.Down]: CHART_PALETTE_CS_S_EXTENDED[0],
    [Status.Critical]: CHART_PALETTE_CS_S_EXTENDED[2],
};

export function getTimeseriesStatusData(): ITimeseriesWidgetData[] {
    const series: ITimeseriesWidgetData[] = [
        {
            id: "series-1",
            name: "Average CPU Load",
            description: "lastchance.demo.lab",
            link: "https://en.wikipedia.org/wiki/Austin",
            data: [
                {
                    x: moment(startOfToday).subtract(30, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(28, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(27, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(26, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(25, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(24, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(23, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(19, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(17, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(16, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(14, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(13, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(10, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(9, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(8, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(6, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(5, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(4, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(2, "day").toDate(),
                    y: Status.Up,
                },
                { x: moment(startOfToday).toDate(), y: Status.Critical },
                { x: moment().toDate(), y: Status.Critical },
            ],
        },
        {
            id: "series-2",
            name: "Average CPU Load",
            description: "newhope.demo.lab",
            link: "https://en.wikipedia.org/wiki/Brno",
            data: [
                {
                    x: moment(startOfToday).subtract(30, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(28, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(27, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(26, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(25, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(24, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(23, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(19, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(17, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(16, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(14, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(12, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(10, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(9, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(7, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(6, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(5, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(3, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(2, "day").toDate(),
                    y: Status.Critical,
                },
                { x: moment(startOfToday).toDate(), y: Status.Warning },
                { x: moment().toDate(), y: Status.Warning },
            ],
        },
    ];

    for (const s of series) {
        s.data = s.data.map((d: any, i: number) => ({
            ...d,
            color: statusColors[d.y as Status],
            thick: d.y !== Status.Up,
            icon: "status_" + d.y,
        }));

        // for testing undefined icon
        if (s.id === "series-2" && s.data.length > 2) {
            s.data[s.data.length - 2].icon = undefined;
            s.data[0].icon = undefined;
        }
    }

    return series;
}

export function getTimeseriesStatusIntervalData(): ITimeseriesWidgetData[] {
    const series: ITimeseriesWidgetData[] = [
        {
            id: "series-1",
            name: "Average CPU Load",
            description: "lastchance.demo.lab",
            link: "https://en.wikipedia.org/wiki/Brno",
            data: [
                {
                    x: moment(startOfToday).subtract(59, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(58, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(57, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(56, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(55, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(54, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(53, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(52, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(51, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(50, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(49, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(48, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(47, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(46, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(45, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(44, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(43, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(42, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(41, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(40, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(39, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(38, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(37, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(36, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(35, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(34, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(33, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(32, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(31, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(30, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(29, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(28, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(27, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(26, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(25, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(24, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(23, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(22, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(21, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(20, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(19, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(18, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(17, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(16, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(15, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(14, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(13, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(12, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(11, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(10, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(9, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(8, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(7, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(6, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(5, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(4, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(3, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(2, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(1, "day").toDate(),
                    y: Status.Critical,
                },
                { x: moment(startOfToday).toDate(), y: Status.Up },
            ],
        },
        {
            id: "series-2",
            name: "Average CPU Load",
            description: "newhope.demo.lab",
            link: "https://en.wikipedia.org/wiki/Austin",
            data: [
                {
                    x: moment(startOfToday).subtract(59, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(58, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(57, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(56, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(55, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(54, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(53, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(52, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(51, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(50, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(49, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(48, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(47, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(46, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(45, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(44, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(43, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(42, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(41, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(40, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(39, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(38, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(37, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(36, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(35, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(34, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(33, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(32, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(31, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(30, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(29, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(28, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(27, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(26, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(25, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(24, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(23, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(22, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(21, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(20, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(19, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(18, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(17, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(16, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(15, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(14, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(13, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(12, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(11, "day").toDate(),
                    y: Status.Warning,
                },
                {
                    x: moment(startOfToday).subtract(10, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(9, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(8, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(7, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(6, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(5, "day").toDate(),
                    y: Status.Down,
                },
                {
                    x: moment(startOfToday).subtract(4, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(3, "day").toDate(),
                    y: Status.Critical,
                },
                {
                    x: moment(startOfToday).subtract(2, "day").toDate(),
                    y: Status.Up,
                },
                {
                    x: moment(startOfToday).subtract(1, "day").toDate(),
                    y: Status.Warning,
                },
                { x: moment(startOfToday).toDate(), y: Status.Critical },
            ],
        },
    ];

    for (const s of series) {
        s.data = s.data.map((d: any, i: number) => ({
            ...d,
            color: statusColors[d.y as Status],
            thick: d.y !== Status.Up,
            icon: "status_" + d.y,
        }));

        // for testing undefined icon
        if (s.id === "series-2" && s.data.length > 2) {
            s.data[s.data.length - 1].icon = undefined;
            s.data[0].icon = undefined;
        }
    }

    return series;
}

export const TABLE_DATA: BasicTableModel[] = [
    {
        position: 1,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 2,
        name: "FOCUS-SVR-03312",
        features: ["tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_critical",
            num: 25,
        },
        "cpu-load": 47,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 3,
        name: "FOCUS-SVR-02258",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_down",
            num: 25,
        },
        "cpu-load": 53,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 4,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 5,
        name: "Man-LT-JYJ425",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 22,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 6,
        name: "Man-LT-JYJ4333",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 12,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 7,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 8,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 35,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 9,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 10,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 64,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 11,
        name: "Man-LT-111",
        features: [],
        status: "Active",
        checks: {
            icon: "status_external",
            num: 25,
        },
        "cpu-load": 55,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 12,
        name: "Man-LT-2222",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 34,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 13,
        name: "Man-LT-333333",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 56,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 14,
        name: "Man-LT-444444",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 26,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 15,
        name: "Man-LT-555555",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 76,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 16,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 17,
        name: "FOCUS-SVR-03312",
        features: ["tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_critical",
            num: 25,
        },
        "cpu-load": 47,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 18,
        name: "FOCUS-SVR-02258",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_down",
            num: 25,
        },
        "cpu-load": 53,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 19,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 20,
        name: "Man-LT-JYJ425",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 22,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 21,
        name: "Man-LT-JYJ4333",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 12,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 22,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 23,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 35,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 24,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 25,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 64,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 26,
        name: "Man-LT-111",
        features: [],
        status: "Active",
        checks: {
            icon: "status_external",
            num: 25,
        },
        "cpu-load": 55,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 27,
        name: "Man-LT-2222",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 34,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 28,
        name: "Man-LT-333333",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 56,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 29,
        name: "Man-LT-444444",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 26,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 30,
        name: "Man-LT-555555",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 76,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 31,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 32,
        name: "FOCUS-SVR-03312",
        features: ["tools", "database", "orion-ape-backup"],
        status: "Active",
        checks: {
            icon: "status_critical",
            num: 25,
        },
        "cpu-load": 47,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 33,
        name: "FOCUS-SVR-02258",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_down",
            num: 25,
        },
        "cpu-load": 53,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 34,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 35,
        name: "Man-LT-JYJ425",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 22,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 36,
        name: "Man-LT-JYJ4333",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 12,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VirtualBox",
        secondUrlLabel: "VirtualBox",
    },
    {
        position: 37,
        name: "FOCUS-SVR-02258",
        features: ["remote-access-vpn-tunnel", "patch-manager01"],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 86,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 38,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 35,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 39,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 32,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 40,
        name: "Man-LT-JYJ4AD5",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 64,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 41,
        name: "Man-LT-111",
        features: [],
        status: "Active",
        checks: {
            icon: "status_external",
            num: 25,
        },
        "cpu-load": 55,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 42,
        name: "Man-LT-2222",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_inactive",
            num: 25,
        },
        "cpu-load": 34,
        firstUrl: "https://en.wikipedia.org/wiki/Brno",
        firstUrlLabel: "Brno",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 43,
        name: "Man-LT-333333",
        features: [
            "remote-access-vpn-tunnel",
            "tools",
            "database",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 56,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 44,
        name: "Man-LT-444444",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 26,
        firstUrl: "https://en.wikipedia.org/wiki/Kyiv",
        firstUrlLabel: "Kyiv",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
    {
        position: 45,
        name: "Man-LT-555555",
        features: [
            "remote-access-vpn-tunnel",
            "database",
            "orion-ape-backup",
            "patch-manager01",
        ],
        status: "Active",
        checks: {
            icon: "status_up",
            num: 25,
        },
        "cpu-load": 76,
        firstUrl: "https://en.wikipedia.org/wiki/Austin",
        firstUrlLabel: "Austin",
        secondUrl: "https://en.wikipedia.org/wiki/VMware_Workstation",
        secondUrlLabel: "Workstation",
    },
];
