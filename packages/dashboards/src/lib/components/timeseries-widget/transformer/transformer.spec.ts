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

import { ITimeseriesWidgetSeriesData } from "../types";

export const mockTimeSeriesData: ITimeseriesWidgetSeriesData[] = [
    { x: moment("2016-10-11T01:43:30.420Z"), y: 10 },
    { x: moment("2016-10-11T01:46:30.420Z"), y: 1.56 },
    { x: moment("2016-10-11T01:49:30.420Z"), y: 9.58 },
    { x: moment("2016-10-11T01:52:30.420Z"), y: 1.58 },
    { x: moment("2016-10-11T01:55:30.420Z"), y: 0.27 },
    { x: moment("2016-10-11T01:58:30.420Z"), y: 3.24 },
    { x: moment("2016-10-11T02:01:30.420Z"), y: 1.54 },
    { x: moment("2016-10-11T02:04:30.420Z"), y: 0.43 },
    { x: moment("2016-10-11T02:07:30.420Z"), y: 2.23 },
    { x: moment("2016-10-11T02:10:30.420Z"), y: 0.07 },
    { x: moment("2016-10-11T02:13:30.420Z"), y: 1.18 },
    { x: moment("2016-10-11T02:16:30.420Z"), y: 0.35 },
    { x: moment("2016-10-11T02:19:30.420Z"), y: 0.62 },
    { x: moment("2016-10-11T02:22:30.420Z"), y: 0.76 },
    { x: moment("2016-10-11T02:25:30.420Z"), y: 0.78 },
    { x: moment("2016-10-11T02:28:30.420Z"), y: 0 },
    { x: moment("2016-10-11T02:31:30.420Z"), y: 3.1 },
    { x: moment("2016-10-11T02:34:30.420Z"), y: 3.06 },
    { x: moment("2016-10-11T02:37:30.420Z"), y: 3.41 },
    { x: moment("2016-10-11T02:40:30.420Z"), y: 3.68 },
    { x: moment("2016-10-11T02:43:30.420Z"), y: 0 },
    { x: moment("2016-10-11T02:46:30.420Z"), y: 0 },
    { x: moment("2016-10-11T02:49:30.420Z"), y: 0 },
    { x: moment("2016-10-11T02:52:30.420Z"), y: 0.31 },
    { x: moment("2016-10-11T02:55:30.420Z"), y: 1.9 },
    { x: moment("2016-10-11T02:58:30.420Z"), y: 1.11 },
    { x: moment("2016-10-11T03:01:30.420Z"), y: 0 },
    { x: moment("2016-10-11T03:04:30.420Z"), y: 0 },
    { x: moment("2016-10-11T03:07:30.420Z"), y: 2.23 },
    { x: moment("2016-10-11T03:10:30.420Z"), y: 0.8 },
    { x: moment("2016-10-11T03:13:30.420Z"), y: 0.85 },
    { x: moment("2016-10-11T03:16:30.420Z"), y: 1.57 },
    { x: moment("2016-10-11T03:19:30.420Z"), y: 0.31 },
    { x: moment("2016-10-11T03:22:30.420Z"), y: 1.77 },
    { x: moment("2016-10-11T03:25:30.420Z"), y: 1.26 },
    { x: moment("2016-10-11T03:28:30.420Z"), y: 0.7 },
    { x: moment("2016-10-11T03:31:30.420Z"), y: 0.08 },
    { x: moment("2016-10-11T03:34:30.420Z"), y: 2.72 },
    { x: moment("2016-10-11T03:37:30.420Z"), y: 0 },
    { x: moment("2016-10-11T03:40:30.420Z"), y: 1.74 },
    { x: moment("2016-10-11T03:43:30.420Z"), y: 1.23 },
    { x: moment("2016-10-11T03:46:30.420Z"), y: 0.28 },
    { x: moment("2016-10-11T03:49:30.420Z"), y: 0.09 },
    { x: moment("2016-10-11T03:52:30.420Z"), y: 0 },
    { x: moment("2016-10-11T03:55:30.420Z"), y: 1.55 },
    { x: moment("2016-10-11T03:58:30.420Z"), y: 1.2 },
    { x: moment("2016-10-11T04:01:30.420Z"), y: 0.32 },
    { x: moment("2016-10-11T04:04:30.420Z"), y: 1.32 },
    { x: moment("2016-10-11T04:07:30.420Z"), y: 1.24 },
    { x: moment("2016-10-11T04:10:30.420Z"), y: 1.82 },
    { x: moment("2016-10-11T04:13:30.420Z"), y: 0 },
    { x: moment("2016-10-11T04:16:30.420Z"), y: 0.26 },
    { x: moment("2016-10-11T04:19:30.420Z"), y: 2.11 },
    { x: moment("2016-10-11T04:22:30.420Z"), y: 2.44 },
    { x: moment("2016-10-11T04:25:30.420Z"), y: 2.8 },
    { x: moment("2016-10-11T04:28:30.420Z"), y: 0.92 },
    { x: moment("2016-10-11T04:31:30.420Z"), y: 2.32 },
    { x: moment("2016-10-11T04:34:30.420Z"), y: 0.42 },
    { x: moment("2016-10-11T04:37:30.420Z"), y: 3.01 },
    { x: moment("2016-10-11T04:40:30.420Z"), y: 2.42 },
    { x: moment("2016-10-11T04:43:30.420Z"), y: 2.78 },
    { x: moment("2016-10-11T04:46:30.420Z"), y: 3.35 },
    { x: moment("2016-10-11T04:49:30.420Z"), y: 0.25 },
    { x: moment("2016-10-11T04:52:30.420Z"), y: 2.98 },
    { x: moment("2016-10-11T04:55:30.420Z"), y: 0.13 },
    { x: moment("2016-10-11T04:58:30.420Z"), y: 1.38 },
    { x: moment("2016-10-11T05:01:30.420Z"), y: 2.86 },
    { x: moment("2016-10-11T05:04:30.420Z"), y: 3.92 },
    { x: moment("2016-10-11T05:07:30.420Z"), y: 2.49 },
    { x: moment("2016-10-11T05:10:30.420Z"), y: 2.23 },
    { x: moment("2016-10-11T05:13:30.420Z"), y: 0 },
    { x: moment("2016-10-11T05:16:30.420Z"), y: 0.52 },
    { x: moment("2016-10-11T05:19:30.420Z"), y: 0 },
    { x: moment("2016-10-11T05:22:30.420Z"), y: 0 },
    { x: moment("2016-10-11T05:25:30.420Z"), y: 3.39 },
    { x: moment("2016-10-11T05:28:30.420Z"), y: 3.07 },
    { x: moment("2016-10-11T05:31:30.420Z"), y: 2.96 },
    { x: moment("2016-10-11T05:34:30.420Z"), y: 2.57 },
    { x: moment("2016-10-11T05:37:30.420Z"), y: 0.61 },
    { x: moment("2016-10-11T05:40:30.420Z"), y: 1.36 },
    { x: moment("2016-10-11T05:43:30.420Z"), y: 3.39 },
    { x: moment("2016-10-11T05:46:30.420Z"), y: 1.11 },
    { x: moment("2016-10-11T05:49:30.420Z"), y: 1.19 },
    { x: moment("2016-10-11T05:52:30.420Z"), y: 1.98 },
    { x: moment("2016-10-11T05:55:30.420Z"), y: 1.8 },
    { x: moment("2016-10-11T05:58:30.420Z"), y: 2.7 },
    { x: moment("2016-10-11T06:01:30.420Z"), y: 1.96 },
    { x: moment("2016-10-11T06:04:30.420Z"), y: 0 },
    { x: moment("2016-10-11T06:07:30.420Z"), y: 0.71 },
    { x: moment("2016-10-11T06:10:30.420Z"), y: 2.7 },
    { x: moment("2016-10-11T06:13:30.420Z"), y: 0.66 },
    { x: moment("2016-10-11T06:16:30.420Z"), y: 2.91 },
    { x: moment("2016-10-11T06:19:30.420Z"), y: 0.25 },
    { x: moment("2016-10-11T06:22:30.420Z"), y: 2.78 },
    { x: moment("2016-10-11T06:25:30.420Z"), y: 0.89 },
    { x: moment("2016-10-11T06:28:30.420Z"), y: 2.89 },
    { x: moment("2016-10-11T06:31:30.420Z"), y: 0 },
    { x: moment("2016-10-11T06:34:30.420Z"), y: 2.95 },
    { x: moment("2016-10-11T06:37:30.420Z"), y: 2.9 },
    { x: moment("2016-10-11T06:40:30.420Z"), y: 0.24 },
    { x: moment("2016-10-11T06:43:30.420Z"), y: 0.21 },
    { x: moment("2016-10-11T06:46:30.420Z"), y: 1.37 },
    { x: moment("2016-10-11T06:49:30.420Z"), y: 2.66 },
    { x: moment("2016-10-11T06:52:30.420Z"), y: 0.22 },
    { x: moment("2016-10-11T06:55:30.420Z"), y: 2.32 },
    { x: moment("2016-10-11T06:58:30.420Z"), y: 0.84 },
    { x: moment("2016-10-11T07:01:30.420Z"), y: 1.94 },
    { x: moment("2016-10-11T07:04:30.420Z"), y: 1.45 },
    { x: moment("2016-10-11T07:07:30.420Z"), y: 2.42 },
    { x: moment("2016-10-11T07:10:30.420Z"), y: 3.01 },
    { x: moment("2016-10-11T07:13:30.420Z"), y: 3.6 },
    { x: moment("2016-10-11T07:16:30.420Z"), y: 0.51 },
    { x: moment("2016-10-11T07:19:30.420Z"), y: 0.59 },
    { x: moment("2016-10-11T07:22:30.420Z"), y: 0.13 },
    { x: moment("2016-10-11T07:25:30.420Z"), y: 0 },
    { x: moment("2016-10-11T07:28:30.420Z"), y: 3.27 },
    { x: moment("2016-10-11T07:31:30.420Z"), y: 3.26 },
    { x: moment("2016-10-11T07:34:30.420Z"), y: 0.4 },
    { x: moment("2016-10-11T07:37:30.420Z"), y: 3.71 },
    { x: moment("2016-10-11T07:40:30.420Z"), y: 1.07 },
    { x: moment("2016-10-11T07:43:30.420Z"), y: 0.88 },
    { x: moment("2016-10-11T07:46:30.420Z"), y: 2.88 },
    { x: moment("2016-10-11T07:49:30.420Z"), y: 1.6 },
    { x: moment("2016-10-11T07:52:30.420Z"), y: 0 },
    { x: moment("2016-10-11T07:55:30.420Z"), y: 1.09 },
    { x: moment("2016-10-11T07:58:30.420Z"), y: 0.7 },
    { x: moment("2016-10-11T08:01:30.420Z"), y: 1.8 },
    { x: moment("2016-10-11T08:04:30.420Z"), y: 0.49 },
    { x: moment("2016-10-11T08:07:30.420Z"), y: 2.68 },
    { x: moment("2016-10-11T08:10:30.420Z"), y: 2.32 },
    { x: moment("2016-10-11T08:13:30.420Z"), y: 3.56 },
    { x: moment("2016-10-11T08:16:30.420Z"), y: 0 },
    { x: moment("2016-10-11T08:19:30.420Z"), y: 2.86 },
    { x: moment("2016-10-11T08:22:30.420Z"), y: 0.39 },
    { x: moment("2016-10-11T08:25:30.420Z"), y: 0.31 },
    { x: moment("2016-10-11T08:28:30.420Z"), y: 0.18 },
    { x: moment("2016-10-11T08:31:30.420Z"), y: 0 },
    { x: moment("2016-10-11T08:34:30.420Z"), y: 0 },
    { x: moment("2016-10-11T08:37:30.420Z"), y: 1.8 },
    { x: moment("2016-10-11T08:40:30.420Z"), y: 0.21 },
    { x: moment("2016-10-11T08:43:30.420Z"), y: 3.12 },
    { x: moment("2016-10-11T08:46:30.420Z"), y: 3.18 },
    { x: moment("2016-10-11T08:49:30.420Z"), y: 3.73 },
    { x: moment("2016-10-11T08:52:30.420Z"), y: 0.77 },
    { x: moment("2016-10-11T08:55:30.420Z"), y: 1.6 },
    { x: moment("2016-10-11T08:58:30.420Z"), y: 2.75 },
    { x: moment("2016-10-11T09:01:30.420Z"), y: 2.59 },
    { x: moment("2016-10-11T09:04:30.420Z"), y: 1.87 },
    { x: moment("2016-10-11T09:07:30.420Z"), y: 3.61 },
    { x: moment("2016-10-11T09:10:30.420Z"), y: 2.84 },
    { x: moment("2016-10-11T09:13:30.420Z"), y: 0 },
    { x: moment("2016-10-11T09:16:30.420Z"), y: 0.62 },
    { x: moment("2016-10-11T09:19:30.420Z"), y: 2.81 },
    { x: moment("2016-10-11T09:22:30.420Z"), y: 0.87 },
    { x: moment("2016-10-11T09:25:30.420Z"), y: 0.15 },
    { x: moment("2016-10-11T09:28:30.420Z"), y: 0.51 },
    { x: moment("2016-10-11T09:31:30.420Z"), y: 2.26 },
    { x: moment("2016-10-11T09:34:30.420Z"), y: 2.2 },
    { x: moment("2016-10-11T09:37:30.420Z"), y: 2.41 },
    { x: moment("2016-10-11T09:40:30.420Z"), y: 0.63 },
    { x: moment("2016-10-11T09:43:30.420Z"), y: 1.52 },
    { x: moment("2016-10-11T09:46:30.420Z"), y: 0.17 },
    { x: moment("2016-10-11T09:49:30.420Z"), y: 2.6 },
    { x: moment("2016-10-11T09:52:30.420Z"), y: 0.77 },
    { x: moment("2016-10-11T09:55:30.420Z"), y: 3 },
    { x: moment("2016-10-11T09:58:30.420Z"), y: 1.04 },
    { x: moment("2016-10-11T10:01:30.420Z"), y: 3.62 },
    { x: moment("2016-10-11T10:04:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:07:30.420Z"), y: 3.01 },
    { x: moment("2016-10-11T10:10:30.420Z"), y: 0.8 },
    { x: moment("2016-10-11T10:13:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:16:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:19:30.420Z"), y: 2.43 },
    { x: moment("2016-10-11T10:22:30.420Z"), y: 1.25 },
    { x: moment("2016-10-11T10:25:30.420Z"), y: 2.31 },
    { x: moment("2016-10-11T10:28:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:31:30.420Z"), y: 1.53 },
    { x: moment("2016-10-11T10:34:30.420Z"), y: 2.22 },
    { x: moment("2016-10-11T10:37:30.420Z"), y: 0.26 },
    { x: moment("2016-10-11T10:40:30.420Z"), y: 2.38 },
    { x: moment("2016-10-11T10:43:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:46:30.420Z"), y: 2.37 },
    { x: moment("2016-10-11T10:49:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:52:30.420Z"), y: 2.46 },
    { x: moment("2016-10-11T10:55:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:58:30.420Z"), y: 1.11 },
    { x: moment("2016-10-11T11:01:30.420Z"), y: 2.34 },
    { x: moment("2016-10-11T11:04:30.420Z"), y: 2.33 },
    { x: moment("2016-10-11T11:07:30.420Z"), y: 2.86 },
    { x: moment("2016-10-11T11:10:30.420Z"), y: 1.74 },
    { x: moment("2016-10-11T11:13:30.420Z"), y: 0 },
    { x: moment("2016-10-11T11:16:30.420Z"), y: 3.28 },
    { x: moment("2016-10-11T11:19:30.420Z"), y: 0.58 },
    { x: moment("2016-10-11T11:22:30.420Z"), y: 1.68 },
    { x: moment("2016-10-11T11:25:30.420Z"), y: 0.68 },
    { x: moment("2016-10-11T11:28:30.420Z"), y: 1.66 },
    { x: moment("2016-10-11T11:31:30.420Z"), y: 2.28 },
    { x: moment("2016-10-11T11:34:30.420Z"), y: 2.48 },
    { x: moment("2016-10-11T11:37:30.420Z"), y: 1.59 },
    { x: moment("2016-10-11T11:40:30.420Z"), y: 0.62 },
    { x: moment("2016-10-11T11:43:30.420Z"), y: 2.26 },
    { x: moment("2016-10-11T11:46:30.420Z"), y: 2.47 },
    { x: moment("2016-10-11T11:49:30.420Z"), y: 0.57 },
    { x: moment("2016-10-11T11:52:30.420Z"), y: 3.56 },
    { x: moment("2016-10-11T11:55:30.420Z"), y: 0 },
    { x: moment("2016-10-11T11:58:30.420Z"), y: 3.34 },
    { x: moment("2016-10-11T12:01:30.420Z"), y: 1.06 },
    { x: moment("2016-10-11T12:04:30.420Z"), y: 2.82 },
    { x: moment("2016-10-11T12:07:30.420Z"), y: 1.56 },
    { x: moment("2016-10-11T12:10:30.420Z"), y: 2.73 },
    { x: moment("2016-10-11T12:13:30.420Z"), y: 0.56 },
    { x: moment("2016-10-11T12:16:30.420Z"), y: 0.37 },
    { x: moment("2016-10-11T12:19:30.420Z"), y: 3.32 },
    { x: moment("2016-10-11T12:22:30.420Z"), y: 0.23 },
    { x: moment("2016-10-11T12:25:30.420Z"), y: 3.6 },
    { x: moment("2016-10-11T12:28:30.420Z"), y: 0.29 },
    { x: moment("2016-10-11T12:31:30.420Z"), y: 0 },
    { x: moment("2016-10-11T12:34:30.420Z"), y: 2.68 },
    { x: moment("2016-10-11T12:37:30.420Z"), y: 0.23 },
    { x: moment("2016-10-11T12:40:30.420Z"), y: 1.35 },
    { x: moment("2016-10-11T12:43:30.420Z"), y: 2.93 },
    { x: moment("2016-10-11T12:46:30.420Z"), y: 1.51 },
    { x: moment("2016-10-11T12:49:30.420Z"), y: 2.6 },
    { x: moment("2016-10-11T12:52:30.420Z"), y: 2.09 },
    { x: moment("2016-10-11T12:55:30.420Z"), y: 0.77 },
    { x: moment("2016-10-11T12:58:30.420Z"), y: 0 },
    { x: moment("2016-10-11T13:01:30.420Z"), y: 1.9 },
    { x: moment("2016-10-11T13:04:30.420Z"), y: 0.34 },
    { x: moment("2016-10-11T13:07:30.420Z"), y: 3.9 },
    { x: moment("2016-10-11T13:10:30.420Z"), y: 0.8 },
    { x: moment("2016-10-11T13:13:30.420Z"), y: 0.5 },
    { x: moment("2016-10-11T13:16:30.420Z"), y: 0.09 },
    { x: moment("2016-10-11T13:19:30.420Z"), y: 0.4 },
    { x: moment("2016-10-11T13:22:30.420Z"), y: 2.03 },
    { x: moment("2016-10-11T13:25:30.420Z"), y: 2.69 },
    { x: moment("2016-10-11T13:28:30.420Z"), y: 2.52 },
    { x: moment("2016-10-11T13:31:30.420Z"), y: 0.65 },
    { x: moment("2016-10-11T13:34:30.420Z"), y: 1.59 },
    { x: moment("2016-10-11T13:37:30.420Z"), y: 0.46 },
    { x: moment("2016-10-11T13:40:30.420Z"), y: 0 },
];

