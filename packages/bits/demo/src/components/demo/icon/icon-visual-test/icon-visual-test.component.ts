import { Component, OnInit } from "@angular/core";

import { IconStatus } from "@nova-ui/bits";

import { icons as iconsData } from "../../../../../../src/lib/icon/icons";

@Component({
    selector: "nui-icon-visual-test",
    templateUrl: "./icon-visual-test.component.html",
})
export class IconVisualTestComponent implements OnInit {
    public icons: any[];
    public categories: any[];
    public iconStatuses: string[] = Object.values(IconStatus);

    public ngOnInit(): void {
        this.icons = iconsData;
        this.categories = this.getCategories(iconsData);
    }

    public getCategories(icons: any[]) {
        const categories = [];
        for (const icon of icons) {
            if (categories.indexOf(icon.category) === -1) {
                categories.push(icon.category);
            }
        }
        return categories;
    }
}
