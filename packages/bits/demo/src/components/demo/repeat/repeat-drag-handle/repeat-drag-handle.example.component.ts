import { Component, ViewEncapsulation } from "@angular/core";

import { IItemsReorderedEvent } from "@nova-ui/bits";

@Component({
    selector: "nui-repeat-drag-handle-example",
    templateUrl: "./repeat-drag-handle.example.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RepeatDragHandleExampleComponent {
    public companies: string[] = ["Adobe", "IBM", "Dell", "Microsoft"];

    public onItemsReordered(event: IItemsReorderedEvent<string>): void {
        // update items according to the new order
        this.companies = event.currentState;
    }
}
