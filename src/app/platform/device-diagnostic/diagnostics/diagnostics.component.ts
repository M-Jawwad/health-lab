import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import * as dateFns from 'date-fns';

@Component({
    selector: 'app-diagnostics',
    templateUrl: './diagnostics.component.html',
    styleUrls: ['./diagnostics.component.scss'],
    providers: [DatePipe]
})
export class DiagnosticsComponent implements OnInit {

    loading: boolean;
    loadingApi: boolean;
    deviceStatus: boolean;
    showActions: boolean;

    title: string;
    deviceType: string;

    data: any;
    ld: any;
    cusDataFreq: any;
    frequencyData: any;

    actions: any[];
    sensorsInfo: any[];
    oldDataSource: any[];
    dataSource: any[];

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
        private datePipe: DatePipe,
    ) {
        this.loadingApi = false;
        this.loading = false;
        this.deviceStatus = false;
        this.showActions = true;
        this.title = 'Device Diagnostics';
        this.deviceType = 'Concox Qbit';
        this.data = null;
        this.ld = null;

        this.cusDataFreq = null;
        this.frequencyData = null;

        this.dataSource = [];
        this.oldDataSource = [];

        this.actions = [];
        this.sensorsInfo = [];
    }

    ngOnInit(): void {
        // this.getAllActions();
        this.getDiagnostics();
    }

    getAllActions() {
        this.loading = true;
        const slug = `${environment.da}/api/actions`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            let data = resp.data;
            this.loading = false;
            this.actions = data;
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error getting parameters', {
                progressBar: true, progressAnimation: 'increasing', timeOut: 3000
            });
        });
    }

    getDiagnostics() {
        this.loading = true;
        const slug = `${environment.inventoryms}/inventory/device-diagnostics?device_id=${this.data.device_id}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.actions = resp.data['diagnostic_action'];
            this.dataSource = resp.data['diagnostic_parameter'];
            this.loading = false;

            this.checkStatusAction();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message']);
        });
    }

    checkStatusAction() {
        const obj = this.actions.find(ele => {
            return ele?.status_check;
        });

        if (!!obj) {
            this.SendActionToDevice(obj.action_key, true);
        }
    }

    SendActionToDevice(type: string, checkStatus?: boolean) {
        this.loadingApi = true;
        let url = '';

        url = `${environment.da}/api/actions/command?action=${type}&device_id=${this.data.device_id}`;
        this.apiService.get(url).subscribe((resp: any) => {
            this.loadingApi = false;
            if (resp.success) {
                if (checkStatus) {
                    this.deviceStatus = true;
                }
                this.toastrService.success(resp.status, '', {
                    progressBar: true, progressAnimation: "decreasing", timeOut: 3000,
                });
            } else {
                if (checkStatus) {
                    this.deviceStatus = false;
                }
                this.toastrService.error(resp.status, '', {
                    progressBar: true, progressAnimation: "decreasing", timeOut: 3000,
                });
            }
        }, (err: any) => {
            this.loadingApi = false;
            if (checkStatus) {
                this.deviceStatus = false;
            }
            this.toastrService.error(err.error['status'], '', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    abortVerification() {
        this.modalRef.close();
    }

    onCloseModel() {
        this.modalRef.close();
    }

    getDeviceValue(device: any) {
        if (['last_updated_timestamp', 'sos_timestamp'].includes(device.unique_id)) {
            if (device.value) {
                let offset = Math.abs(new Date().getTimezoneOffset());
                const utcDate = Date.parse(device.value);
                const localDate = dateFns.addMinutes(utcDate, offset);
                return dateFns.format(localDate, 'yyyy-MM-dd, hh:mm:ss');
            }
        } else {
            return device.value;
        }
    }

}