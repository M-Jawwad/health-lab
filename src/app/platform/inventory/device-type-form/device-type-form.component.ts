import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { Helpers } from 'src/app/utils/helpers';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-device-type-form',
    templateUrl: './device-type-form.component.html',
    styleUrls: ['./device-type-form.component.scss']
})
export class DeviceTypeFormComponent implements OnInit {
    loading: boolean;
    readonly: boolean;
    readonlyForPackages: boolean;
    imageLoading: boolean;
    fileUploaded: boolean;

    title: string;

    packages: any[];
    categories: any[];
    connectedSensors: any[];
    sensors: any[];
    selectedSensors: any[];
    parameters: any[];
    selectedParameters: any[];
    actions: any[];
    selectedActions: any[];

    selectedImage: any;
    device_data_sheet: any;
    data: any;
    deviceTypeForm: FormGroup;
    docType: string = '';
    imageError: string = '';

    constructor(
        private apiService: ApiService,
        private modalRef: NgbActiveModal,
        private toastrService: ToastrService,
        private fb: FormBuilder,
    ) {
        this.loading = false;
        this.readonly = false;
        this.readonlyForPackages = false;
        this.imageLoading = false;
        this.fileUploaded = false;

        this.title = 'Add Device Type';

        this.packages = [];
        this.categories = [{id: 1, name: 'Gateway'}, {id: 2, name: 'Tag'}, {id: 2, name: 'Reader'}];
        this.connectedSensors = [];
        this.sensors = [];
        this.selectedSensors = [];
        this.parameters = [];
        this.selectedParameters = [];
        this.actions = [];
        this.selectedActions = [];

        this.selectedImage = null;
        this.device_data_sheet = null;
        this.data = null;

        this.deviceTypeForm = this.fb.group({
            device_type_name: [null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]],
            package: [null, [Validators.required]],
            make: [null, [CustomValidators.noWhiteSpace]],
            warranty: [null],
            category: [null, [Validators.required]],
            default_trans_frequency: [1, [Validators.required]],
            default_offline_threshold: [1, [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.connectedSensors = []
        this.getPackages();

        if (!!this.data) {
            this.deviceTypeForm.patchValue(this.data);
            this.readonlyForPackages = true;
            this.connectedSensors = this.data.sensors;
            this.device_data_sheet = this.data.device_data_sheet;

            if (this.data.device_diagnostic && this.data.device_diagnostic.length > 0) {
                this.data.device_diagnostic.forEach((ele: any) => {
                    this.parameters.push(ele);
                });
            }

            if (this.data.actions && this.data.actions.length > 0) {
                this.data.actions.forEach((ele: any) => {
                    this.actions.push({ command: ele.action_key, action: ele.action_name, is_selected: ele.is_selected, id: ele.action_id, status_check: ele.status_check });
                });
            }
            
            this.fileUploaded = true;
            if (this.device_data_sheet.includes('pdf')) {
                this.docType = 'pdf';
            } else {
                this.docType = 'image';
            }
            this.selectedImage = this.device_data_sheet;

            this.onSelectSensor();
        } else {
            this.getAllSensors();
            this.getAllParameters();
            this.getAllActions();
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

    getAllSensors() {
        const slug = `${environment.inventoryms}/device-types/get-sensors`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.connectedSensors = resp.data['data'];
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting sensors', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    getAllParameters() {
        const slug = `${environment.ddms}/device-diagnostic/parameters`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            // console.log(this.parameters);
            let data = resp.data['data'];
            data.forEach((element: any) => {
                element.is_selected = false;
                this.parameters.push(element);
            });
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting parameters', {
                progressBar: true, progressAnimation: 'increasing', timeOut: 3000
            });
        });
    }

    getAllActions() {
        const slug = `${environment.da}/api/actions?offset=0&limit=1000`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            let data = resp.data['data'];
            this.actions = [];
            data.forEach((element: any) => {
                element.is_selected = false;
                this.actions.push(element);
            });
            // if (this.data && this.data.actions && this.data.actions.length > 0) {
            //     data.forEach((element: any) => {
            //         this.data.actions.forEach((ele: any) => {
            //             if (element.id === +ele.action_id) {
            //                 if (ele.is_selected) {
            //                     element.is_selected = true;
            //                     this.actions.push(element);
            //                 }
            //                 if (!ele.is_selected) {
            //                     element.is_selected = false;
            //                     this.actions.push(element);
            //                 }
            //             }
            //         });
            //     });
            // } else {
            // }
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting actions', {
                progressBar: true, progressAnimation: 'increasing', timeOut: 3000
            });
        });
    }

    chooseImage() {
        document.getElementById('fileInput')?.click();
    }

    onImageChanged(event: any) {
        this.imageLoading = true;
        this.fileUploaded = true;

        let selectedFile: File;
        selectedFile = event.target.files[0];
        
        let fileType = selectedFile.type;
        let fileSize = selectedFile.size / 1024;
        
        if (selectedFile && fileSize >= 5120) {
            this.imageError = 'File size is more than 5MB.';
            return;
        } else {
            this.imageError = '';
        }
        this.device_data_sheet = selectedFile;

        if (!!fileType && fileType === 'application/pdf') {
            this.docType = 'pdf';
        } else if (!!fileType && fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg') {
            this.docType = 'image';
        } else { this.docType = ''; }

        this.readImageURL(event.target);
    }

    readImageURL(input: any) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = (e: any) => {
                this.selectedImage = e?.target['result'];
            }
            this.imageLoading = false;
            reader.readAsDataURL(input.files[0]);
        }
    }

    onRemoveFile() {
        this.docType = '';
        this.fileUploaded = false;
        this.selectedImage = null;
        this.device_data_sheet = null;
    }

    onSelectSensor() {
        this.sensors = [];
        this.connectedSensors.forEach(element => {
            if (element.sensor_flag) {
                this.sensors.push(element.id);
            }
        });
    }

    onSelectParameter() {
        this.selectedParameters = [];
        this.parameters.forEach(element => {
            this.selectedParameters.push(element);
        });
        // console.log(this.selectedParameters, this.unselectedParameters);
    }

    onSelectaction() {
        this.selectedActions = [];
        this.actions.forEach(element => {
            this.selectedActions.push({ action_id: element.id, action_key: element.command, action_name: element.action, is_selected: element.is_selected, status_check: element.status_check });
        });

        // console.log(this.selectedParameters, this.unselectedParameters);
    }

    onSubmit() {
        this.loading = true;
        const slug = `${environment.inventoryms}/device-types/`;

        let formData = this.deviceTypeForm.value;
        let payload = Helpers.removeWhiteSpaces(formData);
        payload.device_data_sheet = this.device_data_sheet;
        payload.device_sensors = this.sensors;
        
        if (this.data && this.data.id) {
            payload.id = this.data.id;
        }

        if (typeof(this.device_data_sheet) === 'string' && this.device_data_sheet.includes('https')) {
            delete payload.device_data_sheet;
        }
        
        let d = this.convertToFormData(payload);
        // console.log(payload, d);
        // return;
        
        if (this.data && this.data.id) {
            this.updateDeviceType(slug, d);
        } else {
            this.createDeviceType(slug, d);
        }
    }

    convertToFormData(formData: any) {
        let f = new FormData();
        let form_data = new FormData();
        for (var key in formData) {
            form_data.append(key, formData[key]);
        }
        return form_data;
    }

    createDeviceType(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            // this.modalRef.close();
            this.toastrService.success(resp.message, 'Device type created successfully', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.createDiagnosticParams(resp.data);
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error creating device type', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    updateDeviceType(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            // this.modalRef.close();
            this.updateDiagnosticParams(resp.data);
            this.toastrService.success(resp.message, 'Device type updated successfully', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error updating device type', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    onCloseModal() {
        this.modalRef.close();
    }

    createDiagnosticParams(data: any) {
        this.loading = true;
        const slug = `${environment.inventoryms}/device-types/device-diagnostic-parameter`;
        let payload = { device_diagnostic_parameter: this.selectedParameters, device_type_id: data.device_type_id, device_diagnostic_action: this.selectedActions };

        this.apiService.post(slug, payload).subscribe((resp: any) => {
            this.loading = false;
            this.modalRef.close();
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error creating diagnostics parameters', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        });
    }

    updateDiagnosticParams(data: any) {
        this.loading = true;
        const slug = `${environment.inventoryms}/device-types/device-diagnostic-parameter`;
        let payload = { device_diagnostic_parameter: this.selectedParameters, device_type_id: this.data.id, device_diagnostic_action: this.selectedActions };

        this.apiService.patch(slug, payload).subscribe((resp: any) => {
            this.loading = false;
            this.modalRef.close();
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error creating diagnostics parameters', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.loading = false;
        });
    }
}
