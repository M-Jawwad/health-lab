import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuardService } from "src/app/services/auth-guard";
import { ConsumerComponent } from "./consumer.component";


const routes: Routes = [
    { path: '', component: ConsumerComponent },
]


@NgModule({
    declarations: [
    ],

    imports: [
        RouterModule.forChild(routes),
    ]
})
export class ConsumerRoutingModule { }