import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FlexLayoutModule } from "@angular/flex-layout";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";

import { DirectivesModule } from "src/app/shared/directives/module";
import { PaginatorModule } from "src/app/shared/pagination/module";
import { SearchModule } from "src/app/shared/search/search-module";

import { CustomerDetailFormComponent } from "./add-customer/customer-detail-form/customer-detail.component";
import { CustomersComponent } from "./customer.component";
import { CustomerFormComponent } from "./add-customer/add-customer.component";
import { CustomerPackagesComponent } from "./add-customer/customer-packages/customer-packages.component";
import { CustomerHardwareComponent } from "./add-customer/customer-hardware/customer-hardware.component";
import { CustomerRoutingModule } from "./customer-routing-module";
import { GeneralTableModule } from "src/app/shared/general-table/general-table.module";
import { DeviceAllocationComponent } from "./add-customer/device-allocation/device-allocation.component";
import { ImageViewerModule } from "src/app/shared/image-viewer/image-viewer-module";
import { AdminFormComponent } from "./add-customer/admin-form/admin-form.component";
import { DeviceConfigurationComponent } from "./add-customer/device-configuration/device-configuration.component";
import { HardwareInstallationComponent } from "./add-customer/hardware-installation/hardware-installation.component";
import { DevicesDiagnosticsModule } from "../device-diagnostics/devices-diagnostics-module";
import { PkgFeaturComponent } from "./add-customer/pkg-features/features.component";


@NgModule({
    declarations: [
        CustomersComponent,
        CustomerFormComponent,
        CustomerDetailFormComponent,
        CustomerPackagesComponent,
        CustomerHardwareComponent,
        DeviceAllocationComponent,
        AdminFormComponent,
        DeviceConfigurationComponent,
        HardwareInstallationComponent,
        PkgFeaturComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        CustomerRoutingModule,
        NgbModule,
        FlexLayoutModule,
        NgSelectModule,
        PaginatorModule,
        SearchModule,
        DirectivesModule,
        GeneralTableModule,
        ImageViewerModule,
        DevicesDiagnosticsModule
    ],
    exports: [
        DeviceConfigurationComponent,
        DeviceAllocationComponent
    ]
})
export class CustomerModule { }