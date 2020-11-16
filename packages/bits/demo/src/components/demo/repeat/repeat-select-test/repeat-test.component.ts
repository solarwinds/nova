import { Component } from "@angular/core";

@Component({
    selector: "nui-repeat-test",
    templateUrl: "./repeat-test.component.html",
})
export class RepeatTestComponent {

    public colors = [
        { color: $localize `blue`},
        { color: $localize `green`},
        { color: $localize `yellow`},
        { color: $localize `cyan`},
        { color: $localize `magenta`},
        { color: $localize `black`},
    ];

    constructor() { }

    private colorIndex: number = 1;

    public addNewColor(): void {
        this.colors.push(
            { color: `new color ${this.colorIndex++}` }
        );
    }
}
