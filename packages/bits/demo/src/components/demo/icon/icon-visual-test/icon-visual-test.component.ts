import {Component, OnInit} from "@angular/core";
import {IconStatus} from "@solarwinds/nova-bits";
import uniq from "lodash/uniq";

import {icons as iconsData} from "../../../../../../src/lib/icon/icons";

@Component({
    selector: "nui-icon-visual-test",
    templateUrl: "./icon-visual-test.component.html",
})
export class IconVisualTestComponent implements OnInit {
    public icons: any[];
    public categories: any[];
    // TODO: Remove in V10 | Remove uniq function when the IconStatus enum no longer contains deprecated keys
    // Using uniq to avoid duplication of values from enum that contains two sets of keys (lowercase and uppercase) but the same values
    public iconStatuses: string[] = uniq(Object.values(IconStatus));

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
