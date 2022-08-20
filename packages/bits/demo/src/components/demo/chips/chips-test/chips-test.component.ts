import { Component } from "@angular/core";
import { IChipsGroup, IChipsItem, IChipsItemsSource } from "@nova-ui/bits";
import _cloneDeep from "lodash/cloneDeep";
import _pull from "lodash/pull";

const horizontalFlatItems: IChipsItem[] = [
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Critical" },
    { id: "flatId3", label: "Warning" },
    { id: "flatId4", label: "Unknown" },
    { id: "flatId5", label: "Ok" },
];

const verticalFlatItems: IChipsItem[] = [
    { id: "flatId1", label: "Down" },
    { id: "flatId2", label: "Critical" },
    { id: "flatId3", label: "Warning" },
    { id: "flatId4", label: "Unknown" },
    { id: "flatId5", label: "Ok" },
];

const groupedItems: IChipsGroup[] = [
    {
        id: "statusGroupId",
        label: "Status",
        items: [
            { id: "statusGroupItem1", label: "Down" },
            { id: "statusGroupItem2", label: "Critical" },
            { id: "statusGroupItem3", label: "Warning" },
            { id: "statusGroupItem4", label: "Unknown" },
            { id: "statusGroupItem5", label: "Ok" },
        ],
    },
    {
        id: "vendorGroupId",
        label: "Vendor",
        items: [
            { id: "vendorGroupItem1", label: "Cisco" },
            { id: "vendorGroupItem2", label: "Hewlett Packard" },
            { id: "vendorGroupItem3", label: "Uniper" },
        ],
    },
];

@Component({
    selector: "chips-test-component",
    templateUrl: "./chips-test.component.html",
})
export class ChipsTestComponent {
    public horizontalFlatItemsSource: IChipsItemsSource = {
        flatItems: horizontalFlatItems,
    };
    public horizontalGroupedItemsSource = {
        groupedItems: _cloneDeep(groupedItems),
    };
    public verticalFlatItemsSource: IChipsItemsSource = {
        flatItems: verticalFlatItems,
    };
    public verticalGroupedItemsSource: IChipsItemsSource = {
        groupedItems: _cloneDeep(groupedItems),
    };

    public onClear(event: { item: IChipsItem }) {
        _pull(this.horizontalFlatItemsSource.flatItems || [], event.item);
    }

    public onClearVertical(event: { item: IChipsItem }) {
        _pull(this.verticalFlatItemsSource.flatItems || [], event.item);
    }

    public onClearGroup(event: { item: IChipsItem; group?: IChipsGroup }) {
        _pull(event.group?.items || [], event.item);
    }

    public onClearAll() {
        this.verticalGroupedItemsSource.groupedItems = [];
    }

    public onClearAllVerticalFlat() {
        this.verticalFlatItemsSource.flatItems = [];
    }
}
