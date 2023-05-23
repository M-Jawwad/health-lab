import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { GeneralTableModule } from "src/app/shared/general-table/general-table.module";

import { AuditComponent } from "./audit.component";

const routes: Routes = [
    { path: '', component: AuditComponent }
]


@NgModule({
    declarations: [
        AuditComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        NgbModule,
        FlexLayoutModule,
        GeneralTableModule,
    ]
})
export class AuditModule { }