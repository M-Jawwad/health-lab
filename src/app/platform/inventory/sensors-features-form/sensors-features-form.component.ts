import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-sensors-features-form',
    templateUrl: './sensors-features-form.component.html',
    styleUrls: ['./sensors-features-form.component.scss']
})
export class SensorsFormComponent implements OnInit {
    title: string;
    loading: boolean;
    data: any;
    sensorForm: FormGroup;
    moduleId: number;
    usecaseId: number;

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.title = 'Add Sensor & Feature';
        this.loading = false;

        this.sensorForm = new FormGroup({
            id: new FormControl(null),
            sensor_id: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
        });
        this.data = null;
        this.moduleId = 0;
        this.usecaseId = 0;
    }

    ngOnInit(): void {
        if (!!this.data) {
            this.sensorForm.patchValue(this.data);
        }
    }
    
    onSubmit() {
        this.loading = true;
        let formData = this.sensorForm.value;
        let payload: any = { sensor_id: formData.sensor_id, name: formData.name };
        let slug = `${environment.inventoryms}/sensor-configuration/`;

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
