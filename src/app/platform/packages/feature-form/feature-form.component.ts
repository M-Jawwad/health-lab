import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-feature-form',
    templateUrl: './feature-form.component.html',
    styleUrls: ['./feature-form.component.scss']
})
export class FeatureFormComponent implements OnInit {
    title: string;
    loading: boolean;
    data: any;
    featureForm: FormGroup;
    moduleId: number;
    usecaseId: number;

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.title = 'Add Feature';
        this.loading = false;

        this.featureForm = new FormGroup({
            feature_id: new FormControl(null, [Validators.required, CustomValidators.noWhiteSpace]),
            feature_name: new FormControl(null, [Validators.required, CustomValidators.noWhiteSpace]),
        });
        this.data = null;
        this.moduleId = 0;
        this.usecaseId = 0;
    }

    ngOnInit(): void {
        if (!!this.data) {
            this.featureForm.patchValue(this.data);
        }
    }
    
    onSubmit() {
        this.loading = true;
        let formData = this.featureForm.value;
        let payload = formData;
        let slug = `${environment.pkgms}/packages/`;

        payload.module = this.moduleId;
        payload.usecase = this.usecaseId;

        if (this.data && this.data.id) {
            payload.id = this.data.id;
            this.updateFeature(slug, payload);
        } else {
            this.createFeature(slug, payload);
        }
    }

    createFeature(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error creating Feature', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    updateFeature(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error updating Feature', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    onCloseModel() {
        this.modalRef.close();
    }

}
