import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NuiModule} from "@solarwinds/nova-bits";

import {environment} from "../../environments/environment";

import { LazyComponent } from "./lazy/lazy.component";
import { PluginRoutingModule } from "./plugin-routing.module";

@NgModule({
  imports: [
    CommonModule,
    PluginRoutingModule,
    NuiModule,
  ],
  declarations: [LazyComponent],
})
export class PluginModule { }
