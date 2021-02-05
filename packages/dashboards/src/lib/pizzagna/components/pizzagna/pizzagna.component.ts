import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { EventBus, IEvent, immutableSet, LoggerService } from "@nova-ui/bits";

import { mergeChanges } from "../../../functions/merge-changes";
import { DEFAULT_PIZZAGNA_ROOT, ISetPropertyPayload, SET_PROPERTY_VALUE } from "../../../services/types";
import { IComponentConfiguration, IPizza, IPizzagna, PizzagnaLayer, PIZZAGNA_EVENT_BUS } from "../../../types";
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

    constructor(public pizzagnaService: PizzagnaService,
                public logger: LoggerService,
                @Inject(PIZZAGNA_EVENT_BUS) public eventBus: EventBus<IEvent>) {
        eventBus.getStream(SET_PROPERTY_VALUE).subscribe((event: IEvent<ISetPropertyPayload>) => {
            // TODO: Ensure that payload is defined
            // @ts-ignore: Object is possibly 'undefined'.
            const p = immutableSet(this.pizzagna, event.payload.path, event.payload.value);

            this._pizzagnaBuffer = p;
            this.pizzagnaChange.emit(p);
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.pizzagna) {
            const previousPizzagna = changes.pizzagna.previousValue as IPizzagna;

            this.pizzagnaService.updatePizzagna(this.pizzagna);

            this.pizza = this.mergePizzagnaIntoPizza(this.pizza, previousPizzagna, this.pizzagna);
            if (this.pizza && !this.pizza[this.rootNode]) {
                this.logger.warn("Pizzagna doesn't contain root node '" + this.rootNode + "'. Pizzagna = ", this.pizzagna);
            }
            this.pizzagnaService.updateComponents(this.pizza);
        }
    }

    public onOutput(event: IEvent) {
        this.output.emit(event);
    }

    /**
     * This takes all the pizzagna layers and merges them into one component pizza
     *
     * @param pizza
     * @param previousPizzagna
     * @param currentPizzagna
     */
    private mergePizzagnaIntoPizza(pizza: IPizza, previousPizzagna: IPizzagna, currentPizzagna: IPizzagna) {
        return mergeChanges(pizza,
            // These are merged in reverse priority order so that values in higher priority layers
            // override the corresponding values in lower priority layers
            this.getLayerChanges(previousPizzagna, currentPizzagna, PizzagnaLayer.Structure),
            this.getLayerChanges(previousPizzagna, currentPizzagna, PizzagnaLayer.Configuration),
            this.getLayerChanges(previousPizzagna, currentPizzagna, PizzagnaLayer.Data)
        ) as Record<string, IComponentConfiguration>;
    }

    private getLayerChanges(previous: IPizzagna, current: IPizzagna, overlayKey: string) {
        return {
            previousValue: this.getLayerSafe(previous, overlayKey),
            currentValue: this.getLayerSafe(current, overlayKey),
        };
    }

    private getLayerSafe(pizzagna: IPizzagna, overlayKey: string) {
        return pizzagna && pizzagna[overlayKey];
    }

}
