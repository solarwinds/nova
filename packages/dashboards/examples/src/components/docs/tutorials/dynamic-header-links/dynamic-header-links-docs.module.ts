import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { DynamicHeaderLinksDocsComponent } from "./dynamic-header-links-docs.component";

const routes = [
    {
        path: "",
        component: DynamicHeaderLinksDocsComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    declarations: [
        DynamicHeaderLinksDocsComponent,
    ],
    entryComponents: [
    ],
})
export class DynamicHeaderLinksDocsModule { }
