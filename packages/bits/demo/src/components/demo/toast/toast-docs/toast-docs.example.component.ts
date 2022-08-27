import { Component } from "@angular/core";

import { IToastConfig, IToastDeclaration } from "@nova-ui/bits";

@Component({
    selector: "nui-toast-docs-example",
    templateUrl: "./toast-docs.example.component.html",
})
export class ToastExampleComponent {
    getToastDeclarationKey(key: keyof IToastDeclaration): string {
        return key;
    }
    getToastConfigKey(key: keyof IToastConfig): string {
        return key;
    }
}
