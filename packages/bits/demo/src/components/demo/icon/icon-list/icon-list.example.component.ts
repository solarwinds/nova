import { Component, OnInit } from "@angular/core";

import { icons as iconsData } from "../../../../../../src/lib/icon/icons";

@Component({
    selector: "nui-icon-list-example",
    templateUrl: "./icon-list.example.component.html",
})

export class IconListExampleComponent implements OnInit {
    public icons: any[];
    public categories: any[];

    public ngOnInit(): void {

        this.icons = iconsData;
        this.categories = this.getCategories(iconsData);
    }

    private getCategories(icons: any[]) {
        const categories = [];
        for (const icon of icons) {
            if (categories.indexOf(icon.category) === -1) {
                categories.push(icon.category);
            }
        }
        return categories;
    }
}
