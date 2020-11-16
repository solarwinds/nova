/**
 * An abstract class (you can call it interface) which allows formField component to access inner components.
 * If there is some element that implements NuiFormFieldControl provided inside, the form field will be able
 * to control isInErrorState of that control.
 * Textbox, combobox, select, timepicker and datepicker are using this.
 */
export abstract class NuiFormFieldControl {
    /** Whether the control is in an error state. */
    public isInErrorState: boolean;

    // TODO: make this field required in v-next
    /** Aria label to set on the tab-focusable item. */
    public ariaLabel?: string;
}
