import { ChangeDetectionStrategy, Component, Inject } from "@angular/core";
import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-select-v2-custom-content-example",
    templateUrl: "./select-v2-custom-content.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ["select-v2-custom-content.example.component.less"],
})
export class SelectV2CustomContentExampleComponent {
    public items = [
        {
            headerName: $localize`Saved Data Filters`,
            options: [
                {
                    id: 1,
                    name: $localize`All Services`,
                    icon: "check",
                },
                {
                    id: 2,
                    name: $localize`Unified Communication Apps`,
                    icon: "execute",
                },
            ],
        },
    ];

    constructor(@Inject(ToastService) private toastService: ToastService) {}

    public actionSimulation(event: Event) {
        this.toastService.info({
            message: $localize`Action Occurred!`,
        });
        event?.stopPropagation();
    }
}
