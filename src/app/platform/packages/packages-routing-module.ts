import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/services/auth-guard";
import { PackageListComponent } from "./package-list/package-list.component";
import { PackagesComponent } from "./packages.component";
import { UsecaseListComponent } from "./usecase-list/usecase-list.component";

const routes: Routes = [
    { path: '', component: PackagesComponent },
    { path: 'package-configuration', component: PackageListComponent },
    { path: 'usecase_configuration', component: UsecaseListComponent }
]


@NgModule({
    declarations: [
    ],

    imports: [
        RouterModule.forChild(routes),
    ]
})
export class PackagesRoutingModule { }