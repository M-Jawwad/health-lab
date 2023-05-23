import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FlexLayoutModule } from "@angular/flex-layout";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxDropzoneModule } from "ngx-dropzone";

import { DirectivesModule } from "src/app/shared/directives/module";
import { PaginatorModule } from "src/app/shared/pagination/module";
import { SearchModule } from "src/app/shared/search/search-module";

import { InventoryRoutingModule } from "./inventory-routing-module";
import { InventoryComponent } from "./inventory.component";
import { GeneralTableModule } from "src/app/shared/general-table/general-table.module";
import { DeviceTypesComponent } from "./device-types/device-types.component";
import { DeviceTypeFormComponent } from "./device-type-form/device-type-form.component";
import { SensorsConfigurationComponent } from "./sensors-&-features/sensors-configuration.component";
import { SensorsFormComponent } from "./sensors-features-form/sensors-features-form.component";
import { ImageViewerModule } from "src/app/shared/image-viewer/image-viewer-module";
import { InventoryFormComponent } from "./inventory-form/inventory-form.component";
import { DeviceHistoryComponent } from "./device-history/device-history.component";
import { QrCodeComponent } from './qr-code/qr-code.component';
import { CustomerModule } from "../customer/customer.module";
import { DevicesDiagnosticsModule } from "../device-diagnostics/devices-diagnostics-module";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { DeviceDiagnosticModule } from "../device-diagnostic/device-diagnostic.module";


@NgModule({
    declarations: [
        InventoryComponent,
        InventoryFormComponent,
        BulkUploadComponent,
        DeviceHistoryComponent,

        DeviceTypesComponent,
        DeviceTypeFormComponent,

        SensorsConfigurationComponent,
        SensorsFormComponent,
        QrCodeComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        InventoryRoutingModule,
        NgbModule,
        FlexLayoutModule,
        NgSelectModule,
        NgxDropzoneModule,
        PaginatorModule,
        SearchModule,
        DirectivesModule,
        
        GeneralTableModule,
        ImageViewerModule,
        CustomerModule,
        DevicesDiagnosticsModule,
        DeviceDiagnosticModule
    ]
})
export class InventoryModule { }