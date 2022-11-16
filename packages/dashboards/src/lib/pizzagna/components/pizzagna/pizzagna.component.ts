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
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";

import { EventBus, IEvent, immutableSet, LoggerService } from "@nova-ui/bits";

import { mergeChanges } from "../../../functions/merge-changes";
import {
    DEFAULT_PIZZAGNA_ROOT,
    ISetPropertyPayload,
    SET_PROPERTY_VALUE,
} from "../../../services/types";
import {
    IComponentConfiguration,
    IPizza,
    IPizzagna,
    PizzagnaLayer,
    PIZZAGNA_EVENT_BUS,
} from "../../../types";
import { DynamicComponentCreator } from "../../services/dynamic-component-creator.service";
import { PizzagnaService } from "../../services/pizzagna.service";

@Component({
    selector: "nui-pizzagna",
    templateUrl: "./pizzagna.component.html",
    providers: [
        PizzagnaService,
        DynamicComponentCreator,
        {
            provide: PIZZAGNA_EVENT_BUS,
            useClass: EventBus,
        },
    ],
})
export class PizzagnaComponent implements OnChanges {
    @Input() rootNode = DEFAULT_PIZZAGNA_ROOT;

    @Input()
    get pizzagna(): IPizzagna {
        return this._pizzagnaBuffer || this._pizzagna;
    }

    set pizzagna(value: IPizzagna) {
        this._pizzagna = value;
        this._pizzagnaBuffer = null;
    }

    private _pizzagna: IPizzagna;
    private _pizzagnaBuffer: IPizzagna | null;

    @Input() outputs: string[];

    @Output() pizzagnaChange = new EventEmitter<IPizzagna>();
    @Output() output = new EventEmitter<IEvent>();

    public pizza: Record<string, IComponentConfiguration>;

    constructor(
        public pizzagnaService: PizzagnaService,
        public logger: LoggerService,
        @Inject(PIZZAGNA_EVENT_BUS) public eventBus: EventBus<IEvent>
    ) {
        eventBus
            .getStream(SET_PROPERTY_VALUE)
            .subscribe((event: IEvent<ISetPropertyPayload>) => {
                // TODO: Ensure that payload is defined
                const p = immutableSet(
                    this.pizzagna,
                    // @ts-ignore: Object is possibly 'undefined'.
                    event.payload.path,
                    // @ts-ignore: Object is possibly 'undefined'.
                    event.payload.value
                );

                this._pizzagnaBuffer = p;
                this.pizzagnaChange.emit(p);
            });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.pizzagna) {
            const previousPizzagna = changes.pizzagna
                .previousValue as IPizzagna;

            this.pizzagnaService.updatePizzagna(this.pizzagna);

            this.pizza = this.mergePizzagnaIntoPizza(
                this.pizza,
                previousPizzagna,
                this.pizzagna
            );
            if (this.pizza && !this.pizza[this.rootNode]) {
                this.logger.warn(
                    "Pizzagna doesn't contain root node '" +
                        this.rootNode +
                        "'. Pizzagna = ",
                    this.pizzagna
                );
            }
            this.pizzagnaService.updateComponents(this.pizza);
        }
    }

    public onOutput(event: IEvent): void {
        this.output.emit(event);
    }

    /**
     * This takes all the pizzagna layers and merges them into one component pizza
     *
     * @param pizza
     * @param previousPizzagna
     * @param currentPizzagna
     */
    private mergePizzagnaIntoPizza(
        pizza: IPizza,
        previousPizzagna: IPizzagna,
        currentPizzagna: IPizzagna
    ) {
        return mergeChanges(
            pizza,
            // These are merged in reverse priority order so that values in higher priority layers
            // override the corresponding values in lower priority layers
            this.getLayerChanges(
                previousPizzagna,
                currentPizzagna,
                PizzagnaLayer.Structure
            ),
            this.getLayerChanges(
                previousPizzagna,
                currentPizzagna,
                PizzagnaLayer.Configuration
            ),
            this.getLayerChanges(
                previousPizzagna,
                currentPizzagna,
                PizzagnaLayer.Data
            )
        ) as Record<string, IComponentConfiguration>;
    }

    private getLayerChanges(
        previous: IPizzagna,
        current: IPizzagna,
        overlayKey: string
    ) {
        return {
            previousValue: this.getLayerSafe(previous, overlayKey),
            currentValue: this.getLayerSafe(current, overlayKey),
        };
    }

    private getLayerSafe(pizzagna: IPizzagna, overlayKey: string) {
        return pizzagna && pizzagna[overlayKey];
    }
}
