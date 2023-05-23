import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogHeaderComponent } from "./dialog-header.component";


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FlexLayoutModule,
    ],
    declarations: [
        DialogHeaderComponent,
    ],
    exports: [
        DialogHeaderComponent,
    ]
})
export class DialogHeaderModule { }