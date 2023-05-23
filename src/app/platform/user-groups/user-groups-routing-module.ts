import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/services/auth-guard";
import { UserGroupsComponent } from "./user-groups.component";


const routes: Routes = [
    { path: '', component: UserGroupsComponent, canActivate: [AuthGuardService] }
]


@NgModule({
    declarations: [
    ],

    imports: [
        RouterModule.forChild(routes),
    ]
})
export class UserGroupsRoutingModule { }