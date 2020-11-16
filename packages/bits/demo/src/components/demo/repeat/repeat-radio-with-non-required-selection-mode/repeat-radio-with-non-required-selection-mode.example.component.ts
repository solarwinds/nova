import { Component } from "@angular/core";


@Component({
    selector: "nui-repeat-radio-with-non-required-selection-mode-example",
    templateUrl: "./repeat-radio-with-non-required-selection-mode.example.component.html",
})
export class RepeatRadioWithNonRequiredSelectionModeExampleComponent {
    public colors = [
        { color: $localize `blue`, disabled: true},
        { color: $localize `green`},
        { color: $localize `yellow`, disabled: true},
        { color: $localize `cyan`},
        { color: $localize `magenta`},
        { color: $localize `black`},
    ];

    public selectedColors = [this.colors[1]];
    public selectedMode: string = "radioWithNonRequiredSelection";

    constructor() { }

    public onColorSelectionChange(selection: any) {
        this.selectedColors = selection;
    }
}
