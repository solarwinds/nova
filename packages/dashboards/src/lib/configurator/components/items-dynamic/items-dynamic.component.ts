import { CdkDragDrop, CdkDragStart } from "@angular/cdk/drag-drop";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IEvent, LoggerService } from "@nova-ui/bits";
import { startWith, takeUntil } from "rxjs/operators";

import { BaseLayout } from "../../../components/layouts/base-layout";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { IComponentConfiguration, IHasChangeDetector, IHasForm } from "../../../types";
import { IItemConfiguration } from "../types";

/** @ignore */
@Component({
    selector: "nui-items-dynamic",
    templateUrl: "./items-dynamic.component.html",
    styleUrls: ["items-dynamic.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class ItemsDynamicComponent extends BaseLayout implements IHasChangeDetector, IHasForm<FormArray>, OnInit, OnDestroy {
    static lateLoadKey = "ItemsDynamicComponent";

    @Input() items: IItemConfiguration[] = [];
    @Input() moveButtons = true;
    @Input() nodes: string[];
    @Input() headerPrefix: string;
    @Output() formReady = new EventEmitter<FormArray>();
    @Output() itemsChange = new EventEmitter();

    public form: FormArray;
    public height: number;
    public headerMap: Map<string, string> = new Map<string, string>();

    constructor(changeDetector: ChangeDetectorRef,
                pizzagnaService: PizzagnaService,
                logger: LoggerService,
                private formBuilder: FormBuilder) {
        super(changeDetector, pizzagnaService, logger);
    }

    public getItemForNode(node: IComponentConfiguration): IItemConfiguration | undefined {
        return this.items.find(item => item.id === node.id);
    }

    public getNodes() {
        return this.nodes;
    }

    public ngOnInit(): void {
        this.form = this.formBuilder.array([], Validators.required);
        this.formReady.emit(this.form);
    }

    public onEvent(componentId: string, event: IEvent) {
        // TODO: refactor
        const item = this.items.find(i => i.id === componentId);
        const index = this.items.findIndex(i => i.id === componentId);

        if (event.id === "formReady" && item) {
            this.onFormReady(item, event.payload, index);
        }

        if (event.id === "formDestroy") {
            this.onFormDestroy(event.payload);
        }
    }

    public onFormReady(item: IItemConfiguration, form: FormGroup, index: number) {
        const childForm = this.formBuilder.group({
            id: [item.id],
            componentType: [item.componentType],
            properties: form,
        });

        this.form.setControl(index, childForm);

        setTimeout(() => {
            const label = form.get(`${item.id}/description`)?.get("label");
            label?.valueChanges
                .pipe(startWith(label.value), takeUntil(this.destroyed$))
                .subscribe((value: string) => {
                    this.headerMap.set(item.id, value || "");
                    this.changeDetector.markForCheck();
                });
        });
    }

    public onFormDestroy(form: FormGroup) {
        // using setTimeout to allow the change detection cycle to finish before updating the form
        setTimeout(() => {
            // remove form
            let i = 0;
            for (; i < this.form.length; i++) {
                if (this.form.at(i).get("properties") === form) {
                    break;
                }
            }

            this.form.removeAt(i);
            // triggers form change
            this.form.patchValue(this.form.value, {emitEvent: true});
        });
    }

    public trackBy(index: number, item: IItemConfiguration) {
        return item.id;
    }

    public removeItem(item: IItemConfiguration | undefined, index: number): void {
        if (!item) {
           throw new Error("Unable to remove undefined item from pizzagna");
        }

        // remove item configuration - this will cause the onFormDestroy to be called for related form after component disappears from the view
        this.itemsChange.emit(this.items.filter(it => it !== item));
        this.items.splice(index, 1);

        this.nodes.splice(index, 1);
        this.pizzagnaService.removeComponents(item.id);

    }

    public moveItem(index: number, toIndex: number) {
        const items = [...this.items];
        const item = items.splice(index, 1);
        items.splice(toIndex, 0, ...item);

        const nodes = [...this.nodes];
        const node = nodes.splice(index, 1);
        nodes.splice(toIndex, 0, ...node);
        this.nodes = [...nodes];

        this.moveFormValues(index, toIndex);
        this.itemsChange.emit(items);
        // triggers form change - setTimeout because we need to wait first for items to update
        // console.log(this.form.value);
        setTimeout(() => {
            this.form.setValue(this.form.value, {emitEvent: true});
        });
    }

    public drop(event: CdkDragDrop<string[]>) {
        this.moveItem(event.previousIndex, event.currentIndex);
    }

    public cdkDragStarted(event: CdkDragStart): void {
        this.height = event.source.element.nativeElement.offsetHeight;
    }

    private moveFormValues(index: number, toIndex: number) {
        const oldValue = this.form.at(index);
        this.form.removeAt(index);
        this.form.insert(toIndex, oldValue);
    }

    public ngOnDestroy() {
        // Ensures that any base class observables are unsubscribed.
        super.ngOnDestroy();
    }
}
