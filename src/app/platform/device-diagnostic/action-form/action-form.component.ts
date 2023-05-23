import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-action-form',
    templateUrl: './action-form.component.html',
    styleUrls: ['./action-form.component.scss']
})
export class ActionFormComponent implements OnInit {
    title: string;
    loading: boolean;
    showBody: boolean;
    data: any;
    body: FormControl;
    actionForm: FormGroup;
    paramsForm: FormGroup;
    headerForm: FormGroup;
    responseForm: FormGroup;

    apiMethods: any[];
    deviceTypes: any[];
    params: any[];
    headers: any[];
    response: any[];

    active: string;

    constructor(
        private modalRef: NgbActiveModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.title = 'Add Action';
        this.active  = 'params';
        this.loading = false;
        this.showBody = false;

        this.actionForm = new FormGroup({
            // id: new FormControl(null),
            command: new FormControl(null, [Validators.required, CustomValidators.noWhiteSpace]),
            action: new FormControl(null),
            status_check: new FormControl(false),
            // response: new FormControl(null),
            http_method: new FormControl('get'),
            device_sdk: new FormControl(null, [Validators.required, CustomValidators.noWhiteSpace]),
        });
        this.paramsForm = new FormGroup({
            id: new FormControl(null),
            key: new FormControl(null, [Validators.required]),
            value: new FormControl(null, [Validators.required]),
            description: new FormControl(null),
        });
        this.headerForm = new FormGroup({
            id: new FormControl(null),
            key: new FormControl(null, [Validators.required]),
            value: new FormControl(null, [Validators.required]),
            description: new FormControl(null),
        });
        this.responseForm = new FormGroup({
            id: new FormControl(null),
            key: new FormControl(null, [Validators.required]),
            value: new FormControl(null, [Validators.required]),
            description: new FormControl(null),
        });
        this.body = new FormControl(null);

        this.data = null;
        this.apiMethods = [
            { value: 'get', title: 'Get' },
            { value: 'post', title: 'Post' },
            // { value: 'patch', title: 'Patch' },
            // { value: 'put', title: 'Put' },
            // { value: 'delete', title: 'Delete' },
        ];
        this.deviceTypes = [];
        this.params = [];
        this.headers = [];
        this.response = [];
    }

    ngOnInit(): void {
        // this.getDeviceTypes();
        if (!!this.data) {
            this.actionForm.patchValue(this.data);
            for (const key in this.data.parameters) {
                if (!!this.data.parameters[key]) {
                    this.params.push({key: key, value: this.data.parameters[key]});
                }
            }

            for (const key in this.data.headers) {
                if (!!this.data.headers[key]) {
                    this.headers.push({key: key, value: this.data.headers[key]});
                }
            }

            if (this.data.response) {
                this.data.response.forEach((ele: any, idx: number) => {
                    this.response.push({ id: idx+1, key: ele.success_status, value: ele.response_to_map, description: ele.response_mapping });
                });
            }

            if (['post', 'Post'].includes(this.data.http_method)) {
                this.showBody = true;
                const reqBody = this.data.body ? JSON.stringify(this.data.body) : null;
                this.body.setValue(reqBody);
            }
        }

        this.actionForm.get('http_method')?.valueChanges.subscribe((value: any) => {
            if (!['post', 'Post'].includes(value)) {
                this.active = 'params';
                this.showBody = false;
            } else {
                this.showBody = true;
            }
        })
    }

    getDeviceTypes() {
        const slug = `${environment.inventoryms}/device-types/?`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.deviceTypes = resp.data['data'];
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error getting device types', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onSubmit() {
        this.loading = true;
        let formData: any = this.actionForm.value;
        let params: any = { };
        let headers: any = { };
        let respons: any[] = [];

        if (this.params.length > 0) {
            this.params.forEach(ele => {
                let k = ele.key;
                params[k] = ele.value
            });
            formData['parameters'] = params;
        }

        if (this.headers.length > 0) {
            this.headers.forEach(ele => {
                let k = ele.key;
                headers[k] = ele.value
            });
            formData['headers'] = headers;
        }

        if (this.response.length > 0) {
            this.response.forEach(ele => {
                respons.push({ success: ele.key, response_mapping: ele.description, response: ele.value });
            });

            formData['response'] = respons;
        }

        if (this.body.value) {
            const vl = this.body.value;
            const body = JSON.parse(vl);
            formData['body'] = body;
        }

        let slug = `${environment.da}/api/actions`;

        if (this.data && this.data.id) {
            formData['id'] = this.data.id;
            this.updateFeature(slug, formData);
        } else {
            this.createFeature(slug, formData);
        }
    }

    createFeature(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.modalRef.close();
            // this.loading = false;
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error creating Feature', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
            this.loading = false;
        });
    }

    updateFeature(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.toastrService.success(resp.message, 'Success', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.modalRef.close();
            // this.loading = false;
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

    onSubmitParamsForm() {
        const dt = this.paramsForm.value;
        const key = dt.key;
        let type = 'add';

        // let allowAdd = false;
        if (this.params.length > 0) {
            const ob = this.params.find(ele => { return ele.key === key });
            type = (!!ob && ob.key === key) ? 'edit' : 'add';
        }

        if (type === 'edit') {
            const idx = this.params.findIndex(ele => ele.key === key);
            if (idx != -1) {
                this.params.splice(idx, 1, dt);
            } else {
                dt.id = this.params.length + 1;
                this.params.push(dt);
            }
        } else {
            dt.id = this.params.length + 1;
            this.params.push(dt);
        }
        this.paramsForm.reset();
        // console.log(this.params);
    }

    onEditParam(param: any, idx: number) {
        this.paramsForm.patchValue(param);
    }

    onRemoveParam(idx: number) {
        this.params.splice(idx, 1);
    }

    onSubmitHeadersForm() {
        const dt = this.headerForm.value;
        const key = dt.key;
        let type = 'add';

        // let allowAdd = false;
        if (this.headers.length > 0) {
            const ob = this.headers.find(ele => { return ele.key === key });
            type = (!!ob && ob.key === key) ? 'edit' : 'add';
        }

        if (type === 'edit') {
            const idx = this.headers.findIndex(ele => ele.key === key);
            if (idx != -1) {
                this.headers.splice(idx, 1, dt);
            } else {
                dt.id = this.headers.length + 1;
                this.headers.push(dt);
            }
        } else {
            dt.id = this.headers.length + 1;
            this.headers.push(dt);
        }
        this.headerForm.reset();
        // console.log(this.headers);
    }

    onEditHeader(header: any, idx: number) {
        this.headerForm.patchValue(header);
    }

    onRemoveHeader(idx: number) {
        this.headers.splice(idx, 1);
    }

    onSubmitResponseForm() {
        const dt = this.responseForm.value;
        const type = !!dt.id ? 'edit' : 'add';
        const key = dt.key;

        // console.log(key, type, dt);

        let allowAdd = false;
        this.response.find(ele => { return allowAdd = ele.key === key });

        if (type === 'edit') {
            let idx = this.response.findIndex(ele => ele.id === dt.id);
            console.log(idx);
            if (idx != -1) {
                this.response.splice(idx, 1, dt);
            } else {
                dt.id = this.response.length + 1;
                this.response.push(dt);
            }
        } else {
            dt.id = this.response.length + 1;
            this.response.push(dt);
        }
        this.responseForm.reset();
    }

    onEditResponse(param: any, idx: number) {
        // console.log(param);
        this.responseForm.patchValue(param);
    }

    onRemoveResponse(idx: number) {
        this.response.splice(idx, 1);
    }
}