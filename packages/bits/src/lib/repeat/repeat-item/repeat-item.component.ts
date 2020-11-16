import {
    Component,
    Input,
    ViewEncapsulation
} from "@angular/core";

/**
 * @ignore
 * <example-url>./../examples/index.html#/repeat-item</example-url>
 */
@Component({
    selector: "nui-repeat-item",
    templateUrl: "./repeat-item.component.html",
    styleUrls: ["./repeat-item.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class RepeatItemComponent {

    @Input() public clickable = false;

    @Input() public nowrap = false;

    @Input() public selected = false;
}
