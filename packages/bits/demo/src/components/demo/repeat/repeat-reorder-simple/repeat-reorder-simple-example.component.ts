import { Component, ViewEncapsulation } from "@angular/core";
import { IItemsReorderedEvent } from "@nova-ui/bits";

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
interface ISortingOrderTrimmedData
    extends Omit<IItemsReorderedEvent, "item" | "dropListRef"> {}
@Component({
    selector: "nui-repeat-reorder-simple-example",
    templateUrl: "./repeat-reorder-simple-example.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RepeatReorderSimpleExampleComponent {
    public companies: string[] = ["Adobe", "IBM", "Dell", "Microsoft"];

    public draggable: boolean = true;
    public reorderable: boolean = true;
    public droppedEventData: ISortingOrderTrimmedData;

    public onItemsReordered(event: IItemsReorderedEvent<string>): void {
        // update items according to the new order
        this.companies = event.currentState;

        // copy all event proprieties except the CdkDrag & CdkDropList references
        const { item, dropListRef, ...rest } = event;
        this.droppedEventData = rest;

        console.log(event);
    }
}