export const mockTimeSeriesDataTest2: ITimeseriesWidgetSeriesData[] = [
    { x: moment("2016-10-11T01:43:30.420Z"), y: 10 },
    { x: moment("2016-10-11T01:46:30.420Z"), y: 1.56 },
    { x: moment("2016-10-11T01:49:30.420Z"), y: 9.58 },
    { x: moment("2016-10-11T01:52:30.420Z"), y: 1.58 },
    { x: moment("2016-10-11T01:55:30.420Z"), y: 0.27 },
    { x: moment("2016-10-11T01:58:30.420Z"), y: 3.24 },
    { x: moment("2016-10-11T02:01:30.420Z"), y: 1.54 },
    { x: moment("2016-10-11T02:04:30.420Z"), y: 0.43 },
    { x: moment("2016-10-11T02:07:30.420Z"), y: 2.23 },
    { x: moment("2016-10-11T02:10:30.420Z"), y: 0.07 },
    { x: moment("2016-10-11T02:13:30.420Z"), y: 1.18 },
    { x: moment("2016-10-11T02:16:30.420Z"), y: 0.35 },
    { x: moment("2016-10-11T02:19:30.420Z"), y: 0.62 },
    { x: moment("2016-10-11T02:22:30.420Z"), y: 0.76 },
    { x: moment("2016-10-11T02:25:30.420Z"), y: 0.78 },
    { x: moment("2016-10-11T02:28:30.420Z"), y: 0 },
    { x: moment("2016-10-11T02:31:30.420Z"), y: 3.1 },
    { x: moment("2016-10-11T02:34:30.420Z"), y: 3.06 },
    { x: moment("2016-10-11T02:37:30.420Z"), y: 3.41 },
    { x: moment("2016-10-11T02:40:30.420Z"), y: 3.68 },
    { x: moment("2016-10-11T02:43:30.420Z"), y: 0 },
    { x: moment("2016-10-11T02:46:30.420Z"), y: 0 },
    { x: moment("2016-10-11T02:49:30.420Z"), y: 0 },
    { x: moment("2016-10-11T02:52:30.420Z"), y: 0.31 },
    { x: moment("2016-10-11T02:55:30.420Z"), y: 1.9 },
    { x: moment("2016-10-11T02:58:30.420Z"), y: 1.11 },
    { x: moment("2016-10-11T03:01:30.420Z"), y: 0 },
    { x: moment("2016-10-11T03:04:30.420Z"), y: 0 },
    { x: moment("2016-10-11T03:07:30.420Z"), y: 2.23 },
    { x: moment("2016-10-11T03:10:30.420Z"), y: 0.8 },
    { x: moment("2016-10-11T03:13:30.420Z"), y: 0.85 },
    { x: moment("2016-10-11T03:16:30.420Z"), y: 1.57 },
    { x: moment("2016-10-11T03:19:30.420Z"), y: 0.31 },
    { x: moment("2016-10-11T03:22:30.420Z"), y: 1.77 },
    { x: moment("2016-10-11T03:25:30.420Z"), y: 1.26 },
    { x: moment("2016-10-11T03:28:30.420Z"), y: 0.7 },
    { x: moment("2016-10-11T03:31:30.420Z"), y: 0.08 },
    { x: moment("2016-10-11T03:34:30.420Z"), y: 2.72 },
    { x: moment("2016-10-11T03:37:30.420Z"), y: 0 },
    { x: moment("2016-10-11T03:40:30.420Z"), y: 1.74 },
    { x: moment("2016-10-11T03:43:30.420Z"), y: 1.23 },
    { x: moment("2016-10-11T03:46:30.420Z"), y: 0.28 },
    { x: moment("2016-10-11T03:49:30.420Z"), y: 0.09 },
    { x: moment("2016-10-11T03:52:30.420Z"), y: 0 },
    { x: moment("2016-10-11T03:55:30.420Z"), y: 1.55 },
    { x: moment("2016-10-11T03:58:30.420Z"), y: 1.2 },
    { x: moment("2016-10-11T04:01:30.420Z"), y: 0.32 },
    { x: moment("2016-10-11T04:04:30.420Z"), y: 1.32 },
    { x: moment("2016-10-11T04:07:30.420Z"), y: 1.24 },
    { x: moment("2016-10-11T04:10:30.420Z"), y: 1.82 },
    { x: moment("2016-10-11T04:13:30.420Z"), y: 0 },
    { x: moment("2016-10-11T04:16:30.420Z"), y: 0.26 },
    { x: moment("2016-10-11T04:19:30.420Z"), y: 2.11 },
    { x: moment("2016-10-11T04:22:30.420Z"), y: 2.44 },
    { x: moment("2016-10-11T04:25:30.420Z"), y: 2.8 },
    { x: moment("2016-10-11T04:28:30.420Z"), y: 0.92 },
    { x: moment("2016-10-11T04:31:30.420Z"), y: 2.32 },
    { x: moment("2016-10-11T04:34:30.420Z"), y: 0.42 },
    { x: moment("2016-10-11T04:37:30.420Z"), y: 3.01 },
    { x: moment("2016-10-11T04:40:30.420Z"), y: 2.42 },
    { x: moment("2016-10-11T04:43:30.420Z"), y: 2.78 },
    { x: moment("2016-10-11T04:46:30.420Z"), y: 3.35 },
    { x: moment("2016-10-11T04:49:30.420Z"), y: 0.25 },
    { x: moment("2016-10-11T04:52:30.420Z"), y: 2.98 },
    { x: moment("2016-10-11T04:55:30.420Z"), y: 0.13 },
    { x: moment("2016-10-11T04:58:30.420Z"), y: 1.38 },
    { x: moment("2016-10-11T05:01:30.420Z"), y: 2.86 },
    { x: moment("2016-10-11T05:04:30.420Z"), y: 3.92 },
    { x: moment("2016-10-11T05:07:30.420Z"), y: 2.49 },
    { x: moment("2016-10-11T05:10:30.420Z"), y: 2.23 },
    { x: moment("2016-10-11T05:13:30.420Z"), y: 0 },
    { x: moment("2016-10-11T05:16:30.420Z"), y: 0.52 },
    { x: moment("2016-10-11T05:19:30.420Z"), y: 0 },
    { x: moment("2016-10-11T05:22:30.420Z"), y: 0 },
    { x: moment("2016-10-11T05:25:30.420Z"), y: 3.39 },
    { x: moment("2016-10-11T05:28:30.420Z"), y: 3.07 },
    { x: moment("2016-10-11T05:31:30.420Z"), y: 2.96 },
    { x: moment("2016-10-11T05:34:30.420Z"), y: 2.57 },
    { x: moment("2016-10-11T05:37:30.420Z"), y: 0.61 },
    { x: moment("2016-10-11T05:40:30.420Z"), y: 1.36 },
    { x: moment("2016-10-11T05:43:30.420Z"), y: 3.39 },
    { x: moment("2016-10-11T05:46:30.420Z"), y: 1.11 },
    { x: moment("2016-10-11T05:49:30.420Z"), y: 1.19 },
    { x: moment("2016-10-11T05:52:30.420Z"), y: 1.98 },
    { x: moment("2016-10-11T05:55:30.420Z"), y: 1.8 },
    { x: moment("2016-10-11T05:58:30.420Z"), y: 2.7 },
    { x: moment("2016-10-11T06:01:30.420Z"), y: 1.96 },
    { x: moment("2016-10-11T06:04:30.420Z"), y: 0 },
    { x: moment("2016-10-11T06:07:30.420Z"), y: 0.71 },
    { x: moment("2016-10-11T06:10:30.420Z"), y: 2.7 },
    { x: moment("2016-10-11T06:13:30.420Z"), y: 0.66 },
    { x: moment("2016-10-11T06:16:30.420Z"), y: 2.91 },
    { x: moment("2016-10-11T06:19:30.420Z"), y: 0.25 },
    { x: moment("2016-10-11T06:22:30.420Z"), y: 2.78 },
    { x: moment("2016-10-11T06:25:30.420Z"), y: 0.89 },
    { x: moment("2016-10-11T06:28:30.420Z"), y: 2.89 },
    { x: moment("2016-10-11T06:31:30.420Z"), y: 0 },
    { x: moment("2016-10-11T06:34:30.420Z"), y: 2.95 },
    { x: moment("2016-10-11T06:37:30.420Z"), y: 2.9 },
    { x: moment("2016-10-11T06:40:30.420Z"), y: 0.24 },
    { x: moment("2016-10-11T06:43:30.420Z"), y: 0.21 },
    { x: moment("2016-10-11T06:46:30.420Z"), y: 1.37 },
    { x: moment("2016-10-11T06:49:30.420Z"), y: 2.66 },
    { x: moment("2016-10-11T06:52:30.420Z"), y: 0.22 },
    { x: moment("2016-10-11T06:55:30.420Z"), y: 2.32 },
    { x: moment("2016-10-11T06:58:30.420Z"), y: 0.84 },
    { x: moment("2016-10-11T07:01:30.420Z"), y: 1.94 },
    { x: moment("2016-10-11T07:04:30.420Z"), y: 1.45 },
    { x: moment("2016-10-11T07:07:30.420Z"), y: 2.42 },
    { x: moment("2016-10-11T07:10:30.420Z"), y: 3.01 },
    { x: moment("2016-10-11T07:13:30.420Z"), y: 3.6 },
    { x: moment("2016-10-11T07:16:30.420Z"), y: 0.51 },
    { x: moment("2016-10-11T07:19:30.420Z"), y: 0.59 },
    { x: moment("2016-10-11T07:22:30.420Z"), y: 0.13 },
    { x: moment("2016-10-11T07:25:30.420Z"), y: 0 },
    { x: moment("2016-10-11T07:28:30.420Z"), y: 3.27 },
    { x: moment("2016-10-11T07:31:30.420Z"), y: 3.26 },
    { x: moment("2016-10-11T07:34:30.420Z"), y: 0.4 },
    { x: moment("2016-10-11T07:37:30.420Z"), y: 3.71 },
    { x: moment("2016-10-11T07:40:30.420Z"), y: 1.07 },
    { x: moment("2016-10-11T07:43:30.420Z"), y: 0.88 },
    { x: moment("2016-10-11T07:46:30.420Z"), y: 2.88 },
    { x: moment("2016-10-11T07:49:30.420Z"), y: 1.6 },
    { x: moment("2016-10-11T07:52:30.420Z"), y: 0 },
    { x: moment("2016-10-11T07:55:30.420Z"), y: 1.09 },
    { x: moment("2016-10-11T07:58:30.420Z"), y: 0.7 },
    { x: moment("2016-10-11T08:01:30.420Z"), y: 1.8 },
    { x: moment("2016-10-11T08:04:30.420Z"), y: 0.49 },
    { x: moment("2016-10-11T08:07:30.420Z"), y: 2.68 },
    { x: moment("2016-10-11T08:10:30.420Z"), y: 2.32 },
    { x: moment("2016-10-11T08:13:30.420Z"), y: 3.56 },
    { x: moment("2016-10-11T08:16:30.420Z"), y: 0 },
    { x: moment("2016-10-11T08:19:30.420Z"), y: 2.86 },
    { x: moment("2016-10-11T08:22:30.420Z"), y: 0.39 },
    { x: moment("2016-10-11T08:25:30.420Z"), y: 0.31 },
    { x: moment("2016-10-11T08:28:30.420Z"), y: 0.18 },
    { x: moment("2016-10-11T08:31:30.420Z"), y: 0 },
    { x: moment("2016-10-11T08:34:30.420Z"), y: 0 },
    { x: moment("2016-10-11T08:37:30.420Z"), y: 1.8 },
    { x: moment("2016-10-11T08:40:30.420Z"), y: 0.21 },
    { x: moment("2016-10-11T08:43:30.420Z"), y: 3.12 },
    { x: moment("2016-10-11T08:46:30.420Z"), y: 3.18 },
    { x: moment("2016-10-11T08:49:30.420Z"), y: 3.73 },
    { x: moment("2016-10-11T08:52:30.420Z"), y: 0.77 },
    { x: moment("2016-10-11T08:55:30.420Z"), y: 1.6 },
    { x: moment("2016-10-11T08:58:30.420Z"), y: 2.75 },
    { x: moment("2016-10-11T09:01:30.420Z"), y: 2.59 },
    { x: moment("2016-10-11T09:04:30.420Z"), y: 1.87 },
    { x: moment("2016-10-11T09:07:30.420Z"), y: 3.61 },
    { x: moment("2016-10-11T09:10:30.420Z"), y: 2.84 },
    { x: moment("2016-10-11T09:13:30.420Z"), y: 0 },
    { x: moment("2016-10-11T09:16:30.420Z"), y: 0.62 },
    { x: moment("2016-10-11T09:19:30.420Z"), y: 2.81 },
    { x: moment("2016-10-11T09:22:30.420Z"), y: 0.87 },
    { x: moment("2016-10-11T09:25:30.420Z"), y: 0.15 },
    { x: moment("2016-10-11T09:28:30.420Z"), y: 0.51 },
    { x: moment("2016-10-11T09:31:30.420Z"), y: 2.26 },
    { x: moment("2016-10-11T09:34:30.420Z"), y: 2.2 },
    { x: moment("2016-10-11T09:37:30.420Z"), y: 2.41 },
    { x: moment("2016-10-11T09:40:30.420Z"), y: 0.63 },
    { x: moment("2016-10-11T09:43:30.420Z"), y: 1.52 },
    { x: moment("2016-10-11T09:46:30.420Z"), y: 0.17 },
    { x: moment("2016-10-11T09:49:30.420Z"), y: 2.6 },
    { x: moment("2016-10-11T09:52:30.420Z"), y: 0.77 },
    { x: moment("2016-10-11T09:55:30.420Z"), y: 3 },
    { x: moment("2016-10-11T09:58:30.420Z"), y: 1.04 },
    { x: moment("2016-10-11T10:01:30.420Z"), y: 3.62 },
    { x: moment("2016-10-11T10:04:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:07:30.420Z"), y: 3.01 },
    { x: moment("2016-10-11T10:10:30.420Z"), y: 0.8 },
    { x: moment("2016-10-11T10:13:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:16:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:19:30.420Z"), y: 2.43 },
    { x: moment("2016-10-11T10:22:30.420Z"), y: 1.25 },
    { x: moment("2016-10-11T10:25:30.420Z"), y: 2.31 },
    { x: moment("2016-10-11T10:28:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:31:30.420Z"), y: 1.53 },
    { x: moment("2016-10-11T10:34:30.420Z"), y: 2.22 },
    { x: moment("2016-10-11T10:37:30.420Z"), y: 0.26 },
    { x: moment("2016-10-11T10:40:30.420Z"), y: 2.38 },
    { x: moment("2016-10-11T10:43:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:46:30.420Z"), y: 2.37 },
    { x: moment("2016-10-11T10:49:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:52:30.420Z"), y: 2.46 },
    { x: moment("2016-10-11T10:55:30.420Z"), y: 0 },
    { x: moment("2016-10-11T10:58:30.420Z"), y: 1.11 },
    { x: moment("2016-10-11T11:01:30.420Z"), y: 2.34 },
    { x: moment("2016-10-11T11:04:30.420Z"), y: 2.33 },
    { x: moment("2016-10-11T11:07:30.420Z"), y: 2.86 },
    { x: moment("2016-10-11T11:10:30.420Z"), y: 1.74 },
    { x: moment("2016-10-11T11:13:30.420Z"), y: 0 },
    { x: moment("2016-10-11T11:16:30.420Z"), y: 3.28 },
    { x: moment("2016-10-11T11:19:30.420Z"), y: 0.58 },
    { x: moment("2016-10-11T11:22:30.420Z"), y: 1.68 },
    { x: moment("2016-10-11T11:25:30.420Z"), y: 0.68 },
    { x: moment("2016-10-11T11:28:30.420Z"), y: 1.66 },
    { x: moment("2016-10-11T11:31:30.420Z"), y: 2.28 },
    { x: moment("2016-10-11T11:34:30.420Z"), y: 12.48 },
    { x: moment("2016-10-11T11:37:30.420Z"), y: 11.59 },
    { x: moment("2016-10-11T11:40:30.420Z"), y: 10.62 },
    { x: moment("2016-10-11T11:43:30.420Z"), y: 12.26 },
    { x: moment("2016-10-11T11:46:30.420Z"), y: 12.47 },
    { x: moment("2016-10-11T11:49:30.420Z"), y: 10.57 },
    { x: moment("2016-10-11T11:52:30.420Z"), y: 13.56 },
    { x: moment("2016-10-11T11:55:30.420Z"), y: 0 },
    { x: moment("2016-10-11T11:58:30.420Z"), y: 13.34 },
    { x: moment("2016-10-11T12:01:30.420Z"), y: 11.06 },
    { x: moment("2016-10-11T12:04:30.420Z"), y: 2.82 },
    { x: moment("2016-10-11T12:07:30.420Z"), y: 11.56 },
    { x: moment("2016-10-11T12:10:30.420Z"), y: 12.73 },
    { x: moment("2016-10-11T12:13:30.420Z"), y: 10.56 },
    { x: moment("2016-10-11T12:16:30.420Z"), y: 0.37 },
    { x: moment("2016-10-11T12:19:30.420Z"), y: 13.32 },
    { x: moment("2016-10-11T12:22:30.420Z"), y: 10.23 },
    { x: moment("2016-10-11T12:25:30.420Z"), y: 13.6 },
    { x: moment("2016-10-11T12:28:30.420Z"), y: 10.29 },
    { x: moment("2016-10-11T12:31:30.420Z"), y: 0 },
    { x: moment("2016-10-11T12:34:30.420Z"), y: 12.68 },
    { x: moment("2016-10-11T12:37:30.420Z"), y: 10.23 },
    { x: moment("2016-10-11T12:40:30.420Z"), y: 1.35 },
    { x: moment("2016-10-11T12:43:30.420Z"), y: 12.93 },
    { x: moment("2016-10-11T12:46:30.420Z"), y: 11.51 },
    { x: moment("2016-10-11T12:49:30.420Z"), y: 12.6 },
    { x: moment("2016-10-11T12:52:30.420Z"), y: 2.09 },
    { x: moment("2016-10-11T12:55:30.420Z"), y: 10.77 },
    { x: moment("2016-10-11T12:58:30.420Z"), y: 10 },
    { x: moment("2016-10-11T13:01:30.420Z"), y: 11.9 },
    { x: moment("2016-10-11T13:04:30.420Z"), y: 10.34 },
    { x: moment("2016-10-11T13:07:30.420Z"), y: 13.9 },
    { x: moment("2016-10-11T13:10:30.420Z"), y: 10.8 },
    { x: moment("2016-10-11T13:13:30.420Z"), y: 10.5 },
    { x: moment("2016-10-11T13:16:30.420Z"), y: 0.09 },
    { x: moment("2016-10-11T13:19:30.420Z"), y: 10.4 },
    { x: moment("2016-10-11T13:22:30.420Z"), y: 12.03 },
    { x: moment("2016-10-11T13:25:30.420Z"), y: 12.69 },
    { x: moment("2016-10-11T13:28:30.420Z"), y: 12.52 },
    { x: moment("2016-10-11T13:31:30.420Z"), y: 0.65 },
    { x: moment("2016-10-11T13:34:30.420Z"), y: 11.59 },
    { x: moment("2016-10-11T13:37:30.420Z"), y: 10.46 },
    { x: moment("2016-10-11T13:40:30.420Z"), y: 0 },
];
