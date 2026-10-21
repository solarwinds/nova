import { Component } from "@angular/core";

@Component({
    selector: "nui-popup-legacy-test",
    template: `
        <nui-popup-deprecated
            id="nui-research-legacy-popup"
            [appendToBody]="true">
            <button nuiPopupToggle type="button" i18n>
                Open legacy research popup
            </button>
            <div popupAreaContent>
                <span i18n>Legacy popup details</span>
            </div>
        </nui-popup-deprecated>
    `,
    standalone: false,
})
export class PopupLegacyTestComponent {}
