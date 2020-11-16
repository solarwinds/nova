import { animate, style, transition, trigger } from "@angular/animations";
import { ChangeDetectionStrategy, Component, Input, TemplateRef } from "@angular/core";

@Component({
    selector: "nui-chart-tooltip",
    styleUrls: ["./chart-tooltip.component.less"],
    templateUrl: "./chart-tooltip.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger("tooltip", [
            transition(":enter", [
                style({ opacity: 0 }),
                animate(300, style({ opacity: 1 })),
            ]),
            transition(":leave", [
                animate(300, style({ opacity: 0 })),
            ]),
        ]),
    ],
})
export class ChartTooltipComponent {
    @Input() template: TemplateRef<any>;
}
