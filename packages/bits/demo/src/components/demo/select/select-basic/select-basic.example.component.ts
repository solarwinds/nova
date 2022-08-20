import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "nui-select-basic-example",
    templateUrl: "./select-basic.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBasicExampleComponent {
    public dataset = {
        items: [
            $localize`Item 1`,
            $localize`Item 2`,
            $localize`Item 3`,
            $localize`Item 4`,
            $localize`Item 5`,
            $localize`Item 6`,
            $localize`Item 7`,
            $localize`Item 8`,
            $localize`Item 9`,
            $localize`Item 10`,
            $localize`Item 11`,
            $localize`Item 12`,
            $localize`Item 13`,
            $localize`Item 14`,
            $localize`Item 15`,
            $localize`Item 16`,
            $localize`Item 17`,
            $localize`Item 18`,
            $localize`Item 19`,
            $localize`Item 20`,
        ],
    };

    constructor() {}
}
