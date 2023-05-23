import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-hn-v1.5',
    templateUrl: './hn-v1.5.component.html',
    styleUrls: ['./hn-v1.5.component.scss'],
    providers: [DatePipe]
})
export class HNV15Component implements OnInit {

    loading: boolean;
    loadingApi: boolean;
    deviceStatus: boolean;
    locationFound: boolean;
    title: string;
    locationURL: string;
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
        this.locationFound = false;
        this.title = 'HN v1.5 Diagnostics';
        this.locationURL = '';
        this.data = null;
        this.ld = null;

        this.oldDataSource = [];
    }

    ngOnInit(): void {
        this.deviceStatusBySDK();
    }

    deviceStatusBySDK() {
        this.loading = true;
        const slug = `${environment.AssetbaseUrlAdvance}/am/sendActionToDevice/?imei=${this.data.device_id}&action=checkStatus&device_type=${this.data.device_type_name}&sim_no=${this.data.sim_serial_number}`;

        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.getDeviceFrequency();

            if (resp.message === 'Device is offline') {
                console.log('device offline')
                this.deviceStatus = false;
                this.getData(this.data.device_id);
            }
            else {
                this.deviceStatus = true;
                this.getData(this.data.device_id);
                // this.signalRService.init(this.data.imei);
            }
        }, (err: any) => {
            this.loading = false;
            this.getDeviceFrequency();
            setTimeout(() => {
                this.getData(this.data.device_id);
            }, 50);
            this.toastrService.error(err.error['message'], 'Error getting device status', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    getDeviceFrequency() {
        const slug = `${environment.AssetbaseUrlAdvance}/am/device_frequency/?device_id=${this.data.device_id}`;
        this.apiService.get(slug).subscribe((resp: any) => {
            if (resp.data.data && resp.data.data.length > 0) {
                this.frequencyData = resp.data.data[0];
                if (this.frequencyData.latitude && this.frequencyData.longitude) {
                    this.locationFound = true;
                    this.locationURL = 'https://www.google.com/maps/@' + this.frequencyData.latitude + ',' + this.frequencyData.longitude + ',19z'
                }
                this.cusDataFreq = resp.data.data[0]['frequency']
                // console.log("this.cusDataFreq = = ", this.cusDataFreq, this.frequencyData);
            }
        })
    }

    getData(id: number) {
        this.loadingApi = true;
        const url = `${environment.HTracking}/hypernet/get_last_packet_device?device_id=${id}`;
        this.apiService.get(url).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.loadingApi = false;
            const data = resp.data;
            const d = data['debug'].split(",");
            if (data['device_id'] === this.data.device_id) {

                let rtp = !data['rtp'] ? 0 : 1;
                let ld = data['current_location_debug'];

                this.oldDataSource = [
                    { id: 0, title: 'Device Id', deviceId: this.data.device_id },
                    { id: 1, title: 'Device Type', deviceId: this.data.device_type_name },
                    { id: 2, title: 'Firmware Version', deviceId: null },
                    { id: 3, title: 'Signal Strength', deviceId: null },
                    { id: 4, title: 'Current Data Frequency', deviceId: this.cusDataFreq },
                    { id: 5, title: 'Last Updated Timestamp', deviceId: null },
                    { id: 6, title: 'Last Track Time', deviceId: null },
                    { id: 7, title: 'Location Status', deviceId: 0 },
                    { id: 8, title: 'Current Speed', deviceId: null },
                    { id: 9, title: 'Battery Level', deviceId: null },
                    { id: 10, title: 'Last SOS Timestamp', deviceId: '06/25/21 16:00:00' },
                    { id: 11, title: 'Last Tamper Timestamp', deviceId: '06/25/21 16:00:00' },
                    { id: 12, title: 'Last Temperature Value', deviceId: null },
                    { id: 13, title: 'Last Humidity Value', deviceId: null },
                    { id: 14, title: 'Data Backup Operations Flag', deviceId: null },
                    { id: 15, title: 'Battery Level Operations Indicator', deviceId: null },
                    { id: 16, title: 'Temperature Sensor Operation Flag', deviceId: null },
                    { id: 17, title: 'Humidity Sensor Operation Flag', deviceId: null },
                    { id: 18, title: 'Motion Sensor Operations Flag', deviceId: null },
                    { id: 19, title: 'Orientation Sensor Operations Flag', deviceId: null },
                ]

                this.dataSource = [
                    { id: 0, title: 'Device Id', deviceId: this.data.device_id },
                    { id: 1, title: 'Device Type', deviceId: this.data.device_type_name },
                    { id: 2, title: 'Firmware Version', deviceId: d[0] },
                    { id: 3, title: 'Signal Strength', deviceId: d[1] },
                    { id: 4, title: 'Current Data Frequency', deviceId: this.cusDataFreq }, //this.data?.device_type__data_transmission_frequency
                    { id: 5, title: 'Last Updated Timestamp', deviceId: this.datePipe.transform(data['timestamp'] * 1000, 'yyyy-MM-dd hh:mm:ss aa') },
                    { id: 6, title: 'Last Track Time', deviceId: this.datePipe.transform(data['timestamp'] * 1000, 'yyyy-MM-dd hh:mm:ss aa') },
                    { id: 7, title: 'Location Status', deviceId: this.frequencyData?.location_status },
                    { id: 8, title: 'Current Speed', deviceId: data['speed'] },
                    { id: 9, title: 'Battery Level', deviceId: data['battery'] },
                    { id: 10, title: 'Last SOS Timestamp', deviceId: '06/25/21 16:00:00' },
                    { id: 11, title: 'Last Tamper Timestamp', deviceId: '06/25/21 16:00:00' },
                    { id: 12, title: 'Last Temperature Value', deviceId: data['temperature'] },
                    { id: 13, title: 'Last Humidity Value', deviceId: data['humidity'] },
                    { id: 14, title: 'Data Backup Operations Flag', deviceId: d[2] },
                    { id: 15, title: 'Battery Level Operations Indicator', deviceId: d[3] },
                    { id: 16, title: 'Temperature Sensor Operation Flag', deviceId: d[5] },
                    { id: 17, title: 'Humidity Sensor Operation Flag', deviceId: d[6] },
                    { id: 18, title: 'Motion Sensor Operations Flag', deviceId: d[7] },
                    { id: 19, title: 'Orientation Sensor Operations Flag', deviceId: d[8] },
                ]

                this.makeDataSource(rtp, ld);
            }
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error getting device data');
              this.getDeviceFrequency();
        });
    }

    makeDataSource(rtp: number, ld: any) {
        setTimeout(() => {
            this.oldDataSource.forEach(oldValue => {
                // console.log('old value', oldValue);
                this.dataSource.forEach(newValue => {
                    // console.log('new value', newValue);
                    if (oldValue['id'] === newValue['id']) {
                        if (!!newValue['deviceId']) {
                            if (newValue['id'] === 5 && !!newValue['deviceId']) {
                                let dt = this.datePipe.transform(newValue['deviceId'], 'yyyy-MM-dd hh:mm:ss aa');
                                return oldValue['deviceId'] = rtp === 1 ? dt : null;
                            }

                            if (newValue['id'] === 6 && !!newValue['deviceId']) {
                                let dt = this.datePipe.transform(newValue['deviceId'], 'yyyy-MM-dd hh:mm:ss aa');
                                return oldValue['deviceId'] = (!!ld && ld != 0) ? dt : null;
                            }

                            oldValue['deviceId'] = newValue['deviceId'];
                        }
                        else {
                            return oldValue['deviceId'] = oldValue['deviceId'];
                        }
                    }
                });

                if (oldValue['id'] === 4 && !!oldValue['deviceId']) {
                    // return oldValue['deviceId'] = oldValue['deviceId'] + ' min';
                    // return !!oldValue['deviceId'] ? oldValue['deviceId'] + ' min' : ' -';
                    if (oldValue['deviceId'] == null) {
                        return oldValue['deviceId'] = ' -';
                    } else {
                        return oldValue['deviceId'] = oldValue['deviceId'] + ' min';
                    }
                }


                if (oldValue['id'] === 7) {
                    let lc = oldValue['deviceId'];
                    return oldValue['deviceId'] = lc === 0 ? 'No Location' : lc === 1 ? 'GPS Location' : lc === 2 ? 'WiFi' : 'GSM';
                }

                if (oldValue['id'] === 9 && !!oldValue['deviceId']) {
                    return oldValue['deviceId'] + '%';
                }

                return oldValue
            });

            this.oldDataSource.forEach(oldValue => {
                this.dataSource.forEach(newValue => {
                    if (oldValue['id'] === newValue['id']) {
                        if (!!newValue['deviceId']) {
                            oldValue['deviceId'] = newValue['deviceId'];
                        }
                        else {
                            oldValue['deviceId'] = oldValue['deviceId'];
                        }
                    }
                });

                if (oldValue['id'] === 13 && !!oldValue['deviceId']) {
                    return oldValue['deviceId'] + '%';
                }

                if (oldValue['id'] >= 14 && oldValue['id'] <= 20) {
                    return oldValue['deviceId'] = oldValue['deviceId'] === 0 ? 'Faulty' : 'Working';
                }

                return oldValue;
            });

            // this.dataSource[6].deviceId = this.datePipe.transform(this.frequencyData?.track_time, 'yyyy-MM-dd hh:mm:ss aa');
            this.oldDataSource[6].deviceId = this.datePipe.transform(this.frequencyData?.track_time, 'yyyy-MM-dd hh:mm:ss aa');
            // this.dataSource[8].deviceId = this.frequencyData?.speed ? this.frequencyData?.speed + 'Km/h' : '';
            this.oldDataSource[8].deviceId = this.frequencyData?.speed ? this.frequencyData?.speed + 'Km/h' : '';


        }, 100);
    }

    SendActionToDevice(type: string) {
        this.loadingApi = true;
        const url = `${environment.AssetbaseUrlAdvance}/am/sendActionToDevice/?imei=${this.data.device_id}&action=${type}&device_type=${this.data.device_type_name}`;
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
