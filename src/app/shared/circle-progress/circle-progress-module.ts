import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgCircleProgressModule } from "ng-circle-progress";
import { CircleProgressComponent } from "./circle-progress.component";


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FlexLayoutModule,
        NgCircleProgressModule.forRoot({
            outerStrokeColor: "#307bbb",
            innerStrokeColor: "#e7e8ea",
            radius: 60,
            space: -10,
            outerStrokeGradient: true,
            outerStrokeWidth: 10,
            outerStrokeGradientStopColor: "#53a9ff",
            innerStrokeWidth: 10,
            showTitle: true,
            showSubtitle: false,
            showUnits: false,
            showBackground: false,
            clockwise: true,
            startFromZero: false,
            lazy: false,
            animation: true,
            titleColor: "#307bbb",
            titleFontSize: "18",
            titleFontWeight: "500"
        }),
    ],
    declarations: [
        CircleProgressComponent,
    ],
    exports: [
        CircleProgressComponent,
    ]
})
export class ProgressModule { }