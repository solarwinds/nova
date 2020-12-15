import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DEMO_PATH_TOKEN, NuiDocsModule, NuiImageModule, SrlcStage } from "@nova-ui/bits";

import {
    ImageBasicExampleComponent,
    ImageDocsExampleComponent,
    ImageExternalExampleComponent,
    ImageFloatExampleComponent,
    ImageListExampleComponent,
    ImageMarginExampleComponent,
    ImageTestComponent,
    ImageVisualTestComponent,
    ImageWatermarkedExampleComponent,
    ImageWidthHeightAndAutoFillExampleComponent,
} from "./index";

const routes = [
    {
        path: "",
        component: ImageDocsExampleComponent,
        data: {
            "srlc": {
                "stage": SrlcStage.ga,
            },
            showThemeSwitcher: true,
        },
    },
    {
        path: "image-visual-test",
        component: ImageVisualTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
    {
        path: "image-test",
        component: ImageTestComponent,
        data: {
            "srlc": {
                "hideIndicator": true,
            },
        },
    },
];

@NgModule({
    imports: [
        NuiImageModule,
        NuiDocsModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        ImageBasicExampleComponent,
        ImageDocsExampleComponent,
        ImageExternalExampleComponent,
        ImageFloatExampleComponent,
        ImageListExampleComponent,
        ImageMarginExampleComponent,
        ImageVisualTestComponent,
        ImageWatermarkedExampleComponent,
        ImageWidthHeightAndAutoFillExampleComponent,
        ImageTestComponent,
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
export class ImageModule {
}
