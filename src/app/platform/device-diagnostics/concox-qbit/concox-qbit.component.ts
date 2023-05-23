import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-concox-qbit',
    templateUrl: './concox-qbit.component.html',
    styleUrls: ['./concox-qbit.component.scss'],
    providers: [DatePipe]
})
export class ConcoxQbitComponent implements OnInit {

    loading: boolean;
    loadingApi: boolean;
    deviceStatus: boolean;
    title: string;
    data: any;
    ld: any;

    cusDataFreq: any = null;
    frequencyData: any = null;

    oldDataSource: any[] = [];
    dataSource: any[] = [];

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
        private datePipe: DatePipe,
    ) {
        this.loadingApi = false;
        this.loading = false;
        this.deviceStatus = false;
        this.title = 'Qbit Diagnostics';
        this.data = null;
        this.ld = null;

        this.oldDataSource = [];
    }

    ngOnInit(): void {
        this.deviceStatusBySDK();
        // this.SendActionToDevice('STATUS%23');
        // this.SendActionToDevice('checkStatus');

    }

    ngAfterViewInit(): void {
        console.log("this.data==> ", this.data)
    }

    deviceStatusBySDK() {
        this.loading = true;
        const slug = `${environment.AssetbaseUrl}/am/sendActionToDevice/?imei=${this.data.device_id}&action=checkStatus&device_type=${this.data.device_type_name}`;

        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.getDeviceFrequency();

            if (resp.status === 2000 || resp.status === 2001 || resp.status === 2003) {
                this.deviceStatus = false;
                this.toastrService.error(resp.message);
                this.getData(this.data.device_id);
            }
            else {
                this.deviceStatus = true;
                this.getData(this.data.device_id);
            }
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error getting device status', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    getDeviceFrequency() {
        const slug = `${environment.AssetbaseUrl}/am/device_frequency/?device_id=${this.data.device_id}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            this.frequencyData = resp.data.data;
            console.log(" this.frequencyData===> ", this.frequencyData)
            if (resp.data.data.length > 0) {
                this.cusDataFreq = resp.data.data[0]['frequency']
                console.log("this.cusDataFreq = = ", this.cusDataFreq);
            }
        })
    }

    getData(id: number) {
        this.loading = true;
        const url = `${environment.HTracking}/hypernet/get_last_packet_device?device_id=${id}`;
        this.apiService.get(url).subscribe((resp: ApiResponse) => {

            const data = resp.data;
            this.ld = data['ld']
            const d = data['debug'].split(",");

            if (data['device_id'] === this.data.device_id) {
                let sos_timestamp = data['sos_timestamp'] ? data['sos_timestamp'] : '';
                this.oldDataSource = [
                    { id: 0, title: 'Device Id', deviceId: this.data.device_id },
                    { id: 1, title: 'Device Type', deviceId: this.data.device_type_name },
                    { id: 2, title: 'Firmware Version', deviceId: null },
                    { id: 3, title: 'Signal Strength', deviceId: null },
                    { id: 4, title: 'Current Data Frequency', deviceId: this.cusDataFreq }, //null
                    { id: 5, title: 'Last Updated Timestamp', deviceId: null },
                    { id: 6, title: 'Last Track Time', deviceId: this.datePipe.transform(this.frequencyData[0]?.track_time, 'yyyy-MM-dd hh:mm:ss aa') },
                    { id: 7, title: 'Location Status', deviceId: 0 },
                    { id: 8, title: 'Current Speed', deviceId: null },
                    { id: 9, title: 'Battery Level', deviceId: null },
                    { id: 10, title: 'Last SOS Timestamp', deviceId: sos_timestamp != '' ? this.datePipe.transform(sos_timestamp * 1000, 'yyyy-MM-dd hh:mm:ss aa') : '' },
                ]


                this.dataSource = [
                    { id: 0, title: 'Device Id', deviceId: this.data.device_type_id },
                    { id: 1, title: 'Device Type', deviceId: this.data.device_type_name },
                    { id: 2, title: 'Firmware Version', deviceId: d[0] },
                    { id: 3, title: 'Signal Strength', deviceId: d[1] },
                    { id: 4, title: 'Current Data Frequency', deviceId: this.cusDataFreq },
                    { id: 5, title: 'Last Updated Timestamp', deviceId: this.datePipe.transform(data['timestamp'], 'yyyy-MM-dd hh:mm:ss aa') },
                    { id: 6, title: 'Last Track Time', deviceId: this.datePipe.transform(this.frequencyData[0]?.track_time, 'yyyy-MM-dd hh:mm:ss aa') },
                    { id: 7, title: 'Location Status', deviceId: this.frequencyData[0]?.location_status },
                    { id: 8, title: 'Current Speed', deviceId: data['speed'] },
                    { id: 9, title: 'Battery Level', deviceId: data['battery_level'] },
                    { id: 10, title: 'Last SOS Timestamp', deviceId: sos_timestamp },
                ]

                let rtp = !data['rtp'] ? 0 : 1;

                console.log("this.oldDataSource== ", this.oldDataSource)
                console.log("this.dataSource== ", this.dataSource)

                setTimeout(() => {
                    this.oldDataSource.forEach(oldValue => {
                        this.dataSource.forEach(newValue => {
                            if (oldValue['id'] === newValue['id']) {
                                if (!!newValue['deviceId']) {

                                    if (newValue['id'] === 5 && !!newValue['deviceId']) {
                                        let dt = this.datePipe.transform(newValue['deviceId'], 'yyyy-MM-dd hh:mm:ss aa');
                                        return oldValue['deviceId'] = rtp === 1 ? dt : null;
                                    }

                                    if (newValue['id'] === 6 && !!newValue['deviceId']) {
                                        let ld = data['current_location_debug'];
                                        let dt = this.datePipe.transform(newValue['deviceId'], 'yyyy-MM-dd hh:mm:ss aa');
                                        return oldValue['deviceId'] = (!!ld && ld != 0) ? dt : null;
                                    }

                                    return oldValue['deviceId'] = newValue['deviceId'];
                                }
                                else {
                                    return oldValue['deviceId'] = oldValue['deviceId'];
                                }
                            }
                        });

                        if (oldValue['id'] === 4 && !!oldValue['deviceId']) {
                            // console.log("oldValue['deviceId'] = = ", oldValue['deviceId'])
                            // return oldValue['deviceId'] = oldValue['deviceId'] + ' min';
                            if (oldValue['deviceId'] == null) {
                                return oldValue['deviceId'] = ' -';
                            } else {
                                return oldValue['deviceId'] = oldValue['deviceId'] + ' min';
                            }

                        }

                        // if (oldValue['id'] === 7) {
                        //   let lc = oldValue['deviceId'];
                        //   return oldValue['deviceId'] = lc === 0 ? 'No Location' : lc === 1 ? 'GPS Location' : lc === 2 ? 'WiFi' : 'GSM';
                        // }

                        if (oldValue['id'] === 9 && !!oldValue['deviceId']) {
                            return oldValue['deviceId'] = oldValue['deviceId'] + '%';
                        }
                        return oldValue;
                    });

                    this.dataSource[5].deviceId = this.datePipe.transform(this.frequencyData[0]?.last_updated_time, 'yyyy-MM-dd hh:mm:ss aa');
                    this.oldDataSource[5].deviceId = this.datePipe.transform(this.frequencyData[0]?.last_updated_time, 'yyyy-MM-dd hh:mm:ss aa');
                    this.dataSource[6].deviceId = this.datePipe.transform(this.frequencyData[0]?.track_time, 'yyyy-MM-dd hh:mm:ss aa');
                    this.oldDataSource[6].deviceId = this.datePipe.transform(this.frequencyData[0]?.track_time, 'yyyy-MM-dd hh:mm:ss aa');
                    this.dataSource[8].deviceId = (this.frequencyData[0]?.speed || this.frequencyData[0]?.speed === 0) ? this.frequencyData[0]?.speed + 'Km/h' : '';
                    this.oldDataSource[8].deviceId = (this.frequencyData[0]?.speed || this.frequencyData[0]?.speed === 0) ? this.frequencyData[0]?.speed + 'Km/h' : '';
                    this.dataSource[10].deviceId = this.datePipe.transform(this.dataSource[10].deviceId, 'yyyy-MM-dd hh:mm:ss aa');
                    this.oldDataSource[10].deviceId = this.datePipe.transform(this.oldDataSource[10].deviceId, 'yyyy-MM-dd hh:mm:ss aa');
                    this.dataSource[7].deviceId = (this.ld == 0 || this.ld === null) ? 'No Location' : this.ld == 1 ? 'GPS Location' : this.ld == 2 ? 'WiFi' : this.ld == 3 ? 'GSM' : '';
                    this.oldDataSource[7].deviceId = (this.ld == 0 || this.ld === null) ? 'No Location' : this.ld == 1 ? 'GPS Location' : this.ld == 2 ? 'WiFi' : this.ld == 3 ? 'GSM' : '';

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
        const url = `${environment.AssetbaseUrl}/am/sendActionToDevice/?imei=${this.data.device_id}&action=${type}&device_type=${this.data.device_type_name}`;
        // const url = `${environment.provisionerUrl}sendInstruct?imei=${this.data.device_id}&proNo=128&serverFlagId=0&cmdContent=${type}&language=en&cmdType=normallins&requestId=1&sync=true&offLineFlag=false&platform=web&timeOut=30`;
        // this.apiService.post(url, {}).subscribe((resp: ApiResponse) => {
        this.apiService.get(url).subscribe((resp: ApiResponse) => {
            this.loadingApi = false;
            if (resp.status === 2000 || resp.status === 2001) {
                this.deviceStatus = false;
            }
            if ((type === 'where' && resp.status === 2005) || type === 'checkFrequency') {
                this.deviceStatusBySDK();
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
            this.getDeviceFrequency();
            this.getData(this.data.device_id);
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
