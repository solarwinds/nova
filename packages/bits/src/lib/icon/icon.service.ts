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

import { icons } from "./icons";
import { IconCategoryNamespace, IconData } from "./public-api";

/** @ignore */
interface IStatus {
    [key: string]: string;
}
/** @ignore */
interface IName {
    [key: string]: IconData;
}

/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class IconService {
    public icons: IconData[] = icons;
    private statuses: IStatus;
    private names: IName;

    constructor() {
        this.updateIconStatusesAndNames();
    }

    getIconData(iconName: string): IconData {
        return this.names[iconName];
    }

    getStatusIcon(status: string) {
        return this.statuses[status];
    }

    getIconResized(iconCode: string, iconNewSize: number, viewBox?: string) {
        return `<g transform="translate(-${iconNewSize / 2}, -${
            iconNewSize / 2
        })">
                    <svg height="${iconNewSize}" width="${iconNewSize}" viewBox="${
            viewBox ? viewBox : "0 0 20 20"
        }">
                        ${iconCode}
                    </svg>
                </g>`;
    }

    /**
     * Allows registering additional icons from other sources
     *
     * @param iconsList
     */
    public registerIcons(iconsList: IconData[]) {
        this.icons.push(...iconsList);

        this.updateIconStatusesAndNames();
    }

    private updateIconStatusesAndNames() {
        this.statuses = this.icons
            .filter((iconData) => {
                if (iconData.cat_namespace === IconCategoryNamespace.Status) {
                    return iconData;
                }
            })
            .reduce((acc: any, curr) => {
                acc[curr.name.split(IconCategoryNamespace.Status)[1]] =
                    curr.code;
                return acc;
            }, {});

        // ensure unique icons by name, so only the last one is available
        this.names = this.icons.reduce((acc: any, curr) => {
            acc[curr.name] = curr;
            return acc;
        }, {});
    }
}
