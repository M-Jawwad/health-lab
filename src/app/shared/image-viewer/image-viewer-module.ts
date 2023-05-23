import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DialogHeaderModule } from "../dialog-header/dialog-header-module";
import { ImageViewerComponent } from "./image-viewer.component";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        FlexLayoutModule,
        DialogHeaderModule,
    ],
    declarations: [
        ImageViewerComponent,
    ],
    exports: [
        ImageViewerComponent,
    ]
})
export class ImageViewerModule { }