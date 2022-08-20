import { Component, ViewEncapsulation } from "@angular/core";
import { IItemsReorderedEvent, IRepeatItem } from "@nova-ui/bits";

interface IRepeatCompanyItem extends IRepeatItem {
    name: string;
    disabled?: boolean;
    preview?: string;
}

@Component({
    selector: "nui-repeat-drag-preview-example",
    templateUrl: "./repeat-drag-preview.example.component.html",
    styleUrls: ["./repeat-drag-preview.example.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class RepeatDragPreviewExampleComponent {
    public companies: IRepeatCompanyItem[] = [
        {
            name: "Adobe",
            preview:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/524px-Adobe_Systems_logo_and_wordmark.svg.png",
        },
        {
            name: "IBM",
            preview:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/800px-IBM_logo.svg.png",
        },
        {
            name: "Dell",
            preview:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/300px-Dell_Logo.svg.png",
        },
        {
            name: "Microsoft",
            preview:
                "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        },
    ];

    public onItemsReordered(
        event: IItemsReorderedEvent<IRepeatCompanyItem>
    ): void {
        // update items according to the new order
        this.companies = event.currentState;
    }
}
