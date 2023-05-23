import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import * as dateFns from 'date-fns';
import { Helpers } from 'src/app/utils/helpers';
import { environment } from 'src/environments/environment';
import { CustomValidators } from 'src/app/utils/custom-validators';


@Component({
    selector: 'app-inventory-form',
    templateUrl: './inventory-form.component.html',
    styleUrls: ['./inventory-form.component.scss']
})
export class InventoryFormComponent implements OnInit {
    loading: boolean;
    readonly: boolean;

    title: string;

    packages: any[];
    deviceStatuses: any[];
    deviceTypes: any[];
    categories: any[];

    data: any;
    maxDate: any;

    deviceForm: FormGroup;

    constructor(
        private apiService: ApiService,
        private modalRef: NgbActiveModal,
        private toastrService: ToastrService,
        private fb: FormBuilder,
        private ff: NgbDateAdapter<string>
    ) {
        this.loading = false;
        this.readonly = false;

        this.title = 'Add Device';

        this.packages = [];
        this.deviceStatuses = [];
        this.deviceTypes = [];
        this.categories = [];

        this.data = null;

        this.deviceForm = this.fb.group({
            device_id: [null, [Validators.required, Validators.maxLength(15), CustomValidators.noWhiteSpace]],
            package: [null, [Validators.required]],
            device_type: [null, [Validators.required]],
            sku_code: [null, [Validators.required, Validators.maxLength(18), CustomValidators.noWhiteSpace]],
            sim_serial_number: [null],
            sim_msisdn: [null],
            number_of_sim: [null, [Validators.required]],
            type_of_sim: [null, [Validators.required]],
            sku_category: [null, [Validators.required, Validators.maxLength(20), CustomValidators.noWhiteSpace]],
            item_description: [null, [Validators.required, Validators.maxLength(50), CustomValidators.noWhiteSpace]],
            make: [null, [Validators.required, Validators.maxLength(18), CustomValidators.noWhiteSpace]],
            model: [null, [Validators.required, Validators.maxLength(18), CustomValidators.noWhiteSpace]],
            supplier: [null, [Validators.required, Validators.maxLength(18), CustomValidators.noWhiteSpace]],
            hs_code: [null, [Validators.required, Validators.maxLength(22), CustomValidators.noWhiteSpace]],
            product_code: [null, [Validators.required, Validators.maxLength(30), CustomValidators.noWhiteSpace]],
            current_cost_price: [null, [Validators.required, Validators.maxLength(18), CustomValidators.noWhiteSpace, CustomValidators.integerOnly]],
            date_of_manufacture: [null, [Validators.required]],
            status: [1, [Validators.required]],
            additional_information: [null, [Validators.maxLength(50)]],
        });
    }

    ngOnInit(): void {
        this.getPackages();
        this.getDeviceStatuses();

        let cd = dateFns.format(new Date(), 'dd-MM-yyyy').split('-');
        this.maxDate = { year: +cd[2], month: +cd[1], day: +cd[0] };

        if (!!this.data) {
            let dt = this.data.date_of_manufacture;
            let dat = (dateFns.format(new Date(dt), 'dd-MM-yyyy')).split('-');
            let date = { year: +dat[2], month: +dat[1], day: +dat[0] };

            this.deviceForm.patchValue(this.data);
            this.deviceForm.get('date_of_manufacture')?.setValue(date);
            this.deviceForm.get('package')?.setValue(this.data.package);
            this.deviceForm.get('date_of_manufacture')?.setValue(date);
            this.getDeviceTypes(this.data.package);
        }
    }

    getPackages() {
        let slug = `${environment.inventoryms}/inventory-common/get-usecase-package`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.packages = resp.data['data'];
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting packages', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onSelectPackage(ev: any) {
        this.getDeviceTypes(ev);
    }

    getDeviceTypes(id: number) {
        const slug = `${environment.inventoryms}/inventory/get-device-type?package=${id}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.deviceTypes = resp.data['data'];
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting device types', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    getDeviceStatuses() {
        const slug = `${environment.inventoryms}/inventory/get-device-status`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            var array = resp.data['data'];

            if (this.data?.status === 5) {
                // Faulty tab
                if (array?.length > 0) {
                    for (let i = 0; i < array?.length; i++) {
                        if (array[i].name == 'Available' || array[i].name == 'Faulty' || array[i].name == 'Sold') {
                            this.deviceStatuses.push(array[i])
                        }
                    }
                }
            } else if (this.data?.status === 4) {
                // Deactivate tab
                if (array?.length > 0) {
                    for (let i = 0; i < array?.length; i++) {
                        if (array[i].name == 'Available' || array[i].name == 'Deactivate') {
                            this.deviceStatuses.push(array[i])
                        }
                    }
                }
            } else if (this.data?.status === 3) {
                // Sold tab
                if (array?.length > 0) {
                    for (let i = 0; i < array?.length; i++) {
                        if (array[i].name == 'Available' || array[i].name == 'Faulty' || array[i].name == 'Sold') {
                            this.deviceStatuses.push(array[i])
                        }
                    }
                }
            } else if (this.data?.status === 2) {
                // Allocated tab
                if (array?.length > 0) {
                    for (let i = 0; i < array?.length; i++) {
                        if (array[i].name == 'Available' || array[i].name == 'Faulty' || array[i].name == 'Sold' || array[i].name == 'Allocated') {
                            this.deviceStatuses.push(array[i])
                        }
                    }
                }
            } else if (this.data?.status === 1) {
                // Available tab
                if (array?.length > 0) {
                    for (let i = 0; i < array?.length; i++) {
                        if (array[i].name == 'Available' || array[i].name == 'Faulty' || array[i].name == 'Sold' || array[i].name == 'Deactivate') {
                            this.deviceStatuses.push(array[i])
                        }
                    }
                }
            } else {
                this.deviceStatuses = resp.data['data'];
            }
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting device statuses', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onSubmit() {
        this.loading = true;
        const slug = `${environment.inventoryms}/inventory/`;
        let formData = this.deviceForm.value;
        let dom = formData.date_of_manufacture;
        let payload = Helpers.removeWhiteSpaces(formData);
        payload.date_of_manufacture = `${dom.day}-${dom.month}-${dom.year}`;
        if (this.data && this.data.id) {
            payload.id = this.data.id;
            this.updateInventory(slug, payload);
        } else {
            this.createInventory(slug, payload);
        }
    }

    createInventory(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.modalRef.close();
            this.toastrService.success(resp.message, 'Inventory added successfully', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error creating inventory', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    updateInventory(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.toastrService.success(resp.message, 'Inventory updated successfully', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            // DONOT call this for now
            // this.deAllocateDevice(payload);
            this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error updating inventory', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    // deAllocateDevice(ev: any) {
    //     console.log("ev== ", ev)
    //     const slug = `${environment.customerms}/customers/customer-hardware`;
    //     let payload = { device_type: ev.device_type, customer: this.data.customer_id, inventory: this.data.id, id: this.data.id };
    // }

    onCloseModal() {
        this.modalRef.close();
    }
}
