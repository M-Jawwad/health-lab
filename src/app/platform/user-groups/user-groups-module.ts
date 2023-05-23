import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { DirectivesModule } from "src/app/shared/directives/module";
import { DownloaderModule } from "src/app/shared/download-file/download-file-module";
import { PaginatorModule } from "src/app/shared/pagination/module";
import { SearchModule } from "src/app/shared/search/search-module";
import { UserGroupFormComponent } from "./user-group-form/user-group-form.component";

import { UserGroupsRoutingModule } from "./user-groups-routing-module";
import { UserGroupsComponent } from "./user-groups.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UserGroupsRoutingModule,
        NgbModule,
        FlexLayoutModule,
        NgSelectModule,
        DownloaderModule,
        PaginatorModule,
        DirectivesModule,
        SearchModule,
    ],
    declarations: [
        UserGroupsComponent,
        UserGroupFormComponent
    ],
    exports: [
        UserGroupsComponent,
        UserGroupFormComponent
    ]
})
export class UserGroupsModule { }