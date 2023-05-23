import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { XYChartComponent } from "./xy-chart/xy-chart.component";


@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        FlexLayoutModule,
    ],
    declarations: [
        PieChartComponent,
        XYChartComponent,
    ],
    exports: [
        PieChartComponent,
        XYChartComponent,
    ]
})
export class GraphsModule { }