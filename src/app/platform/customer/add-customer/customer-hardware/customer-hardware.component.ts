import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ConcoxQbitComponent } from 'src/app/platform/device-diagnostics/concox-qbit/concox-qbit.component';
import { DeviceDiagnosticsComponent } from 'src/app/platform/device-diagnostics/device-diagnostics/device-diagnostics.component';
import { HNV1Component } from 'src/app/platform/device-diagnostics/hn-v1.0/hn-v1.0.component';
import { HNV15Component } from 'src/app/platform/device-diagnostics/hn-v1.5/hn-v1.5.component';
import { ApiService } from 'src/app/services/api.service';

import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { environment } from 'src/environments/environment';

import { DeviceAllocationComponent } from '../device-allocation/device-allocation.component';
import { DeviceConfigurationComponent } from '../device-configuration/device-configuration.component';


@Component({
    selector: 'app-customer-hardware',
    templateUrl: './customer-hardware.component.html',
    styleUrls: ['./customer-hardware.component.scss']
})
export class CustomerHardwareComponent implements OnInit {
    loading: boolean;
    @Input() readonly: boolean;
    fleetDevices: any[];
    customerUsecases: any[];

    title: string;
    @Input() customerId: number;
    @Output() signals: EventEmitter<any>;

    activeId: any;
    usecaseId: number;

    constructor(
        private modal: NgbModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.loading = false;
        this.readonly = false;
        this.title = 'Edit Frequency';
        this.customerId = 0;
        this.signals = new EventEmitter();

        this.customerUsecases = [];
        this.fleetDevices = [];

        this.activeId = null;
        this.usecaseId = 0;
    }

    ngOnInit(): void {
        this.getCustomerUsecases();
    }

    getCustomerUsecases() {
        this.signals.emit({ loading: true });
        const slug = `${environment.customerms}/customers/get-customer-usecase?customer=${this.customerId}`;

        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.signals.emit({ loading: false });
            this.customerUsecases = resp.data['data'];
            console.log("this.customerUsecases== ", this.customerUsecases)
            if (this.customerUsecases.length > 0) {
                this.activeId = this.customerUsecases[0].usecase_name;
                this.customerUsecases.forEach(element => {
                    if (element.is_selected) {
                        this.usecaseId = element.usecase;
                    }
                });
            }
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error getting device types', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    getAllocatedHardware(ev?: any, activeId?: string, opened?: boolean) {
        this.usecaseId = ev;
        this.activeId = activeId;

        if (opened) {
            this.signals.emit({ loading: true });
            this.loading = true;
            const slug = `${environment.customerms}/customers/customer-hardware?customer=${this.customerId}&usecase=${ev}`;
            this.apiService.get(slug).subscribe((resp: ApiResponse) => {
                this.fleetDevices = resp.data['data'];
                console.log("this.fleetDevices==> ", this.fleetDevices)
                this.loading = false;
                this.signals.emit({ loading: false });
            }, (err: any) => {
                this.loading = false;
                this.signals.emit({ loading: false });
                this.toastrService.error(err.error['message'], 'Error getting allocated hardware', {
                    progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                });
            });
        } else {
            return;
        }
    }

    onSubmit() {
    }

    onAllocateDevice(usecase: any) {
        const modalRef = this.modal.open(DeviceAllocationComponent, { size: 'md-lg', scrollable: true });

        modalRef.componentInstance.customerId = this.customerId;
        modalRef.componentInstance.data = usecase;

        modalRef.closed.subscribe(() => {
            this.getAllocatedHardware(this.usecaseId, '', true);
        });
    }

    onDeallocateDevice(ev: any) {
        const slug = `${environment.customerms}/customers/customer-hardware`;
        let payload = { device_type: ev.device_type, customer: this.customerId, inventory: ev.inventory, id: ev.id };
        AlertService.confirm('Are you sure?', 'You want to de-allocate this device', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.signals.emit({ loading: true });
                this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
                    this.signals.emit({ loading: false });
                    this.getAllocatedHardware(this.usecaseId, '', true);
                    this.toastrService.success(resp.message, 'Succefully deallocated', {
                        progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                    });
                }, (err: any) => {
                    this.signals.emit({ loading: false });
                    this.toastrService.error(err.error['message'], 'Error deallocating device', {
                        progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
                    });
                });
            } else {
                return;
            }
        })
    }

    onEditFrequency(device: any) {
        const modalRef = this.modal.open(DeviceConfigurationComponent, { size: 'sm', scrollable: true });

        modalRef.componentInstance.data = device;

        modalRef.closed.subscribe(() => {
            this.getAllocatedHardware(this.usecaseId, '', true);
        });
    }

    onCloseModal() {
        this.modal.dismissAll();
    }

    onDeviceDiagnostic(ev: any, usecase: any) {
        let pkg = null;
        this.customerUsecases.forEach(ele => {
            if (ele.usecase === usecase.usecase) {
                pkg = usecase.package;
            }
        });
        ev.package = pkg;

        const modalRef = this.modal.open(DeviceDiagnosticsComponent, { size: 'md', scrollable: true });

        modalRef.componentInstance.title = ev.device_type_name;
        modalRef.componentInstance.deviceType = ev.device_type_name;
        modalRef.componentInstance.data = ev;
        // if (ev.device_type_name === 'Concox Qbit') {
        //     const modalRef = this.modal.open(ConcoxQbitComponent, { size: 'md', scrollable: true });

        //     modalRef.componentInstance.title = ev.device_type_name;
        //     modalRef.componentInstance.data = ev;
        // } else if (ev.device_type_name === 'HN v1.0') {
        //     const modalRef = this.modal.open(HNV1Component, { size: 'md', scrollable: true });

        //     modalRef.componentInstance.title = ev.device_type_name;
        //     modalRef.componentInstance.data = ev;
        // } else if (ev.device_type_name === 'HN v1.5') {
        //     const modalRef = this.modal.open(HNV15Component, { size: 'md', scrollable: true });

        //     modalRef.componentInstance.title = ev.device_type_name;
        //     modalRef.componentInstance.data = ev;
        // } else {
        //     return;
        // }
    }
}
