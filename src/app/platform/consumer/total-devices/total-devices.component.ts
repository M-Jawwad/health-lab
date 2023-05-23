import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

import { DeviceAllocationComponent } from '../../customer/add-customer/device-allocation/device-allocation.component';
import { DeviceConfigurationComponent } from '../../customer/add-customer/device-configuration/device-configuration.component';
import { ConcoxQbitComponent } from '../../device-diagnostics/concox-qbit/concox-qbit.component';
import { DeviceDiagnosticsComponent } from '../../device-diagnostics/device-diagnostics/device-diagnostics.component';
import { HNV1Component } from '../../device-diagnostics/hn-v1.0/hn-v1.0.component';
import { HNV15Component } from '../../device-diagnostics/hn-v1.5/hn-v1.5.component';

@Component({
    selector: 'app-total-devices',
    templateUrl: './total-devices.component.html',
    styleUrls: ['./total-devices.component.scss'],
})
export class TotalDevicesComponent implements OnInit {
    title: string;

    readonly: boolean;
    loading: boolean;

    consumerId: number;
    data: any;
    totalDevices: any[] = [];
    selectedDevices: any[] = [];
    device_frequency: FormControl;

    constructor(
        private modal: NgbModal,
        private modalRef: NgbActiveModal,
        private fb: FormBuilder,
        private apiService: ApiService,
        private toastrService: ToastrService
    ) {
        this.title = 'Total Allocated Devices';
        this.loading = false;
        this.readonly = false;

        this.consumerId = 0;
        this.data = null;

        this.totalDevices = [
            // { device_id: 246253724, device_type: 'Qbit', status: 'Active', serial_no: 243242322, msisdn: 2654237547257,
            //     device_frequency: 4, allocate_date: 1128732783 },
        ];

        this.device_frequency = new FormControl(null, [Validators.required]);
    }

    ngOnInit(): void {
        this.getConsumerDevices();
    }

    getConsumerDevices() {
        this.loading = true;
        const slug = `${environment.customerms}/consumer/consumer-hardware?consumer=${this.consumerId}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.totalDevices = resp.data['data'];
            this.loading = false;
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error getting allocated devices', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onDeviceFrequency(ev: any) {
        const modalRef = this.modal.open(DeviceConfigurationComponent, {size: 'sm', scrollable: true});

        modalRef.componentInstance.data = ev;
    }

    onSelectDevices(device: any, idx: number) {
        console.log(device, idx);
        if (device.selected) {
            this.selectedDevices.push(device);
        } else {
            this.selectedDevices.splice(idx, 1);
        }
        // this.selectedDevices.push(ev);
    }

    onDeviceAllocation() {
        const modalRef = this.modal.open(DeviceAllocationComponent, {size: 'md-lg', scrollable: true});

        modalRef.componentInstance.consumerId = this.consumerId;
        modalRef.componentInstance.fromConsumer = true;

        modalRef.closed.subscribe(() => {
            this.getConsumerDevices();
        });
    }

    onSubmit() {
        this.loading = true;
        const slug = `${environment.customerms}/consumer/consumer-hardware`;
        let payload: any = { consumer: this.consumerId };

        this.selectedDevices.forEach(device => {
            payload.inventory = device.inventory;
            payload.id = device.id;
        });


        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.toastrService.success(resp.message, 'Devices successfully deallocated', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.getConsumerDevices();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error deallocating device', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onDeallocateDevice(device: any) {        
        this.loading = true;
        const slug = `${environment.customerms}/consumer/consumer-hardware`;
        let payload: any = { consumer: device.consumer, inventory: device.inventory, id: device.id };

        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.toastrService.success(resp.message, 'Devices successfully deallocated', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.getConsumerDevices();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error deallocating device', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onCloseModal() {
        this.modalRef.close();
    }

    onDeviceDiagnostic(ev: any) {
        const modalRef = this.modal.open(DeviceDiagnosticsComponent, {size: 'md', scrollable: true});
    
        modalRef.componentInstance.title = ev.device_type_name;
        modalRef.componentInstance.deviceType = ev.device_type_name;
        modalRef.componentInstance.data = ev;
        // if (ev.device_type_name === 'Concox Qbit') {
        //     const modalRef = this.modal.open(ConcoxQbitComponent, {size: 'md', scrollable: true});
    
        //     modalRef.componentInstance.title = ev.device_type_name;
        //     modalRef.componentInstance.data = ev;
        // } else if (ev.device_type_name === 'HN v1.0') {
        //     const modalRef = this.modal.open(HNV1Component, {size: 'md', scrollable: true});
    
        //     modalRef.componentInstance.title = ev.device_type_name;
        //     modalRef.componentInstance.data = ev;
        // } else if (ev.device_type_name === 'HN v1.5') {
        //     const modalRef = this.modal.open(HNV15Component, {size: 'md', scrollable: true});
    
        //     modalRef.componentInstance.title = ev.device_type_name;
        //     modalRef.componentInstance.data = ev;
        // } else {
        //     return;
        // }
    }
}
