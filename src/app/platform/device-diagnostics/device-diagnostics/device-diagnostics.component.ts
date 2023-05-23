import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-device-diagnostics',
    templateUrl: './device-diagnostics.component.html',
    styleUrls: ['./device-diagnostics.component.scss'],
    providers: [DatePipe]
})
export class DeviceDiagnosticsComponent implements OnInit {

    loading: boolean;
    loadingApi: boolean;
    deviceStatus: boolean;
    title: string;
    deviceType: string;
    data: any;
    ld: any;

    cusDataFreq: any;
    frequencyData: any;
    sensorsInfo: any[];

    oldDataSource: any[];
    dataSource: any[];

    hn1 = ['HN v1.0', 'hn v1.0'];
    hn15 = ['HN v1.5', 'hn v1.5'];
    cq = ['Concox Qbit', 'concox qbit'];
    cqhn15 = ['Concox Qbit', 'concox qbit', 'HN v1.5', 'hn v1.5'];
    cqhn1 = ['Concox Qbit', 'concox qbit', 'HN v1.0', 'hn v1.0'];
    cqhn115 = ['Concox Qbit', 'concox qbit', 'HN v1.0', 'hn v1.0', 'HN v1.5', 'hn v1.5'];

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
        private datePipe: DatePipe,
    ) {
        this.loadingApi = false;
        this.loading = false;
        this.deviceStatus = false;
        this.title = 'Device Diagnostics';
        this.deviceType = 'Concox Qbit';
        this.data = null;
        this.ld = null;

        this.cusDataFreq = null;
        this.frequencyData = null;

        this.dataSource = [];
        this.oldDataSource = [];

        this.sensorsInfo = [];
    }

    ngOnInit(): void {
        if (this.cqhn115.includes(this.deviceType)) {
            this.deviceStatusBySDK();
        } else {
            this.toastrService.error('', 'Device type invalid', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.onCloseModel();
        }
    }

    deviceStatusBySDK() {
        this.loading = true;

        let slug = '';
        if (this.cq.includes(this.deviceType)) {
            if (this.data.package === 8) {
                slug = `${environment.AssetbaseUrl}/am/sendActionToDevice/?imei=${this.data.device_id}&action=checkStatus&device_type=${this.deviceType}`;
            } else {
                slug = `${environment.AssetbaseUrlAdvance}/am/sendActionToDevice/?imei=${this.data.device_id}&action=checkStatus&device_type=${this.deviceType}`;
            }
        } else if (this.hn1.includes(this.deviceType) || this.hn15.includes(this.deviceType)) {
            slug = `${environment.AssetbaseUrlAdvance}/am/sendActionToDevice/?imei=${this.data.device_id}&action=checkStatus&device_type=${this.deviceType}&sim_no=${this.data.sim_serial_number}`;
        }

        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.getDeviceFrequency();
            this.getSensorsInfo();

            if (this.cq.includes(this.deviceType)) {
                if (resp.status === 2000 || resp.status === 2001 || resp.status === 2003) {
                    this.deviceStatus = false;
                    this.toastrService.error(resp.message, 'Error getting device status info', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                }
                else {
                    this.deviceStatus = true;
                }
                this.getData(this.data.device_id);
            } else if (this.hn1.includes(this.deviceType) || this.hn15.includes(this.deviceType)) {
                if (resp.message === 'Device is offline') {
                    this.deviceStatus = false;
                }
                else {
                    this.deviceStatus = true;
                }
                this.getData(this.data.device_id);
            }
        }, (err: any) => {
            this.loading = false;
            this.getDeviceFrequency();
            this.getSensorsInfo();
            setTimeout(() => {
                this.getData(this.data.device_id);
            }, 50);
            this.toastrService.error(err.error['message'], 'Error getting device status', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    getSensorsInfo() {
        const slug = `${environment.inventoryms}/sensor-configuration/`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            let data = resp.data['data'];
            data.forEach((element: any) => {
                this.sensorsInfo.push(element.sensor_id);
            });
        }, (err: any) => {
            this.toastrService.error('', err.error['message'], {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    getDeviceFrequency() {
        let slug = '';

        if (this.cq.includes(this.deviceType)) {
            if (this.data.package === 8) {
                slug = `${environment.AssetbaseUrl}/am/device_frequency/?device_id=${this.data.device_id}`;
            } else {
                slug = `${environment.AssetbaseUrlAdvance}/am/device_frequency/?device_id=${this.data.device_id}`;
            }
        } else if (this.hn1.includes(this.deviceType) || this.hn15.includes(this.deviceType)) {
            slug = `${environment.AssetbaseUrlAdvance}/am/device_frequency/?device_id=${this.data.device_id}`;
        }

        this.apiService.get(slug).subscribe((resp: any) => {
            this.frequencyData = resp.data.data;
            if (resp.data.data.length > 0) {
                this.cusDataFreq = resp.data.data[0]['frequency']
            }
        })
    }

    getData(id: number) {
        this.loading = true;

        let slug = '';
        // if (this.cq.includes(this.deviceType)) {
        //     slug = `${environment.HTracking}/hypernet/get_last_packet_device?device_id=${id}`;
        // } else if (this.hn1.includes(this.deviceType) || this.hn15.includes(this.deviceType)) {
        //     slug = `${environment.HTracking}/hypernet/get_last_packet_device?device_id=${id}`;
        // }
        slug = `${environment.HTracking}/hypernet/get_last_packet_device?device_id=${id}`;

        this.apiService.get(slug).subscribe((resp: ApiResponse) => {

            this.dataSource = [];
            const data = resp.data;
            this.ld = data['ld']
            const d = data['debug'].split(",");
            let sos_timestamp = !!data['sos_timestamp'] ? this.datePipe.transform(data['sos_timestamp'] * 1000, 'yyyy-MM-dd hh:mm:ss aa') : '';
            let rtp = !data['rtp'] ? 0 : 1;

            if (data['device_id'] === this.data.device_id) {
                this.dataSource.push(
                    { id: 0, title: 'Device ID', deviceId: data.device_id },
                    { id: 1, title: 'Device Type', deviceId: this.data.device_type_name },
                    { id: 2, title: 'Firmware Version', deviceId: d[0] },
                    { id: 3, title: 'Signal Strength', deviceId: d[1] },
                    { id: 4, title: 'Current Data Frequency', deviceId: this.cusDataFreq ? this.cusDataFreq + ' min' : null },
                    { id: 5, title: 'Last Updated Timestamp', deviceId: !!data['timestamp'] ? this.datePipe.transform(data['timestamp'] * 1000, 'yyyy-MM-dd hh:mm:ss aa'): '' },
                    { id: 6, title: 'Last Track Time', deviceId: this.frequencyData[0]?.track_time ? this.datePipe.transform(this.frequencyData[0].track_time, 'yyyy-MM-dd hh:mm:ss aa') : '' },
                    { id: 7, title: 'Location Status', deviceId: 0 },
                    // { id: 7, title: 'Location Status', deviceId: this.frequencyData[0]?.location_status },
                );
                    
                if (this.sensorsInfo.includes('has_speed')) {
                    this.dataSource.push({ id: 8, title: 'Current Speed', deviceId: !!data['speed'] ? data['speed'] + ' Km/h' : '' });
                }
                    
                if (this.cqhn15.includes(this.deviceType)) {
                    if (this.sensorsInfo.includes("is_bettery_level")) {
                        this.dataSource.push({ id: 9, title: 'Battery Level', deviceId: !!data['battery_level'] ? data['battery_level'] + ' %' : '' });
                    }
                    this.dataSource.push(
                        { id: 10, title: 'Last SOS Timestamp', deviceId: sos_timestamp }
                    );
                }

                if (['HN v1.5', 'hn v1.5'].includes(this.deviceType)) {
                    if (this.sensorsInfo.includes('is_temper_detection')) {
                        this.dataSource.push({ id: 11, title: 'Last Tamper Timestamp', deviceId: data['tampering_alerts'] ? this.datePipe.transform(data['timestamp'] * 1000, 'yyyy-MM-dd hh:mm aa' ) : '' });
                    }
                    if (this.sensorsInfo.includes('is_temprature_sensor')) {
                        this.dataSource.push({ id: 12, title: 'Last Temperature Value', deviceId: data['temperature'] ? data['temperature'] : '' });
                    }
                    if (this.sensorsInfo.includes('is_motion_sensor')) {
                        this.dataSource.push({ id: 18, title: 'Motion Sensor Operations Flag', deviceId: d && d.length ? (d[7] == '1' ? 'Working' : d[7] == '0' ? 'Faulty' : '') : '' });
                    }
                    if (this.sensorsInfo.includes('is_humidity_sensor')) {
                        this.dataSource.push({ id: 17, title: 'Humidity Sensor Operation Flag', deviceId: d && d.length ? (d[6] == '1' ? 'Working' : d[6] == '0' ? 'Faulty' : '') : '' });
                    }
                    if (this.sensorsInfo.includes('is_orientation_sensor')) {
                        this.dataSource.push({ id: 19, title: 'Orientation Sensor Operations Flag', deviceId: d && d.length ? (d[8] == '1' ? 'Working' : d[8] == '0' ? 'Faulty' : '') : '' });
                    }

                    this.dataSource.push(
                        { id: 13, title: 'Last Humidity Value', deviceId: data['humidity'] ? data['humidity'] + '%' : null },
                        { id: 14, title: 'Data Backup Operations Flag', deviceId: d && d.length ? (d[2] == '1' ? 'Working' : d[2] == '0' ? 'Faulty' : '') : '' },
                        { id: 15, title: 'Battery Level Operations Indicator', deviceId: d && d.length ? (d[3] == '1' ? 'Working' : d[3] == '0' ? 'Faulty' : '') : '' },
                        { id: 16, title: 'Temperature Sensor Operation Flag', deviceId: d && d.length ? (d[5] == '1' ? 'Working' : d[5] == '0' ? 'Faulty' : '') : '' },
                    );
                }

                setTimeout(() => {
                    this.dataSource[7].deviceId = (this.ld == 0 || this.ld === null) ? 'No Location' : this.ld == 1 ? 'GPS Location' : this.ld == 2 ? 'WiFi' : this.ld == 3 ? 'GSM' : '';
                    // this.dataSource[6].deviceId = this.frequencyData[0]?.track_time ? this.datePipe.transform(this.frequencyData[0]?.track_time, 'yyyy-MM-dd hh:mm aa') : '';
                }, 100);
            }
            this.loading = false;
            this.loadingApi = false;
        }, (err: any) => {
            this.loading = false;
            this.loadingApi = false;
        });
    }

    SendActionToDevice(type: string) {
        this.loadingApi = true;
        let url = '';
        if (this.cq.includes(this.deviceType)) {
            if (this.data.package === 8) {
                url = `${environment.AssetbaseUrl}/am/sendActionToDevice/?imei=${this.data.device_id}&action=${type}&device_type=${this.deviceType}`;
            } else {
                url = `${environment.AssetbaseUrlAdvance}/am/sendActionToDevice/?imei=${this.data.device_id}&action=${type}&device_type=${this.deviceType}`;
            }
        } else if (this.hn1.includes(this.deviceType) || this.hn15.includes(this.deviceType)) {
            url = `${environment.AssetbaseUrlAdvance}/am/sendActionToDevice/?imei=${this.data.device_id}&action=${type}&device_type=${this.deviceType}`;
        }
        // const url = `${environment.provisionerUrl}sendInstruct?imei=${this.data.device_id}&proNo=128&serverFlagId=0&cmdContent=${type}&language=en&cmdType=normallins&requestId=1&sync=true&offLineFlag=false&platform=web&timeOut=30`;
        // this.apiService.post(url, {}).subscribe((resp: ApiResponse) => {
        this.apiService.get(url).subscribe((resp: ApiResponse) => {
            this.loadingApi = false;
            if (this.cq.includes(this.deviceType)) {
                if (resp.status === 2000 || resp.status === 2001) {
                    this.deviceStatus = false;
                }
                if ((type === 'where' && resp.status === 2005) || type === 'checkFrequency') {
                    this.deviceStatusBySDK();
                }
            }
            if (!resp.error) {
                this.toastrService.success(resp.message, '', {
                    progressBar: true, progressAnimation: "decreasing", timeOut: 3000,
                });
            }
            else {
                this.toastrService.success(resp.message, '', {
                    progressBar: true, progressAnimation: "decreasing", timeOut: 3000,
                });
            }
        }, (err: any) => {
            if (this.hn1.includes(this.deviceType) || this.hn15.includes(this.deviceType)) {
                this.getDeviceFrequency();
                this.getData(this.data.device_id);
            }
            this.loadingApi = false;
        });
    }

    abortVerification() {
        this.modalRef.close();
    }

    onCloseModel() {
        this.modalRef.close();
    }

}
