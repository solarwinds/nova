import { Component } from "@angular/core";


@Component({
    selector: "nui-repeat-multi-selection-example",
    templateUrl: "./repeat-multi-selection.example.component.html",
})
export class RepeatMultiSelectionExampleComponent {
    public colors = [
        { color: $localize `blue` },
        { color: $localize `green` },
        { color: $localize `yellow` },
        { color: $localize `cyan` },
        { color: $localize `magenta` },
        { color: $localize `black` },
    ];

    public narrowRowSelectedColors = [
        this.colors[2],
        this.colors[5],
    ];

    constructor() { }

    public onNarrowRowSelectionChange(selection: any) {
        this.narrowRowSelectedColors = selection;
    }
}
