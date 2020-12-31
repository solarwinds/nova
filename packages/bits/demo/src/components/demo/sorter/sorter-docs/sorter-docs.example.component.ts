import { Component } from "@angular/core";
import { IMenuItem, ISortedItem, ISorterChanges, SorterComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-sorter-docs-example",
    templateUrl: "./sorter-docs.example.component.html",
})
export class SorterExampleComponent {
    getSorterPropKey(key: keyof SorterComponent): string {
        return key;
    }

    getISorterChangesInterfaceKey(key: keyof ISorterChanges): string {
        return key;
    }

    getISortedItemInterfaceKey(key: keyof ISortedItem): string {
        return key;
    }

    getIMenuItemInterfaceKey(key: keyof IMenuItem): string {
        return key;
    }
}
