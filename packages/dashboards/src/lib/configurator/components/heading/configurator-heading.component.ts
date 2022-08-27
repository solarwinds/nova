import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from "@angular/core";

import { ConfiguratorHeadingService } from "../../services/configurator-heading.service";

@Component({
    selector: "nui-configurator-heading",
    templateUrl: "./configurator-heading.component.html",
    styleUrls: ["./configurator-heading.component.less"],
})
export class ConfiguratorHeadingComponent implements OnChanges {
    @Input() public configuratorTitle: string;
    @Input() public disableCloseButton = false;

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() public close = new EventEmitter();

    constructor(
        public el: ElementRef,
        private heading: ConfiguratorHeadingService
    ) {}

    public ngOnChanges() {
        this.heading.height$.next(
            +getComputedStyle(this.el.nativeElement).height.slice(0, -2)
        );
    }
}
