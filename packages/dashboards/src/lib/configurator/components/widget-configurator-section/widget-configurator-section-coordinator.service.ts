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
