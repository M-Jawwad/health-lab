import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreModule, FlexLayoutModule } from "@angular/flex-layout";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { UsersRoutingModule } from "./users-routing-module";
import { UserGroupsModule } from "../user-groups/user-groups-module";
import { UsersComponent } from "./users.component";
import { UserFormComponent } from './user-form/user-form.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { DownloaderModule } from "src/app/shared/download-file/download-file-module";
import { DialogHeaderModule } from "src/app/shared/dialog-header/dialog-header-module";
import { PaginatorModule } from "src/app/shared/pagination/module";
import { DualListModule } from "src/app/shared/dual-list/dual-list-module";
import { DirectivesModule } from "src/app/shared/directives/module";
import { SearchModule } from "src/app/shared/search/search-module";
import { UserProfileFormComponent } from "./user-profile/user-profile.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UsersRoutingModule,

        NgbModule,
        FlexLayoutModule,
        NgSelectModule,

        UserGroupsModule,
        DownloaderModule,
        DialogHeaderModule,
        PaginatorModule,
        DualListModule,
        DirectivesModule,
        SearchModule,
        CoreModule,
    ],
    declarations: [
        UsersComponent,
        UserFormComponent,
        UserProfileFormComponent
    ],
    exports: [
        UsersComponent,
        UserFormComponent,
        UserProfileFormComponent
    ]
})
export class UsersModule { }