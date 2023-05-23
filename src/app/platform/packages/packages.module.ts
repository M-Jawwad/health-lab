import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { FlexLayoutModule } from "@angular/flex-layout";
import { NgSelectModule } from "@ng-select/ng-select";

import { DirectivesModule } from "src/app/shared/directives/module";
import { PaginatorModule } from "src/app/shared/pagination/module";
import { SearchModule } from "src/app/shared/search/search-module";

import { PackagesRoutingModule } from "./packages-routing-module";
import { PackageListComponent } from "./package-list/package-list.component";
import { PackagesComponent } from "./packages.component";
import { UsecaseFormComponent } from "./use-case-form/use-case-form.component";
import { PackageFormComponent } from "./package-form/package-form.component";
import { UsecaseListComponent } from "./usecase-list/usecase-list.component";
import { FeatureFormComponent } from "./feature-form/feature-form.component";


@NgModule({
    declarations: [
        PackagesComponent,
        UsecaseFormComponent,
        PackageListComponent,
        PackageFormComponent,
        UsecaseListComponent,
        FeatureFormComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        PackagesRoutingModule,

        NgbModule,
        FlexLayoutModule,
        NgSelectModule,

        PaginatorModule,
        SearchModule,
        DirectivesModule
    ]
})
export class PackagesModule { }