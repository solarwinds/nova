import { Component } from "@angular/core";
import { IChipsItem, IChipsItemsSource } from "@nova-ui/bits";
import _pull from "lodash/pull";

const verticalFlatItems: IChipsItem[] = [
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Critical" },
    { id: "flatId3", label: "Warning" },
    { id: "flatId4", label: "Unknown" },
    { id: "flatId5", label: "Ok" },
];

@Component({
    selector: "nui-vertical-flat-chips-example",
    templateUrl: "vertical-flat-chips.example.component.html",
})

export class VerticalFlatChipsExampleComponent {
    public verticalFlatItemsSource: IChipsItemsSource = { flatItems: verticalFlatItems };

    public onClear(event: { item: IChipsItem }): void {
        console.log(`'onClear' event fired. $event.item.id=${event.item.id}`);
        _pull(this.verticalFlatItemsSource.flatItems || [], event.item);
    }

    public onClearAll(): void {
        this.verticalFlatItemsSource.flatItems = [];
    }
}
