import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "nui-spinner-e2e",
    templateUrl: "./spinner-test.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerTestComponent {
    public show1: boolean;
    public show2: boolean;
    public spinPercentage: number;
}
