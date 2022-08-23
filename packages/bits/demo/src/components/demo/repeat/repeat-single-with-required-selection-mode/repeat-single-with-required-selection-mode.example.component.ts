import { Component } from "@angular/core";

@Component({
    selector: "nui-repeat-single-with-required-selection-mode-example",
    templateUrl:
        "./repeat-single-with-required-selection-mode.example.component.html",
})
export class RepeatSingleWithRequiredSelectionModeExampleComponent {
    public colors = [
        { color: $localize`blue` },
        { color: $localize`green` },
        { color: $localize`yellow` },
        { color: $localize`cyan` },
        { color: $localize`magenta` },
        { color: $localize`black` },
    ];

    public preventRowClick = false;
    public selectedColors = [this.colors[1]];
}
