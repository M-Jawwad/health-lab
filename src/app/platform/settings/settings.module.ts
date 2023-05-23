import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";

import { SettingsComponent } from "./settings.component";

const routes: Routes = [
    { path: '', component: SettingsComponent }
]


@NgModule({
    declarations: [
        SettingsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        NgbModule,
        FlexLayoutModule,
        NgSelectModule,
    ]
})
export class SettingsModule { }