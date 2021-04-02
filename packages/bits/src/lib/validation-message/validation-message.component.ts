import {
    Component,
    Input,
    ViewEncapsulation
} from "@angular/core";
/** @ignore */
@Component({
    selector: "nui-validation-message",
    templateUrl: "./validation-message.component.html",
    styleUrls: ["./validation-message.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: { "role": "alert" },
})
export class ValidationMessageComponent {
    /**
     * Optional manual control of message visibility.
     * This allows the form field to manually hide and show the message if needed.
     * Typically, visibility is determined automatically by the validator specified in the "for" input.
     * @type {boolean}
     */
    @Input() public show = false;
    /**
     * Pass the validator name to this input to allow the validator to control the visibility
     * of the message based on the validation state of the associated form field.
     * @type {string}
     */
    @Input() public for: string;
}
