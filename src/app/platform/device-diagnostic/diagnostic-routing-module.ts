import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/services/auth-guard";
import { ApiHandlerComponent } from "./api-handler/api-handler.component";
import { DeviceParametersComponent } from "./device-parameters/device-parameters.component";


const routes: Routes = [
    { path: '', component: ApiHandlerComponent },
    { path: 'parameters', component: DeviceParametersComponent },
    { path: 'configuration', component: DeviceParametersComponent },
]


@NgModule({
    declarations: [
    ],

    imports: [
        RouterModule.forChild(routes),
    ]
})
export class DiagnosticRoutingModule { }