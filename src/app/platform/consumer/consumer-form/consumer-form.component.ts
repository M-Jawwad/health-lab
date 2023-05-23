import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { ImageViewerComponent } from 'src/app/shared/image-viewer/image-viewer.component';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-consumer-form',
    templateUrl: './consumer-form.component.html',
    styleUrls: ['./consumer-form.component.scss']
})
export class ConsumerFormComponent implements OnInit {
    title: string;
    consumerForm: FormGroup;

    fromInventory: boolean = false;
    readonly: boolean;
    loading: boolean;
    imageLoading: boolean;

    consumerId: number;
    selectedImage: any;
    data: any;

    constructor(
        private modal: NgbModal,
        private modalRef: NgbActiveModal,
        private fb: FormBuilder,
        private apiService: ApiService,
        private toastrService: ToastrService
    ) {
        this.title = 'Add Consumer';
        this.imageLoading = false;
        this.loading = false;
        this.readonly = false;

        this.consumerId = 0;
        this.selectedImage = null;
        this.data = null;

        this.consumerForm = this.fb.group({
            id: [null],
            first_name: [null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]],
            last_name: [null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]],
            email: [null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            phone: [null, [Validators.required, Validators.minLength(8), CustomValidators.phoneOnly]],
            document_file: [null],
            document_name: [null],
            qid_passport: [null],
            // status: ['Active']
        });
    }

    ngOnInit(): void {
        if (this.data) {
            const ph = this.data.phone.toString();
            if (ph.includes('+974')) {
                this.data.phone = ph.replace('+974', '');
            }
            this.consumerForm.patchValue(this.data);
        }

        if (this.fromInventory) {
            this.getConsumer();
        }
    }

    getConsumer() {
        this.loading = true;
        const slug = `${environment.customerms}/consumer/?consumer=${this.consumerId}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.loading = false;
            let data = resp.data['data'][0];
            const ph = data.phone;
            data['phone'] = !!ph ? ph.replace('+974', '') : '';
            this.consumerForm.patchValue(data);
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error getting details of consumer', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    chooseImage() {
        document.getElementById('fileInput')?.click();
    }

    onImageChanged(event: any) {
        this.imageLoading = true;
        let selectedFile: File;
        selectedFile = event.target.files[0];
        this.consumerForm.get('document_file')?.setValue(selectedFile);
        // console.log('image -== ', selectedFile);
        this.readImageURL(event.target);
    }
    
    readImageURL(input: any) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = (e: any) => {
                this.selectedImage = e?.target['result']
            }
            this.imageLoading = false;
            reader.readAsDataURL(input.files[0]);
        }
    }

    onViewDoc() {
        const modalRef = this.modal.open(ImageViewerComponent, {size: 'md', scrollable: true});
        
        modalRef.componentInstance.imgSource = this.data?.document_file;
    }

    onSubmit() {
        this.loading = true;
        const slug = `${environment.customerms}/consumer/`;
        let formData = this.consumerForm.value;
        
        const ph: string = formData.phone.toString();
        if (!ph.includes('+974')) {
            formData.phone = '+974' + formData.phone;
        }

        let doc = formData.document_file;
        if (doc == null || (typeof(doc) === 'string' && doc.includes('https'))) {
            delete formData.document_file;
        }

        let payload = this.convertToFormData(formData);

        if (!!formData.id) {
            this.updateConsumer(slug, payload);
        } else {
            this.createConsumer(slug, payload);
        }
    }

    convertToFormData(formData: any) {
        let form_data = new FormData();
        for (let key in formData) {
            form_data.append(key, formData[key]);
        }
        return form_data;
    }

    createConsumer(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.toastrService.success(resp.message, 'Consumer successfully created', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error creating consumer', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    updateConsumer(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.toastrService.success(resp.message, 'Consumer successfully updated', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error updating consumer', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onCloseModal() {
        this.modalRef.close();
    }

}
