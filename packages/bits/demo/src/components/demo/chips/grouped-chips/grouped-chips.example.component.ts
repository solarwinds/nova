import { Component } from "@angular/core";
import { IChipsGroup, IChipsItem } from "@nova-ui/bits";
import _cloneDeep from "lodash/cloneDeep";
import _pull from "lodash/pull";

const groupedItems: IChipsGroup[] = [
    {
        id: "statusGroupId", label: "Status", items: [
            {id: "statusGroupItem1", label: "Down"},
            {id: "statusGroupItem2", label: "Critical"},
            {id: "statusGroupItem3", label: "Warning"},
            {id: "statusGroupItem4", label: "Unknown"},
            {id: "statusGroupItem5", label: "Ok"}],
    },
    {
        id: "vendorGroupId", label: "Vendor", items: [
            {id: "vendorGroupItem1", label: "Cisco"},
            {id: "vendorGroupItem2", label: "Hewlett Packard"},
            {id: "vendorGroupItem3", label: "Uniper"}],
    },
];

@Component({
    selector: "nui-grouped-chips-example",
    templateUrl: "./grouped-chips.example.component.html",
})

export class GroupedChipsExampleComponent {
    public horizontalGroupedItemsSource = {groupedItems: _cloneDeep(groupedItems)};

    public onClear(event: { item: IChipsItem, group?: IChipsGroup }) {
        console.log(`'onClear' event fired. $event.item.id=${event.item.id} $event.group.id=${event.group?.id}`);
        _pull(event.group?.items || [], event.item);
    }

    public onClearAll() {
        this.horizontalGroupedItemsSource.groupedItems = [];
    }
}
