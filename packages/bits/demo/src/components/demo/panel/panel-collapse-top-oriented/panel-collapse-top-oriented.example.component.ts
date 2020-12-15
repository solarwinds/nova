import { Component, Inject, Input } from "@angular/core";
import { IMenuGroup, ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-panel-collapse-top-oriented-example",
    templateUrl: "./panel-collapse-top-oriented.example.component.html",
})

export class PanelCollapseTopOrientedExampleComponent {
    @Input() isOn = true;

    constructor(@Inject(ToastService) private toastService: ToastService) {
    }

    public itemsSource: IMenuGroup[] = [
        {header: $localize `section title`, itemsSource: [
                {title: $localize `Menu Item`, itemType: "action", action: this.actionDone.bind(this)},
                {title: $localize `Hover me`, itemType: "action", action: this.actionDone.bind(this)},
                {title: $localize `Selected menu item`, isSelected: true},
                {title: $localize `Menu item`, itemType: "switch", checked: true},
                {title: $localize `Menu disabled item`, itemType: "switch", checked: false, disabled: true},
                {title: $localize `Menu item with checkbox`, itemType: "option", disabled: true},
                {title: $localize `Menu item with icon`, itemType: "action", icon: "table"},
                {title: $localize `Link menu item`, itemType: "link", url: "#button", disabled: true},
                {title: $localize `Export PDF`, itemType: "link", icon: "export-pdf", url: "#button"},
            ]},
    ];

    private actionDone(): void {
        this.toastService.info({
            message: $localize `Action Done!!`,
            title: $localize `Menu Action`,
        });
    }
}
