import {Component, Input} from "@angular/core";

@Component({
    selector: "nui-repeat-radio-selection-mode-example",
    templateUrl: "./repeat-radio-selection-mode.example.component.html",
})
export class RepeatRadioSelectionModeExampleComponent {
    @Input() public colors = [
        { color: $localize `blue` },
        { color: $localize `green` },
        { color: $localize `yellow` },
        { color: $localize `cyan` },
        { color: $localize `magenta` },
        { color: $localize `black` },
    ];

    public selectedColors = [this.colors[1]];

    constructor() { }

    public onColorSelectionChange(selection: any) {
        this.selectedColors = selection;
    }
}
