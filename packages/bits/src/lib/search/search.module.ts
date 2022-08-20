import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { NuiCommonModule } from "../../common/common.module";
import { NuiButtonModule } from "../button/button.module";
import { NuiSpinnerModule } from "../spinner/spinner.module";

import { SearchComponent } from "./search.component";

/**
 * @ignore
 */
@NgModule({
    imports: [NuiCommonModule, NuiSpinnerModule, FormsModule, NuiButtonModule],
    declarations: [SearchComponent],
    exports: [SearchComponent],
    providers: [],
})
export class NuiSearchModule {}
