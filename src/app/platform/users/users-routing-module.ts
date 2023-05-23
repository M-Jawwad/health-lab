import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/services/auth-guard";
import { UserProfileFormComponent } from "./user-profile/user-profile.component";
import { UsersComponent } from "./users.component";


const routes: Routes = [
    { path: '', component: UsersComponent, canActivate: [AuthGuardService] },
    { path: 'user-profile', component: UserProfileFormComponent }
]


@NgModule({
    declarations: [
    ],

    imports: [
        RouterModule.forChild(routes),
    ]
})
export class UsersRoutingModule { }