import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-device-allocation',
    templateUrl: './device-allocation.component.html',
    styleUrls: ['./device-allocation.component.scss']
})
export class DeviceAllocationComponent implements OnInit {
    loading: boolean;
    readonly: boolean;
    fromConsumer: boolean;
    title: string;

    @Input() customerId: number;
    @Input() consumerId: number;
    @Input() data: any;

    devices: any[];
    deviceTypes: any[];
    selectedDevices: any[];

    deviceAllocationForm: FormGroup;
    selectedDeviceIDS: any[];

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.loading = false;
        this.readonly = false;
        this.fromConsumer = false;
        this.title = 'Allocate Devices';

        this.customerId = 0;
        this.consumerId = 0;
        this.data = null;

        this.deviceAllocationForm = new FormGroup({
            id: new FormControl(null),
            device_type: new FormControl(null, [Validators.required]),
            device_id: new FormControl(null, [Validators.required])
        });

        this.devices = []
        this.deviceTypes = []
        this.selectedDevices = [];
        this.selectedDeviceIDS = []
    }

    ngOnInit(): void {
        this.getDeviceTypes();
    }

    getDeviceTypes() {
        this.loading = true;
        const slug = this.fromConsumer ? `${environment.customerms}/consumer/consumer-device-type` :
            `${environment.customerms}/customers/get-customer-hardware-device-type?usecase=${this.data.usecase}&package=${this.data.package}`;

        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.deviceTypes = resp.data['data'];
            this.loading = false;
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error getting device types', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    getConsumerDevices() {
        const slug = `${environment.customerms}/consumer/consumer-device-type/`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.deviceTypes = resp.data['data'];
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting device types', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    onSelectDeviceType(ev: any) {
        let idx = this.deviceTypes.findIndex(element => {
            return element.device_type_id === ev;
        });

        let id = this.deviceTypes[idx].id;
        this.deviceAllocationForm.get('device_id')?.setValue(null);
        this.getDeviceIds(id);
    }

    getDeviceIds(id: number) {
        const slug = this.fromConsumer ? `${environment.customerms}/consumer/consumer-inventory?device_type=${id}` :
            `${environment.customerms}/customers/get-customer-hardware-inventory?usecase=${this.data.usecase}&package=${this.data.package}&device_type=${id}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.devices = resp.data['data'];
            this.filterDeviceIds();

        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting devices', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    filterDeviceIds() {
        if (this.devices.length > 0 && this.selectedDevices.length > 0) {
            for (let i = 0; i < this.selectedDevices.length; i++) {
                if (this.selectedDevices[i].device_id.length > 0) {

                    for (let j = 0; j < this.selectedDevices[i].device_id.length; j++) {
                        if (this.selectedDevices[i].device_type == this.deviceAllocationForm.controls['device_type'].value) {
                            let index = this.devices.findIndex(ele => {
                                return ele.device_id === this.selectedDevices[i].device_id[j];
                            });
                            if (index != -1) {
                                this.devices.splice(index, 1)
                            }
                        }
                    }
                }
            }
        }
    }

    onSelectDeviceID(event: any) {
        if (event.length > 0) {
            for (let i = 0; i < event.length; i++) {
                for (let y = 0; y < this.devices.length; y++) {
                    if (event[i] == this.devices[y].device_id) {
                        this.selectedDeviceIDS.push(this.devices[y])
                    }
                }
            }
        }
        // To remove duplicate from array
        var unique = this.selectedDeviceIDS.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        })
        this.selectedDeviceIDS = unique
    }

    onAddDevice() {
        let data = this.deviceAllocationForm.value;
        let type = data.id ? 'onEdit' : 'onAdd';
        let allowAdd = false;

        const sd = this.deviceTypes.find(ele => {
            return ele.device_type_id === data.device_type;
        });

        data.id = type === 'onAdd' ? this.selectedDevices.length + 1 : data.id;
        this.selectedDevices.find(ele => {
            return allowAdd = ele.device_type === data.device_type;
        });

        // if (!allowAdd) {
        if (type === 'onEdit') {
            const idx = this.selectedDevices.findIndex(rec => rec.id === data.id);
            if (idx != -1) {
                this.selectedDevices.splice(idx, 1, { id: data.id, device_type_name: sd.device_type, device_type: data.device_type, device_id: data.device_id });
            } else {
                this.selectedDevices.push({ id: data.id, device_type_name: sd.device_type, device_type: data.device_type, device_id: data.device_id });
            }
        } else {
            this.selectedDevices.push({ id: data.id, device_type_name: sd.device_type, device_type: data.device_type, device_id: data.device_id });
        }

        this.deviceAllocationForm.reset();
        // } else {
        //     return;
        // }

        // console.log(this.selectedDevices);
    }

    onEditDevice(ev: any, idx: number) {
        this.deviceAllocationForm.patchValue(ev);
        this.selectedDevices.splice(idx, 1);
        this.filterDeviceIds();
    }

    onDeleteDevice(idx: number) {
        this.selectedDevices.splice(idx, 1);
    }

    onSubmit() {
        this.loading = true;
        const slug = this.fromConsumer ? `${environment.customerms}/consumer/consumer-hardware` :
            `${environment.customerms}/customers/customer-hardware`;

        let customerDevices: any[] = [];
        let deviceType: any = null;
        let invId: any = null;
        let deviceId: any[] = [];
        let inventoryDeviceIds: any[] = [];
        let dummyDT: any[] = [];
        let finalInvL: any[] = [];
        let finalDevIds: any[] = [];

        this.selectedDevices.forEach(element => {
            let idx = this.deviceTypes.findIndex(device => {
                return element.device_type === device.device_type_id;
            });

            deviceType = this.deviceTypes[idx].id;

            deviceId = [];
            inventoryDeviceIds = [];

            this.selectedDeviceIDS.forEach(ele => {
                element.device_id.forEach((id: any) => {
                    if (id === ele.device_id) {
                        invId = ele.inventory_id;
                        if (ele.inventory_id === invId) {
                            inventoryDeviceIds.push(ele.device_id);
                            deviceId.push(+ele.id);
                        }
                    }
                });
            });

            // To remove duplicate from `deviceId` array
            var unique_deviceId = deviceId.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            })
            deviceId = unique_deviceId;

            // To remove duplicate from `deviceId` array
            var unique_inventoryDeviceIds = inventoryDeviceIds.filter(function (elem, index, self) {
                return index === self.indexOf(elem);
            })
            inventoryDeviceIds = unique_inventoryDeviceIds

            if (this.fromConsumer) {
                customerDevices.push({ device_type: deviceType, inventory_list: deviceId, inventory_device_ids: inventoryDeviceIds });
            } else {
                customerDevices.push({ package: this.data.package, usecase: this.data.usecase, device_type: deviceType, inventory_list: deviceId, inventory_device_ids: inventoryDeviceIds });
            }
        });

        customerDevices.forEach(ele => {
            if (!dummyDT.includes(ele.device_type)) {
                dummyDT.push(ele.device_type);
            }
        });

        let dt: any[] = [];
        dummyDT.forEach(ele => {
            finalDevIds = [];
            finalInvL = [];
            customerDevices.forEach(elem => {
                if (ele === elem.device_type) {
                    elem.inventory_list.forEach((il: any) => {
                        finalInvL.push(il);
                    });
                    elem.inventory_device_ids.forEach((idl: any) => {
                        finalDevIds.push(idl);
                    });
                }

            });

            if (this.fromConsumer) {
                dt.push({ device_type: ele, inventory_list: finalInvL, inventory_device_ids: finalDevIds });
            } else {
                dt.push({ package: this.data.package, usecase: this.data.usecase, device_type: ele, inventory_list: finalInvL, inventory_device_ids: finalDevIds });
            }
        });


        let payload = null;
        if (this.fromConsumer) {
            payload = { consumer: this.consumerId, consumer_devices: dt };
        } else {
            payload = { customer: this.customerId, customer_devices: dt };
        }
        // console.log(payload);

        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
            this.modalRef.close();
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error submitting devices', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        });
    }

    onCloseModal() {
        this.modalRef.close();
    }
}
