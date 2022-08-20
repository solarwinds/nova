import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";

import { WidgetEditorAccordionComponent } from "../widget-editor-accordion/widget-editor-accordion.component";

interface AccordionCoordinatorState {
    instance: WidgetEditorAccordionComponent;
    openSubscription: Subscription;
    destroySubscription: Subscription;
}

@Injectable()
export class WidgetConfiguratorSectionCoordinatorService {
    private accordions: Array<AccordionCoordinatorState> = [];

    public registerAccordion(accordion: WidgetEditorAccordionComponent) {
        this.accordions.push({
            instance: accordion,
            openSubscription: accordion.openSubject.subscribe(() => {
                this.closeAllAccordions();
                accordion.open = true;
            }),
            destroySubscription: accordion.destroySubject
                .pipe(take(1))
                .subscribe(() => {
                    this.removeAccordion(accordion);
                }),
        });
    }

    private closeAllAccordions() {
        this.accordions.forEach((state) => {
            state.instance.closeAccordion();
        });
    }

    private removeAccordion(instanceToRemove: WidgetEditorAccordionComponent) {
        const stateToRemoveIndex = this.accordions.findIndex(
            (state) => state.instance === instanceToRemove
        );
        this.accordions[stateToRemoveIndex].openSubscription.unsubscribe();
        this.accordions.splice(stateToRemoveIndex, 1);
    }
}
