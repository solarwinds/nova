import { Component } from "@angular/core";
import { TooltipPosition } from "@solarwinds/nova-bits";

@Component({
    selector: "nui-tooltip-position-example",
    templateUrl: "tooltip-position.example.component.html",
    styleUrls: ["./tooltip-position.example.component.less"],
})

export class TooltipPositionExampleComponent {
    public positions: TooltipPosition[] = [ "top", "bottom", "left", "right" ];
    public selectedPosition: string;
}
