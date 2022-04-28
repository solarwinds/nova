import { Component } from "@angular/core";

@Component({
    selector: "nui-repeat-disabled-multi-selection-example",
    templateUrl: "./repeat-disabled-multi-selection.example.component.html",
})
export class RepeatDisabledMultiSelectionExampleComponent {
    public colors = Object.freeze([
        { color: $localize `blue`, disabled: true },
        { color: $localize `green`, disabled: false },
        { color: $localize `yellow` },
        { color: $localize `cyan` },
        { color: $localize `magenta`, disabled: true },
        { color: $localize `black` },
    ]);

    public preventRowClick: boolean = false;

    public selectedColors = [
        this.colors[0],
        this.colors[5],
    ];
}
