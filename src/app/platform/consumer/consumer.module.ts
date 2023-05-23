import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { FlexLayoutModule } from "@angular/flex-layout";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";

import { GeneralTableModule } from "src/app/shared/general-table/general-table.module";
import { DirectivesModule } from "src/app/shared/directives/module";
import { PaginatorModule } from "src/app/shared/pagination/module";
import { SearchModule } from "src/app/shared/search/search-module";

import { ConsumerComponent } from "./consumer.component";
import { ConsumerRoutingModule } from "./consumer-routing-module";
import { ConsumerFormComponent } from './consumer-form/consumer-form.component';
import { TotalDevicesComponent } from "./total-devices/total-devices.component";
import { CustomerModule } from "../customer/customer.module";


@NgModule({
    declarations: [
        ConsumerComponent,
        ConsumerFormComponent,
        TotalDevicesComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ConsumerRoutingModule,

        FlexLayoutModule,
        NgbModule,
        NgSelectModule,

        GeneralTableModule,
        DirectivesModule,
        SearchModule,
        PaginatorModule,
        CustomerModule,
    ]
})
export class ConsumerModule { }