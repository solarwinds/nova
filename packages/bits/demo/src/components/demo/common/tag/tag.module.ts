import { ScrollingModule } from "@angular/cdk/scrolling";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
    DEMO_PATH_TOKEN,
    NuiDocsModule,
    NuiIconModule,
    SrlcStage,
} from "@nova-ui/bits";

import { TagBasicExampleComponent } from "./tag-basic/tag-basic.example.component";
import { TagBorderColorExampleComponent } from "./tag-border-color/tag-border-color.example.component";
import { TagColorExampleComponent } from "./tag-color/tag-color.example.component";
import { TagDocsExampleComponent } from "./tag-docs/tag-docs.example.component";
import { TagWithHoverExampleComponent } from "./tag-with-hover/tag-with-hover.example.component";
import { TagWithIconExampleComponent } from "./tag-with-icon/tag-with-icon.example.component";

const routes = [
    {
        path: "",
        component: TagDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
];

@NgModule({
    declarations: [
        TagBasicExampleComponent,
        TagDocsExampleComponent,
        TagColorExampleComponent,
        TagWithIconExampleComponent,
        TagBorderColorExampleComponent,
        TagWithHoverExampleComponent,
    ],
    imports: [
        NuiDocsModule,
        ScrollingModule,
        NuiIconModule,
        RouterModule.forChild(routes),
    ],
    providers: [
        {
            provide: DEMO_PATH_TOKEN,
            useFactory: () => (<any>require).context(`!!raw-loader!./`, true, /.*\.(ts|html|less)$/),
        },
    ],
    exports: [
        RouterModule,
    ],
})
export class TagModule {
}
