import { Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-xy-chart',
    templateUrl: './xy-chart.component.html',
    styleUrls: ['./xy-chart.component.scss']
})
export class XYChartComponent implements OnInit, OnChanges {

    @Input() title: string;
    @Input() data: any[];
    @Input() devicesData: any[];
    @Output() signal: EventEmitter<any>;

    private chart: any;

    constructor(
        private zone: NgZone,
    ) {
        this.title = 'Title';
        this.signal = new EventEmitter<any>();

        this.data = [];
        this.devicesData = [];
        this.chart = null;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.data) {
            this.data = changes.data.currentValue;
        }

        if (!!this.data) {
            if (!!this.chart) { this.chart.dispose(); }
            this.chart = this.createChart();
        }
    }

    ngOnInit(): void {
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_kelly);

        // this.createChart();
    }

    createChart() {
        am4core.useTheme(am4themes_kelly);
        let chart = am4core.create("chart-div", am4charts.XYChart);
        chart.data = this.data;
        chart.padding(40, 40, 20, 40);

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 60;
        dateAxis.renderer.inversed = false;
        dateAxis.renderer.grid.template.disabled = true;

        let va = chart.yAxes.push(new am4charts.ValueAxis());
        va.min = 0;
        va.extraMax = 0.1;
        // va.renderer.grid.template.location = 0;

        let series = chart.series.push(new am4charts.ColumnSeries);
        series.dataFields.valueY = 'value';
        series.dataFields.dateX = 'date';
        series.tooltipText = "{valueY.value}";

        series.columns.template.strokeOpacity = 0;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.adapter.add("fill", function (fill, target: any) {
            return chart.colors.getIndex(target.dataItem?.index);
        });

        var labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.verticalCenter = "bottom";
        labelBullet.label.dy = -10;
        labelBullet.label.text = "{values.valueY.workingValue.formatNumber('#.')}";

        return chart;
    }

    ngOnDestroy(): void {
        this.zone.runOutsideAngular(() => {
            if (this.chart) {
                this.chart.dispose();
            }
        });
    }
}
