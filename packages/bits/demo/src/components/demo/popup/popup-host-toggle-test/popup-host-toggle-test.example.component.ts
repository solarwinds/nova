// © 2026 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

import { Component } from "@angular/core";

interface InfoPopupState {
    id: string;
    label: string;
    content: string;
    isOpen: boolean;
    isHovered: boolean;
    isFocused: boolean;
    isDismissed: boolean;
}

@Component({
    selector: "nui-popup-host-toggle-test",
    template: `
        <button id="focus-start" type="button">Start keyboard test</button>

        <form (ngSubmit)="formSubmissions = formSubmissions + 1">
            <nui-popup
                *ngFor="let popup of infoPopups"
                [id]="popup.id"
                [isHostToggleRef]="true"
                [isOpen]="popup.isOpen"
                (opened)="onPopupOpenedChange(popup, $event)"
            >
                <button
                    nui-button
                    type="button"
                    displayStyle="action"
                    [ariaLabel]="popup.label"
                    [attr.aria-expanded]="popup.isOpen"
                    (click)="openPopup(popup)"
                    (mouseenter)="setPopupHoverState(popup, true)"
                    (mouseleave)="setPopupHoverState(popup, false)"
                    (focus)="setPopupFocusState(popup, true)"
                    (blur)="setPopupFocusState(popup, false)"
                    (keydown.escape)="dismissPopup(popup, $event)"
                >
                    <nui-icon
                        icon="severity_info"
                        [decorative]="true"
                    ></nui-icon>
                </button>
                <div popupAreaContent>{{ popup.content }}</div>
            </nui-popup>

            <fieldset>
                <legend i18n>Preferred polling method</legend>
                <label>
                    <input
                        type="radio"
                        name="preferredPollingMethod"
                        [(ngModel)]="formValues.preferredPollingMethod"
                        value="SNMP"
                    />
                    SNMP
                </label>
                <label>
                    <input
                        type="radio"
                        name="preferredPollingMethod"
                        [(ngModel)]="formValues.preferredPollingMethod"
                        value="WMI"
                    />
                    WMI
                </label>
            </fieldset>

            <fieldset>
                <legend i18n>Monitoring mode</legend>
                <label>
                    <input
                        type="radio"
                        name="monitoringMode"
                        [(ngModel)]="formValues.monitoringMode"
                        value="manual"
                    />
                    Manual
                </label>
                <label>
                    <input
                        type="radio"
                        name="monitoringMode"
                        [(ngModel)]="formValues.monitoringMode"
                        value="automatic"
                    />
                    Automatic
                </label>
            </fieldset>

            <label>
                <input
                    type="checkbox"
                    name="icmpEnabled"
                    [(ngModel)]="formValues.icmpEnabled"
                />
                <ng-container i18n>Include ICMP-only devices</ng-container>
            </label>
            <p>Form submissions: {{ formSubmissions }}</p>
        </form>

        <div style="height: 1200px" aria-hidden="true"></div>
    `,
    standalone: false,
})
export class PopupHostToggleTestComponent {
    public readonly infoPopups: InfoPopupState[] = [
        {
            id: "preferred-polling-method-info",
            label: $localize`Preferred polling method information`,
            content: $localize`Preferred polling method details`,
            ...createInfoPopupState(),
        },
        {
            id: "manual-monitoring-setup-info",
            label: $localize`Manual monitoring setup information`,
            content: $localize`Manual monitoring setup details`,
            ...createInfoPopupState(),
        },
        {
            id: "automatic-monitoring-setup-info",
            label: $localize`Automatic monitoring setup information`,
            content: $localize`Automatic monitoring setup details`,
            ...createInfoPopupState(),
        },
    ];
    public formValues = {
        preferredPollingMethod: "SNMP",
        monitoringMode: "automatic",
        icmpEnabled: true,
    };
    public formSubmissions = 0;

    public openPopup(popup: InfoPopupState): void {
        popup.isDismissed = false;
        popup.isOpen = true;
    }

    public dismissPopup(popup: InfoPopupState, event: KeyboardEvent): void {
        event.preventDefault();
        popup.isDismissed = true;
        popup.isOpen = false;
    }

    public onPopupOpenedChange(popup: InfoPopupState, isOpen: boolean): void {
        popup.isOpen = isOpen;
        if (isOpen) {
            popup.isDismissed = false;
        } else {
            popup.isDismissed = popup.isHovered || popup.isFocused;
        }
    }

    public setPopupHoverState(popup: InfoPopupState, isHovered: boolean): void {
        popup.isHovered = isHovered;
        this.updatePopupState(popup, isHovered);
    }

    public setPopupFocusState(popup: InfoPopupState, isFocused: boolean): void {
        popup.isFocused = isFocused;
        this.updatePopupState(popup, isFocused);
    }

    private updatePopupState(popup: InfoPopupState, isActive: boolean): void {
        if (isActive || (!popup.isHovered && !popup.isFocused)) {
            popup.isDismissed = false;
        }
        popup.isOpen =
            !popup.isDismissed && (popup.isHovered || popup.isFocused);
    }
}

function createInfoPopupState(): Pick<
    InfoPopupState,
    "isOpen" | "isHovered" | "isFocused" | "isDismissed"
> {
    return {
        isOpen: false,
        isHovered: false,
        isFocused: false,
        isDismissed: false,
    };
}
