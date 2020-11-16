import {Component, ViewEncapsulation} from "@angular/core";
import {IItemsReorderedEvent} from "@solarwinds/nova-bits";

@Component({
    selector: "nui-repeat-drag-simple-example",
    templateUrl: "./repeat-drag-simple.example.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class RepeatDragSimpleExampleComponent {
    public companies: string[] = ["Adobe", "IBM", "Dell", "Microsoft"];

    public draggable: boolean = true;

    public onItemsReordered(event: IItemsReorderedEvent<string>): void {
        // update items according to the new order
        this.companies = event.currentState;
    }
}
