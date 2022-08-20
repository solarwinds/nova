import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoggerService } from "@nova-ui/bits";

import { IHasChangeDetector, IHasForm } from "../../../../../types";

@Component({
    selector: "nui-title-and-description-configuration",
    templateUrl: "./title-and-description-configuration.component.html",
    styleUrls: ["title-and-description-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleAndDescriptionConfigurationComponent
    implements IHasChangeDetector, IHasForm, OnInit, OnChanges
{
    public static lateLoadKey = "TitleAndDescriptionConfigurationComponent";

    @Input() title: string;
    @Input() url: string;
    @Input() subtitle: string;
    @Input() description: string;
    @Input() collapsible: boolean;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private logger: LoggerService
    ) {
        this.form = this.formBuilder.group({
            title: ["", Validators.required],
            subtitle: [""],
            url: [""],
            description: [""],
            collapsible: [false],
            collapsed: [true], // setting 'collapsed' to true to demonstrate the collapsed appearance in the preview
        });
    }

    public ngOnInit(): void {
        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.title) {
            this.form.get("title")?.setValue(this.title);
        }
        if (changes.url) {
            this.form.get("url")?.setValue(this.url);
        }
        if (changes.subtitle) {
            this.form.get("subtitle")?.setValue(this.subtitle);
        }
        if (changes.description) {
            this.form.get("description")?.setValue(this.description);
        }
        if (changes.collapsible) {
            this.form.get("collapsible")?.setValue(this.collapsible);
        }
    }

    public getSecondaryText() {
        const forTitle =
            this.form.controls["title"].value || $localize`No title`;
        const forSubtitle =
            this.form.controls["subtitle"].value || $localize`no subtitle`;
        return `${forTitle}, ${forSubtitle}`;
    }
}
