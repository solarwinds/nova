import {
    Component,
    EventEmitter,
    Input,
    Output,
    ViewEncapsulation,
} from "@angular/core";

import { IChipsGroup, IChipsItem, IChipsItemsSource } from "../public-api";

@Component({
    selector: "nui-chips-overflow",
    templateUrl: "./chips-overflow.component.html",
    styleUrls: ["./chips-overflow.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: { class: "nui-chips-overflow" },
})
export class ChipsOverflowComponent {
    @Input() overflowSource: IChipsItemsSource;
    @Input() itemsSource: IChipsItemsSource;

    @Output() public chipRemoved = new EventEmitter<{
        item: IChipsItem;
        group?: IChipsGroup;
    }>();

    public onClear(data: { item: IChipsItem; group?: IChipsGroup }) {
        if (data.group) {
            data.group = this.itemsSource.groupedItems?.find((g) =>
                g.items.find((item) => item === data.item)
            );
        }
        this.chipRemoved.emit(data);
    }
}
