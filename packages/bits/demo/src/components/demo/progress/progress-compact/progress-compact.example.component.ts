import { Component } from "@angular/core";

@Component({
    selector: "nui-progress-compact-example",
    templateUrl: "./progress-compact.example.component.html",
})
export class ProgressCompactExampleComponent {
    public show = false;

    public toggleProgress(): void {
        this.show = !this.show;
    }
}
