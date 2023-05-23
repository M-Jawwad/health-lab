import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ConcoxQbitComponent } from "./concox-qbit/concox-qbit.component";
import { DeviceDiagnosticsComponent } from "./device-diagnostics/device-diagnostics.component";
import { HNV1Component } from "./hn-v1.0/hn-v1.0.component";
import { HNV15Component } from "./hn-v1.5/hn-v1.5.component";

@NgModule({
    declarations: [
        DeviceDiagnosticsComponent,
        ConcoxQbitComponent,
        HNV1Component,
        HNV15Component
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        NgbModule,
    ],
    exports: [
        DeviceDiagnosticsComponent,
        ConcoxQbitComponent,
        HNV1Component,
        HNV15Component
    ]
})
export class DevicesDiagnosticsModule { }