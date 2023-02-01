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

import { Injectable } from "@angular/core";
import { Moment } from "moment";

import { TimeseriesZoomPlugin } from "./timeseries-zoom-plugin";

/**
 * This service registers collections of charts identified by given id. It is used primarily by the ChartCollectionId directive.
 */
@Injectable({ providedIn: "root" })
export class TimeseriesZoomPluginsSyncService {
    private collections: { [key: string]: TimeseriesZoomPlugin[] } = {};

    public registerPlugin(
        collectionId: string,
        plugin: TimeseriesZoomPlugin
    ): void {
        const collection = this.collections[collectionId];

        if (!collection) {
            this.collections[collectionId] = [plugin];
        } else {
            this.collections[collectionId].push(plugin);
        }
    }

    public getPlugins(collectionId: string): TimeseriesZoomPlugin[] {
        return this.collections[collectionId] ?? [];
    }

    public removePlugin(
        collectionId: string,
        plugin: TimeseriesZoomPlugin
    ): void {
        if (!this.collections[collectionId]) {
            return;
        }

        const collection = [...this.collections[collectionId]];
        const idx = collection.findIndex((p) => p === plugin);
        if (idx === -1) {
            return;
        }

        collection.splice(idx, 1);
        this.collections[collectionId] = collection;
    }

    public syncPositionInsideCollection(
        collectionId: string,
        startDate: Moment,
        endDate: Moment
    ) {
        const collection = this.getPlugins(collectionId);

        setTimeout(() => {
            collection.forEach((plugin) => {
                plugin.moveBrushByDate(startDate, endDate);
            });
        });
    }

    public clearZoomInsideCollection(collectionId: string) {
        const collection = this.getPlugins(collectionId);

        collection.forEach((plugin) => {
            plugin.clearBrush();
        });
    }
}
