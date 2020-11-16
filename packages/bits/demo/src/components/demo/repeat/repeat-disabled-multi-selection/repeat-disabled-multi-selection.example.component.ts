import { Component } from "@angular/core";


@Component({
    selector: "nui-repeat-disabled-multi-selection-example",
    templateUrl: "./repeat-disabled-multi-selection.example.component.html",
})
export class RepeatDisabledMultiSelectionExampleComponent {
    public colorsWithIsDisabledProperty = [
        { color: $localize `blue`, disabled: true },
        { color: $localize `green`, disabled: false },
        { color: $localize `yellow` },
        { color: $localize `cyan` },
        { color: $localize `magenta`, disabled: true },
        { color: $localize `black` },
    ];

    public selectedColorsWithIsDisabledProperty = [
        this.colorsWithIsDisabledProperty[0],
        this.colorsWithIsDisabledProperty[5],
    ];

    public handleClick(event: any) {
        event.stopPropagation();
    }

    constructor() { }
}
