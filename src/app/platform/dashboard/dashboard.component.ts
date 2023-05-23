import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { interval } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    providers: [DatePipe]
})
export class DashboardComponent {

    usecaseSubscriptionCards: any[];
    data: any[];
    devicesData: any[] = [];
    devicesStats: any[];

    devicesInfo: any[];

    customerInfo: any;
    totalDevices: any;
    onlineDevices: any;
    offlineDevices: any;
    soldAllocated: any;
    percent: any;

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService,
        private datePipe: DatePipe,
        private http: HttpClient
    ) {
        this.usecaseSubscriptionCards = [];
        this.devicesStats = [];
        this.data = [];
        this.totalDevices = null;

        this.devicesInfo = [
            {
                title: 'FMS Connected devices',
                data:
                    { total_devices: 100, online: 23, offline: 77 }
            }
        ];
        this.offlineDevices = 0;
        this.customerInfo = { total_custoemr: 0, total_active_customer: 0, total_inactive_customer: 0 };
    }

    ngOnInit(): void {
        this.getInventory();
        this.getCustomerInfo();
        this.getDeviceStatistics();
        setTimeout(() => {
            this.getForkAPIS()

        }, 1000)
    }

    getCustomerInfo() {
        const slug = `${environment.customerms}/customers/dashboard`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.customerInfo = resp.data;
            this.usecaseSubscriptionCards = resp.data['usecase_subscription_count'];
            this.data = resp.data['usecase_vs_subscription']

            this.usecaseSubscriptionCards.forEach((element: any) => {
                if (element.id == 1) {
                    element.icon = '/assets/images/vehicals-icon.png';
                } else if (element.id == 2) {
                    element.icon = '/assets/images/asset-SS-icon.png';
                } else if (element.id == 3) {
                    element.icon = '/assets/images/cameraaa-icon.png';
                } else if (element.id == 4) {
                    element.icon = '/assets/images/buildinggg-icon.png';
                    // } else if (element.id == 5) {
                    //     element.icon = '/assets/images/buildinggg-icon.png';
                } else {
                    element.icon = '/assets/images/image-not-found.png';
                }
            });

            // map keys 'use_case' to name for graph
            this.data.map(item => {
                item.name = item['use_case'];
            })
        }, (err: any) => {
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error getting information about customers', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }
        });
    }

    getInventory() {
        const slug = `${environment.inventoryms}/inventory/get-inventory-cards?package=all`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.totalDevices = resp.data['data'];
            let data = resp.data['data'];
            this.devicesData = [
                { name: 'Available', count: data?.available_devices },
                { name: 'Allocated', count: data?.allocated_devices },
                { name: 'Sold', count: data?.sold_devices },
                { name: 'Faulty', count: data?.faulty_devices },
            ];

            this.soldAllocated = this.totalDevices?.allocated_devices + this.totalDevices?.sold_devices//data?.allocated_devices + data?.sold_devices;
            this.devicesInfo = [
                {
                    title: 'Connected devices',
                    data:
                        { total_devices: this.soldAllocated, online: data?.sold_devices, offline: data?.total_devices - data?.sold_devices }
                }
            ];

        }, (err: any) => {
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error getting inventory information', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }
        });
    }

    getDeviceStatistics() {
        const slug = `${environment.inventoryms}/inventory/dashboard`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            let devData: any[] = [];
            let data = resp.data['total_devices_statistics'][0];
            setTimeout(() => {
                data.forEach((element: any) => {
                    const date = new Date(element.year, element.month);
                    // const date = this.datePipe.transform(new Date(element.year, element.month), 'yyyy-MM-dd');
                    devData.push({ date: date, value: this.totalDevices.total_devices });
                });
                this.devicesStats = devData;
            }, 100);
        }, (err: any) => {
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error getting info about device statistics', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }
        });
    }

    getForkAPIS() {
        var totalOnline = 0;
        var totalOffline = 0;
        var totalOnline2 = 0;
        var totalOffline2 = 0;
        var totalOnline3 = 0;
        var totalOffline3 = 0;
        var totalOnline4 = 0;
        var totalOffline4 = 0;
        var grandTotalOnline = 0;
        var grandTotalOffline = 0;
        const slugOne = `${environment.fms}/iof/devices/`;
        const slugTwo = `${environment.AssetbaseUrl}/am/deviceactivestatus/`;
        const slugThree = `${environment.AssetbaseUrlAdvance}/am/deviceactivestatus/`;
        const slugFour = `${environment.consumer}/am/deviceactivestatus/`;
        this.apiService.get(slugOne).subscribe((respOne: ApiResponse) => {
            totalOnline = respOne.data[0]?.online_devices;
            // totalOffline = respOne.data[0]?.offline_devices;
            grandTotalOnline = totalOnline + totalOnline2 + totalOnline3 + totalOnline4
            // grandTotalOffline = totalOffline + totalOffline2 + totalOffline3 + totalOffline4
            this.onlineDevices = grandTotalOnline
            // this.offlineDevices = grandTotalOffline
        })

        this.apiService.get(slugTwo).subscribe((respTwo: ApiResponse) => {
            totalOnline2 = respTwo.data?.online_devices;
            // totalOffline2 = respTwo.data?.offline_devices;
            grandTotalOnline = totalOnline + totalOnline2 + totalOnline3 + totalOnline4
            // grandTotalOffline = totalOffline + totalOffline2 + totalOffline3 + totalOffline4
            this.onlineDevices = grandTotalOnline
            // this.offlineDevices = grandTotalOffline
        })


        this.apiService.get(slugThree).subscribe((respThree: ApiResponse) => {
            totalOnline3 = respThree.data?.online_devices;
            // totalOffline3 = respThree.data?.offline_devices;
            grandTotalOnline = totalOnline + totalOnline2 + totalOnline3 + totalOnline4
            // grandTotalOffline = totalOffline + totalOffline2 + totalOffline3 + totalOffline4
            this.onlineDevices = grandTotalOnline
            // this.offlineDevices = grandTotalOffline
        })



        this.apiService.get(slugFour).subscribe((respFour: ApiResponse) => {
            totalOnline4 = respFour.data?.online_devices;
            // totalOffline4 = respFour.data?.offline_devices;
            grandTotalOnline = totalOnline + totalOnline2 + totalOnline3 + totalOnline4
            // grandTotalOffline = totalOffline + totalOffline2 + totalOffline3 + totalOffline4

            this.onlineDevices = grandTotalOnline
            // this.offlineDevices = grandTotalOffline
        })

        setTimeout(() => {
            this.percent = (this.onlineDevices / this.soldAllocated) * 100;
            this.offlineDevices = this.devicesInfo[0].data.total_devices - this.onlineDevices
        }, 1000)
        // this.percent = ((this.percent).toString()).toFixed(2)
    }

    scrollLeft(el: Element) {
        const animTimeMs = 400;
        const pixelsToMove = 228;
        const stepArray = [0.001, 0.021, 0.136, 0.341, 0.341, 0.136, 0.021, 0.001];
        interval(animTimeMs / 8).pipe(
            takeWhile(value => value < 8),
            tap(value => el.scrollLeft -= (pixelsToMove * stepArray[value])),
        ).subscribe();
    }

    scrollRight(el: Element) {
        const animTimeMs = 400;
        const pixelsToMove = 228;
        const stepArray = [0.001, 0.021, 0.136, 0.341, 0.341, 0.136, 0.021, 0.001];
        interval(animTimeMs / 8).pipe(
            takeWhile(value => value < 8),
            tap(value => el.scrollLeft += (pixelsToMove * stepArray[value])),
        ).subscribe();
    }
}