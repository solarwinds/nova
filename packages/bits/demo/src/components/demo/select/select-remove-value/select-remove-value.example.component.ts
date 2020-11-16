import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "nui-select-remove-value",
    templateUrl: "./select-remove-value.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectRemoveValueExampleComponent {
    public dataset = {
        items: [
            $localize `Item 1`,
            $localize `Item 2`,
            $localize `Item 3`,
            $localize `Item 4`,
            $localize `Item 5`,
        ],
    };

    constructor() { }
}
