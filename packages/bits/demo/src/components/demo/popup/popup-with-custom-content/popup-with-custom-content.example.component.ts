import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";


@Component({
    selector: "nui-popup-with-custom-content-example",
    templateUrl: "./popup-with-custom-content.example.component.html",
    styleUrls: ["./popup-with-custom-content.example.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class PopupWithCustomContentComponent implements OnInit {

    public demoFormGroup: FormGroup;
    public icon = "caret-down";
    public width = "200px";
    public itemsSource: string[] = [
        $localize `Item 1`,
        $localize `Item 2`,
        $localize `Item 3`,
        $localize `Item 4`,
    ];

    constructor(private formBuilder: FormBuilder) {}

    public ngOnInit() {
        this.demoFormGroup = this.formBuilder.group({
            checkboxGroup: this.formBuilder.control([this.itemsSource[0], this.itemsSource[1], this.itemsSource[2]], [
                Validators.required, Validators.minLength(3)]),
        });
    }

    public handleClick(event: MouseEvent) {
        event.stopPropagation();
    }

}
