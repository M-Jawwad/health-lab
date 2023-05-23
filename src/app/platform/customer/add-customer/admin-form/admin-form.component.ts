import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-admin-form',
    templateUrl: './admin-form.component.html',
    styleUrls: ['./admin-form.component.scss']
})
export class AdminFormComponent implements OnInit {
    loading: boolean;
    readonly: boolean;
    title: string;
    customerId: number;

    adminForm: FormGroup;

    data: any = null;

    constructor(
        private modalRef: NgbActiveModal,
        private fb: FormBuilder,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.loading = false;
        this.readonly = false;
        this.title = 'Add New Admin';
        this.customerId = 0;

        this.adminForm = this.fb.group({
            first_name: [null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]],
            last_name: [null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]],
            phone_number: [null, [Validators.required, Validators.minLength(8), CustomValidators.phoneOnly]],
            email: [null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            department: [null],
            designation: [null],
        })
    }

    ngOnInit(): void {
        // console.log("this.data=== ", this.data)
        if (this.data) {
            const ph = this.data.phone_number;
            if (ph.includes('+974')) {
                this.data.phone_number = ph.replace('+974', '');
            }
            this.adminForm.patchValue(this.data);
            // this.readonly = false;
        }
    }

    onSubmit() {
        const slug = `${environment.customerms}/customers/customer-admin`;
        let payload = this.adminForm.value;
        const ph = payload.phone_number;
        if (!ph.includes('+974')) {
            payload.phone_number = '+974' + payload.phone_number;
        }
        payload.customer = this.customerId;

        if (this.data && this.data.id) {
            payload.id = this.data.id;
            this.updateAdmin(slug, payload);
        } else {
            this.createAdmin(slug, payload);
        }
    }

    createAdmin(slug: string, paylaod: any) {
        this.apiService.post(slug, paylaod).subscribe((resp: ApiResponse) => {
            this.toastrService.success(resp.message, 'Admin created successfully', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
            this.modalRef.close();
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error creating admin', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    updateAdmin(slug: string, paylaod: any) {
        this.apiService.patch(slug, paylaod).subscribe((resp: ApiResponse) => {
            this.toastrService.success(resp.message, 'Admin updated successfully', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
            this.modalRef.close();
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error updating admin', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    validateEmailorPassword(email = '', phone = '') {
        const slug = `${environment.cobStagingUrl}/users/user-profile/validate`;
        let payload = { email: email == null ? '' : email, phone: phone == null ? '' : '974' + phone };

        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            if (email != '' && phone == null) {
                this.adminForm.get('email')?.setErrors(null);
            }
            if (email == null && phone != '') {
                this.adminForm.get('phone_number')?.setErrors(null);
            }
        }, (err: any) => {
            let status = err.error['status'];
            console.log('err', err, status);
            if (status == 101) {
                this.adminForm.get('email')?.setErrors({ 'emailexist': true });
            }

            if (status == 115) {
                this.adminForm.get('phone_number')?.setErrors({ 'phoneexist': true });
            }
        });
    }

    onCloseModal() {
        this.modalRef.close();
    }
}
