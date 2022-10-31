// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
} from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { EventBus, IEvent, uuid } from "@nova-ui/bits";

import { KpiComponent } from "../../../../../components/kpi-widget/kpi.component";
import { IPizzagnaProperty } from "../../../../../pizzagna/functions/get-pizzagna-property-path";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import {
    IHasChangeDetector,
    IHasForm,
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
} from "../../../../../types";
import { IItemConfiguration } from "../../../types";
import { IKpiItemConfiguration } from "../types";

/**
 * This component and its related form represent a collection of KPI tile configuration components
 */
@Component({
    selector: "nui-kpi-tiles-configuration-component",
    templateUrl: "./kpi-tiles-configuration.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiTilesConfigurationComponent
    implements IHasChangeDetector, IHasForm, OnChanges
{
    static lateLoadKey = "KpiTilesConfigurationComponent";

    @Input() componentId: string;
    @Input() tiles: IKpiItemConfiguration[] = [];
    @Input() nodes: string[];

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public emptyItems$: Observable<boolean>;

    constructor(
        public pizzagnaService: PizzagnaService,
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>
    ) {}

    ngOnChanges(changes: SimpleChanges): void {}

    public onFormReady(form: AbstractControl) {
        this.form = this.formBuilder.group({
            tiles: form as FormArray,
        });

        this.emptyItems$ = this.form.valueChanges.pipe(
            map((result) => result.tiles.length === 0)
        );
        this.formReady.emit(this.form);
    }

    public onItemsChange(tiles: IItemConfiguration[]) {
        const parentPath = "tiles";
        const componentIds = tiles.map((tile) => tile.id);
        this.pizzagnaService.createComponentsFromTemplate(
            parentPath,
            componentIds
        );

        const property: IPizzagnaProperty = {
            componentId: this.componentId,
            pizzagnaKey: PizzagnaLayer.Data,
            propertyPath: ["tiles"],
        };
        this.pizzagnaService.setProperty(property, tiles);
    }

    public addTile() {
        this.onItemsChange([
            ...this.tiles,
            {
                id: uuid("kpi"),
                componentType: KpiComponent.lateLoadKey,
            },
        ]);
    }
}
