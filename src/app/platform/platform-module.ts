import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { MainDashboardModule } from "../core/dashboard/dashboard.module";
import { PlatformRoutingModule } from "./platform-routing-module";

@NgModule({
    imports: [
        CommonModule,
        PlatformRoutingModule,
        MainDashboardModule,        
    ]
})
export class PlatformModule { }