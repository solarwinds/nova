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
import defaultsDeep from "lodash/defaultsDeep";
import set from "lodash/set";

import { IWidget, IWidgetTypeDefinition } from "../components/widget/types";
import { PizzagnaLayer } from "../types";

@Injectable()
export class WidgetTypesService {
    private widgetTypes: Record<string, IWidgetTypeDefinition[]> = {};

    constructor() {}

    public registerWidgetType(
        key: string,
        version: number,
        widgetType: IWidgetTypeDefinition
    ): void {
        let widgetTypeVersions = this.widgetTypes[key];
        if (!widgetTypeVersions) {
            widgetTypeVersions = [];
            this.widgetTypes[key] = widgetTypeVersions;
        }
        if (widgetTypeVersions.length < version) {
            widgetTypeVersions.length = version;
        }
        widgetTypeVersions[version - 1] = widgetType;
    }

    public getWidgetType(
        type: string,
        version?: number
    ): IWidgetTypeDefinition {
        const widgetTypeVersions = this.widgetTypes[type];
        if (!widgetTypeVersions || widgetTypeVersions.length === 0) {
            throw new Error(
                "Type '" +
                    type +
                    "' not found in the registry. Available types: " +
                    Object.keys(this.widgetTypes).join(", ")
            );
        }

        if (
            typeof version !== "undefined" &&
            (version <= 0 || widgetTypeVersions.length < version)
        ) {
            throw new Error(
                "Version " +
                    version +
                    " for widget type '" +
                    type +
                    "' not registered. Max available version is " +
                    widgetTypeVersions.length
            );
        }

        const adjustedVersion =
            typeof version === "undefined"
                ? widgetTypeVersions.length
                : version;
        return widgetTypeVersions[adjustedVersion - 1];
    }

    /**
     * Take a widget and merge it with the pizzagna of its type
     *
     * @param widget
     *
     * @return new reference of a widget including the pizzagna of its type
     */
    public mergeWithWidgetType(widget: IWidget): IWidget {
        const widgetType = this.getWidgetType(widget.type, widget.version);
        return {
            ...widget,
            pizzagna: defaultsDeep(widget.pizzagna, widgetType.widget),
        };
    }

    public setNode(
        widgetTemplate: IWidgetTypeDefinition,
        section: "widget" | "configurator",
        pathKey: string,
        value: any
    ): void {
        const widgetSection = `${section}.${PizzagnaLayer.Structure}`;
        const itemPath = `${
            widgetTemplate.paths?.[section]?.[pathKey] || pathKey
        }`;

        const path = `${widgetSection}.${itemPath}`;
        set(widgetTemplate, path, value);
    }
}
