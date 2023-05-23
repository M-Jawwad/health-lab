import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/services/auth-guard";
import { ApiHandlerComponent } from "../device-diagnostic/api-handler/api-handler.component";
import { DeviceParametersComponent } from "../device-diagnostic/device-parameters/device-parameters.component";
import { DeviceTypesComponent } from "./device-types/device-types.component";
import { InventoryComponent } from "./inventory.component";
import { QrCodeComponent } from "./qr-code/qr-code.component";
import { SensorsConfigurationComponent } from "./sensors-&-features/sensors-configuration.component";

const routes: Routes = [
    // { path: '', component: UserGroupsComponent, canActivate: [AuthGuardService] }
    { path: '', component: InventoryComponent },
    { path: 'device-types', component: DeviceTypesComponent },
    { path: 'sensor-configuration', component: SensorsConfigurationComponent },
    { path: 'qr-code', component: QrCodeComponent },
    { path: 'parameter', component: DeviceParametersComponent },
    { path: 'api-action', component: ApiHandlerComponent },
]


@NgModule({
    declarations: [
    ],

    imports: [
        RouterModule.forChild(routes),
    ]
})
export class InventoryRoutingModule { }