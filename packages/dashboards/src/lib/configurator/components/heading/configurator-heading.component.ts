import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "nui-configurator-heading",
    templateUrl: "./configurator-heading.component.html",
    styleUrls: ["./configurator-heading.component.less"],
})
export class ConfiguratorHeadingComponent {
    @Input() public configuratorTitle: string;
    @Input() public disableCloseButton = false;

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() public close = new EventEmitter();
}
