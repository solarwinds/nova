import { Component } from "@angular/core";
import { IChipsItem, IChipsItemsSource } from "@nova-ui/bits";
import _pull from "lodash/pull";

const horizontalFlatItems: IChipsItem[] = [
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Critical" },
    { id: "flatId3", label: "Warning" },
    { id: "flatId4", label: "Unknown" },
    { id: "flatId5", label: "Ok" },
];

@Component({
    selector: "nui-basic-chips-example",
    templateUrl: "./basic-chips.example.component.html",
})
export class BasicChipsExampleComponent {
    public horizontalFlatItemsSource: IChipsItemsSource = { flatItems: horizontalFlatItems };

    public onClear(event: { item: IChipsItem }): void {
        console.log(`'onClear' event fired. $event.item.id=${event.item.id}`);
        _pull(this.horizontalFlatItemsSource.flatItems || [], event.item);
    }

    public onClearAll(): void {
        this.horizontalFlatItemsSource.flatItems = [];
    }
}
