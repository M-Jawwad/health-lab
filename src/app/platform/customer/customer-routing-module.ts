import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/services/auth-guard";
import { CustomerFormComponent } from "./add-customer/add-customer.component";
import { CustomersComponent } from "./customer.component";


const routes: Routes = [
    // { path: '', component: UserGroupsComponent, canActivate: [AuthGuardService] }
    { path: '', component: CustomersComponent },
    { path: 'add', component: CustomerFormComponent },
    { path: 'edit/:id', component: CustomerFormComponent },
    { path: 'details/:id', component: CustomerFormComponent },
]


@NgModule({
    declarations: [
    ],

    imports: [
        RouterModule.forChild(routes),
    ]
})
export class CustomerRoutingModule { }