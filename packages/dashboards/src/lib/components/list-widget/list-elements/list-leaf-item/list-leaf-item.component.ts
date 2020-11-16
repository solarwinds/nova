import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "nui-list-leaf-item",
    templateUrl: "./list-leaf-item.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: "w-100" },
    styleUrls: ["list-leaf-item.component.less"],
})
export class ListLeafItemComponent {
    static lateLoadKey = "ListLeafItemComponent";

    @Input() public icon: string;
    @Input() public iconStatus: string;
    @Input() public status: string;
    @Input() public detailedUrl: string;
    @Input() public label: string;

    @Input() public canNavigate: boolean;

    @Output() public navigated = new EventEmitter<ListLeafItemComponent>();

    onButtonClick() {
        if (this.canNavigate) {
            this.navigated.emit(this);
        }
    }
}
