import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-package-form',
    templateUrl: './package-form.component.html',
    styleUrls: ['./package-form.component.scss']
})
export class PackageFormComponent implements OnInit {
    title: string;
    loading: boolean;
    data: any;
    packageForm: FormGroup;

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.title = 'Add Package';
        this.loading = false;

        this.packageForm = new FormGroup({
            id: new FormControl(null),
            // package_unique_id: new FormControl(null),
            name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            description: new FormControl(null)
        });
        this.data = null;
    }

    ngOnInit(): void {
        if (!!this.data) {
            this.packageForm.patchValue(this.data);
        }
    }
    
    onSubmit() {
        this.loading = true;
        let formData = this.packageForm.value;
        let payload = formData;
        
        if (!!payload.id) {
            this.updatePackage(payload);
        } else {
            this.createPackage(payload);
        }
    }

    createPackage(payload: any) {
        let slug = `${environment.pkgms}/package-configuration/`;
        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error creating package', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    updatePackage(payload: any) {
        let slug = 'cobnewpackages/package-configuration/';
        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error updating package', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onCloseModel() {
        this.modalRef.close();
    }

}
