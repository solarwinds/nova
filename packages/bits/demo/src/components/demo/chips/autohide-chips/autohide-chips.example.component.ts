import { Component, Inject } from "@angular/core";
import { IChipsItem, IChipsItemsSource, IToastService, ToastService } from "@nova-ui/bits";
import _pull from "lodash/pull";

const horizontalFlatItems: IChipsItem[] = [
    {id: "flatId1", label: "Down"},
    {id: "flatId2", label: "Critical"},
    {id: "flatId3", label: "Warning"},
    {id: "flatId4", label: "Unknown"},
    {id: "flatId5", label: "Ok"},
];

@Component({
    selector: "nui-autohide-chips-example",
    templateUrl: "autohide-chips.example.component.html",
})
export class AutohideChipsExampleComponent {
    public horizontalFlatItemsSource: IChipsItemsSource = { flatItems: horizontalFlatItems};

    public onClear(event: { item: IChipsItem }) {
        console.log(`'onClear' event fired. $event.item.id=${event.item.id}`);
        _pull(this.horizontalFlatItemsSource.flatItems || [], event.item);
    }

    public onClearAll() {
        this.horizontalFlatItemsSource.flatItems = [];
    }
}
