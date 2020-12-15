import { Component, ViewChild } from "@angular/core";
import {
    IChipsGroup,
    IChipsItem,
    IChipsItemsSource,
    PopoverComponent,
    PopoverOverlayPosition
} from "@nova-ui/bits";
import _pull from "lodash/pull";

const flatItems: IChipsItem[] = [
    {id: "flatId1", label: "Down"},
    {id: "flatId2", label: "Critical"},
    {id: "flatId3", label: "Warning"},
    {id: "flatId1", label: "Down"},
    {id: "flatId2", label: "Critical"},
    {id: "flatId3", label: "Warning"},
    {id: "flatId1", label: "Down"},
    {id: "flatId2", label: "Critical"},
    {id: "flatId3", label: "Warning"},
];

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
    selector: "nui-chips-overflow-example",
    templateUrl: "./chips-overflow.example.component.html",
    styles: [`.nui-chips-overflowed__counter { margin-left: 3px; display: inline-flex; }`],
})
export class ChipsOverflowExampleComponent {
    public horizontalGroupedItemsSource = { flatItems, groupedItems };

    public overflowLinesNumber = 2;
    public overflowCounter: number;
    public overflowSource: IChipsItemsSource;
    public overflowPopoverPosition: PopoverOverlayPosition[] = [PopoverOverlayPosition.bottomLeft, PopoverOverlayPosition.topLeft];

    @ViewChild(PopoverComponent) private popover: PopoverComponent;

    public onClear(event: { item: IChipsItem, group?: IChipsGroup }) {
        console.log(`'onClear' event fired. $event.item.id=${event.item.id} $event.group.id=${event.group?.id}`);
        if (event.group) {
            _pull(event.group.items || [], event.item);
        } else {
            _pull(this.horizontalGroupedItemsSource.flatItems || [], event.item);
        }
    }

    public onClearAll(e: MouseEvent) {
        this.horizontalGroupedItemsSource.groupedItems = [];
        this.horizontalGroupedItemsSource.flatItems = [];
        this.popover?.onClick(e);
    }

    onChipsOverflow(source: IChipsItemsSource) {
        this.overflowSource = source;
        const reducer = (accumulator: number, currentValue: IChipsGroup) => accumulator + currentValue.items.length;
        this.overflowCounter = (this.overflowSource.flatItems?.length || 0) + (this.overflowSource.groupedItems?.reduce(reducer, 0) || 0);
        this.popover?.updatePosition();
    }
}
