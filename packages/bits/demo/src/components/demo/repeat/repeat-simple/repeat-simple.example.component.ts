import { Component } from "@angular/core";


@Component({
    selector: "nui-repeat-simple-example",
    templateUrl: "./repeat-simple.example.component.html",
})
export class RepeatSimpleExampleComponent {
    public colors = [
        { color: $localize `blue` },
        { color: $localize `green` },
        { color: $localize `yellow` },
        { color: $localize `cyan` },
        { color: $localize `magenta` },
        { color: $localize `black` },
    ];

    constructor() { }
}
