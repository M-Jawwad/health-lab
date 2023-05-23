import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { FlexLayoutModule } from "@angular/flex-layout";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgCircleProgressModule } from "ng-circle-progress";

import { GraphsModule } from "src/app/shared/graphs/graphs-module";
import { DashboardComponent } from "./dashboard.component";

const routes: Routes = [
    { path: '', component: DashboardComponent }
]


@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        CommonModule,
        GraphsModule,
        RouterModule.forChild(routes),
        
        FlexLayoutModule,
        NgbModule,
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
    ]
})
export class DashboardModule { }