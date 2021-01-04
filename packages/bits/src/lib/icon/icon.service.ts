import { Injectable } from "@angular/core";

import { icons } from "./icons";
import { IconCategoryNamespace, IconData } from "./public-api";

/**@ignore*/
interface IStatus {
    [key: string]: string;
}
/**@ignore*/
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
        return `<g transform="translate(-${iconNewSize / 2}, -${iconNewSize / 2})">
                    <svg height="${iconNewSize}" width="${iconNewSize}" viewBox="${viewBox ? viewBox : "0 0 20 20"}">
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
            .filter(iconData => {
                if (iconData.cat_namespace === IconCategoryNamespace.Status) {
                    return iconData;
                }
            })
            .reduce((acc: any, curr) => {
                acc[curr.name.split(IconCategoryNamespace.Status)[1]] = curr.code;
                return acc;
            }, {});

        // ensure unique icons by name, so only the last one is available
        this.names = this.icons
            .reduce((acc: any, curr) => {
                acc[curr.name] = curr;
                return acc;
            }, {});
    }
}
