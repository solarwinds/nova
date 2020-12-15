import { Component } from "@angular/core";
import { TooltipDirective } from "@nova-ui/bits";

@Component({
    selector: "nui-tooltip-trigger-example",
    templateUrl: "tooltip-trigger.example.component.html",
})

export class TooltipTriggerExampleComponent {
    public tooltipText = "I am a Tooltip!";
    public isDisabled = false;

    constructor() {}

    public disableTooltip(state: boolean) {
        this.isDisabled = state;
        // We only set the tooltip to a disabled state above to hide the tooltip.
        // Now we want to enable it back, so it works with the click event.
        setTimeout(() => this.isDisabled = !state, 0);
    }

    public handleClick(event: MouseEvent, tooltip: TooltipDirective) {
        event.stopPropagation();
        tooltip.show();
    }
}
