import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "nui-entity-formatting-configuration",
    templateUrl: "./entity-formatting-configuration.component.html",
    styles: [
        `
            .entity-formatting__accordion-content {
                padding: 15px 15px 15px 46px;
            }
        `,
    ],
})
export class EntityFormattingConfigurationComponent
    implements OnInit, OnChanges
{
    public static lateLoadKey = "EntityFormattingComponent";

    @Input() mappingKeys: string[];
    @Input() dataFieldIds: { [key: string]: string };

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup = this.formBuilder.group({
        dataFieldIds: this.formBuilder.group({
            icon: "",
            status: "",
            detailedUrl: "",
            label: "",
            url: "",
        }),
    });

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.dataFieldIds) {
            this.getFieldMappingsControl.setValue(
                changes.dataFieldIds.currentValue
            );
        }
    }

    public get getFieldMappingsControl(): FormGroup {
        return this.form.get("dataFieldIds") as FormGroup;
    }
}
