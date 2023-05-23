import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceParametersComponent } from './device-parameters/device-parameters.component';
import { DiagnosticRoutingModule } from './diagnostic-routing-module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralTableModule } from 'src/app/shared/general-table/general-table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ParametersFormComponent } from './parameters-form/parameters-form.component';
import { ActionFormComponent } from './action-form/action-form.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ApiHandlerComponent } from './api-handler/api-handler.component';
import { DiagnosticsComponent } from './diagnostics/diagnostics.component';


@NgModule({
    declarations: [
        DiagnosticsComponent,
        DeviceParametersComponent,
        ParametersFormComponent,
        ActionFormComponent,
        ApiHandlerComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DiagnosticRoutingModule,
        NgbModule,
        FlexLayoutModule,
        NgSelectModule,
        GeneralTableModule,
    ],
    exports: [
        DiagnosticsComponent,
        DeviceParametersComponent,
        ParametersFormComponent,
        ActionFormComponent,
        ApiHandlerComponent,
    ]
})
export class DeviceDiagnosticModule { }