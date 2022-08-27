import { Component, ViewEncapsulation } from "@angular/core";

import {
    IItemsReorderedEvent,
    IRepeatItem,
    IRepeatItemConfig,
} from "@nova-ui/bits";

interface IRepeatColorItem extends IRepeatItem {
    color: string;
    description: string;
}

@Component({
    selector: "nui-repeat-reorder-config-example",
    templateUrl: "./repeat-reorder-item-config-example.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RepeatReorderItemConfigExampleComponent {
    public colors: IRepeatColorItem[] = [
        { color: $localize`blue`, description: "Should be draggable" },
        { color: $localize`green`, description: "Disabled with callback" },
        {
            color: $localize`yellow`,
            disabled: true,
            description: "Disabled with property",
        },
        {
            color: $localize`orange`,
            disabled: false,
            description: "Enabled with property",
        },
    ];

    public draggable: boolean = true;
    public reorderable: boolean = true;

    public itemConfig: IRepeatItemConfig<IRepeatColorItem> = {
        isDraggable: (item) =>
            item.color === $localize`blue` || item.color === $localize`orange`,
        // Note: Using both cases to check if item is disabled, normally we should use only one method
        isDisabled: (item) => item.color === $localize`green` || item.disabled,
        trackBy: (index, item) => item.color,
    };

    public onItemsReordered(
        event: IItemsReorderedEvent<IRepeatColorItem>
    ): void {
        this.colors = event.currentState;
    }
}
