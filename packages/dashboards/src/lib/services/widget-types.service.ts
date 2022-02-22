import { Injectable } from "@angular/core";
import defaultsDeep from "lodash/defaultsDeep";
import set from "lodash/set";

import { PizzagnaLayer } from "../types";
import { IWidget, IWidgetTypeDefinition } from "../components/widget/types";

@Injectable()
export class WidgetTypesService {
    private widgetTypes: Record<string, IWidgetTypeDefinition[]> = {};

    constructor() {
    }

    public registerWidgetType(key: string, version: number, widgetType: IWidgetTypeDefinition): void {
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

    public getWidgetType(type: string, version?: number): IWidgetTypeDefinition {
        const widgetTypeVersions = this.widgetTypes[type];
        if (!widgetTypeVersions || widgetTypeVersions.length === 0) {
            throw new Error("Type '" + type + "' not found in the registry. Available types: " + Object.keys(this.widgetTypes).join(", "));
        }


        if (typeof version !== "undefined" && (version <= 0 || widgetTypeVersions.length < version)) {
            throw new Error("Version " + version + " for widget type '" + type +
                "' not registered. Max available version is " + widgetTypeVersions.length);
        }

        const adjustedVersion = (typeof version === "undefined") ? widgetTypeVersions.length : version;
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

    public setNode(widgetTemplate: IWidgetTypeDefinition, section: "widget" | "configurator", pathKey: string, value: any): void {
        const widgetSection = `${section}.${PizzagnaLayer.Structure}`;
        const itemPath = `${widgetTemplate.paths?.[section]?.[pathKey] || pathKey}`;

        const path = `${widgetSection}.${itemPath}`;
        set(widgetTemplate, path, value);
    }
}
