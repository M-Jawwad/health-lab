import { Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_venn from "@amcharts/amcharts4/plugins/venn";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_kelly from "@amcharts/amcharts4/themes/kelly";
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/interfaces/response';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, OnChanges {

    @Input() makeChart: boolean;
    @Input() make3DChart: boolean;
    @Input() title: string;
    @Input() data: any[];
    @Input() devicesData: any[];
    @Output() signal: EventEmitter<any>;

    private pieChart: any;
    private pie3dChart: any;

    constructor(
        private zone: NgZone,
        private apiService: ApiService,
        private toastrService: ToastrService
    ) {
        this.makeChart = false;
        this.make3DChart = false;
        this.title = 'Title';
        this.signal = new EventEmitter<any>();

        this.data = [];
        this.devicesData = [];
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.devicesData) {
            this.devicesData = changes.devicesData.currentValue;
        }

        if (changes.data) {
            this.data = changes.data.currentValue;
            // console.log("changes.data.currentValue==", changes.data.currentValue)
        }

        setTimeout(() => {
            if (!!this.devicesData && this.devicesData != [] && this.make3DChart) {
                if (this.pie3dChart) { this.pie3dChart.dispose(); }
                this.pie3dChart = this.create3DPieChart();
            }
            if (!!this.data && this.makeChart) {
                if (this.pieChart) { this.pieChart.dispose(); }
                this.pieChart = this.createChart();
            }
        }, 100);
    }

    ngOnInit(): void {
        am4core.useTheme(am4themes_animated);
        am4core.useTheme(am4themes_kelly);
    }

    createChart() {
        let chart = am4core.create("pie-chart-div", am4plugins_venn.VennDiagram);

        let series = chart.series.push(new am4plugins_venn.VennSeries());
        series.dataFields.value = "value";
        series.dataFields.category = "name";
        series.dataFields.intersections = "sets";
        series.name = "{category}";
        series.slices.template.propertyFields.fill = 'color';
        series.labels.template.text = "";

        // series.labels.template.disabled = true;
        series.ticks.template.disabled = true;
        series.slices.template.tooltipText = "{category}: {value.value}";
        series.slices.template.tooltip?.fontSize(12);
        series.data = this.data;
        chart.legend = new am4charts.Legend();
        chart.legend.position = "right";
        // chart.legend.scrollable = true;
        return chart;
    }

    create3DPieChart() {
        let chart = am4core.create("3d-chart-div", am4charts.PieChart3D);
        chart.innerRadius = am4core.percent(40);

        let series = chart.series.push(new am4charts.PieSeries3D);
        series.dataFields.value = "count";
        series.dataFields.category = "name";
        series.name = "{category}";
        series.slices.template.propertyFields.fill = 'color';

        // series.labels.template.disabled = true;
        series.slices.template.tooltipText = "{category}: {value.value}";

        series.data = this.devicesData;

        chart.legend = new am4charts.Legend();
        chart.legend.position = "bottom";
        // chart.legend.scrollable = true;

        return chart;
    }

    ngOnDestroy(): void {
        this.zone.runOutsideAngular(() => {
            if (this.pieChart) {
                this.pieChart.dispose();
            }
            if (this.pie3dChart) {
                this.pie3dChart.dispose();
            }
        });
    }
}
