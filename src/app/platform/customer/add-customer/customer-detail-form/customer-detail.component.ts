import { Component, Input, OnInit, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { CustomValidators } from 'src/app/utils/custom-validators';
import { Helpers } from 'src/app/utils/helpers';
import { ImageViewerComponent } from 'src/app/shared/image-viewer/image-viewer.component';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-customer-detail',
    templateUrl: './customer-detail.component.html',
    styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailFormComponent implements OnInit {
    title: string;
    loading: boolean;
    @Input() readonly: boolean;
    @Input() showGeneralDetails: boolean;
    @Input() showUploadDocs: boolean;

    @Input() customerId: number;

    @Output() signals: EventEmitter<any>;
    @Input() data: any;

    generalForm: FormGroup;
    uploadDocsForm: FormGroup;

    selectedDocs: any[];
    selectedImage: any;
    imageError: string;
    imageLoading: boolean;
    docType: any = null;

    industries: any[];
    submitted: boolean;

    constructor(
        private modalRef: NgbModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
    ) {
        this.title = 'Add Feature';
        this.loading = false;
        this.readonly = false;
        this.showGeneralDetails = true;
        this.showUploadDocs = false;
        this.customerId = 0;
        this.submitted = false;

        this.signals = new EventEmitter();

        this.generalForm = new FormGroup({
            id: new FormControl(null),
            company_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            group_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            country_code: new FormControl('+974'),
            phone_number: new FormControl(null, [Validators.required, Validators.minLength(8), CustomValidators.noWhiteSpace]),
            industry: new FormControl(null, [Validators.required]),
            website: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            email: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
            cr_number: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            first_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            last_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            spoc_phone_number: new FormControl(null, [Validators.required, Validators.minLength(8), CustomValidators.noWhiteSpace]),
            qid_passport: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            spoc_email: new FormControl(null, [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
        });

        this.uploadDocsForm = new FormGroup({
            id: new FormControl(null),
            document_name: new FormControl(null, [Validators.required, Validators.maxLength(60), CustomValidators.noWhiteSpace]),
            document_type: new FormControl(null, [Validators.required]),
            description: new FormControl(null),
            document_file: new FormControl(null),
            doc_to_show: new FormControl(null),
        });
        this.data = null;

        this.selectedDocs = [];
        this.selectedImage = null;
        this.imageError = '';
        this.imageLoading = false;

        this.industries = [
            { id: 1, name: "Aerospace" },
            { id: 2, name: "Transport" },
            { id: 3, name: "Telecommunication" },
            { id: 4, name: "Agriculture" },
            { id: 5, name: "Construction" },
            { id: 6, name: "Pharmaceutical" },
            { id: 7, name: "Food" },
            { id: 8, name: "Entertainment" },
            { id: 9, name: "Manufacturing" },
            { id: 10, name: "Electronics " }
        ];
    }

    ngOnInit(): void {
        if (this.showGeneralDetails && this.customerId) {
            this.getGeneralDetails();
        }

        if (this.showUploadDocs) {
            this.getDocuments();
        }

        this.uploadDocsForm.get('document_type')?.valueChanges.pipe().subscribe(value => {
            if (!!value && value === 'others') {
                this.docType = value;
            } else { this.docType = null; }
        })
    }

    // Genral Details
    getGeneralDetails() {
        this.signals.emit({ loading: true });
        const slug = `${environment.customerms}/customers/?customer=${this.customerId}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.data = resp.data['data'][0];
            const gdPH = resp.data['data'][0].phone_number;
            if (gdPH.includes('+974')) {
                this.data.phone_number = gdPH.replace('+974', '');
            }
            this.generalForm.patchValue(this.data);

            let spocData = this.data.customer_spoc_details[0];
            const spPH = spocData.spoc_phone_number;
            if (spPH.includes('+974')) {
                spocData.spoc_phone_number = gdPH.replace('+974', '');
            }
            this.generalForm.patchValue(spocData);
            this.signals.emit({ loading: false });

        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error getting general details', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    onSubmit() {
        this.signals.emit({ loading: true });
        const slug = `${environment.customerms}/customers/`;
        const formData = this.generalForm.value;
        const gdPH: string = formData.phone_number.toString();

        if (!gdPH.includes('+974')) {
            formData.phone_number = formData.country_code + formData.phone_number;
        }
        const sdPH: string = formData.spoc_phone_number.toString();
        if (!sdPH.includes('+974')) {
            formData.spoc_phone_number = formData.country_code + formData.spoc_phone_number;
        }
        delete formData.country_code;
        let payload = Helpers.removeWhiteSpaces(formData);

        if (this.data && this.data.id) {
            payload.id = this.data.id;
            this.updateGeneralDetails(slug, payload);
        } else {
            this.createGeneralDetails(slug, payload);
        }
    }

    createGeneralDetails(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.data = resp.data;
            this.signals.emit({ id: this.data.id, activeId: 'ud', loading: false });
            this.toastrService.success(resp.message, 'General details added successfully', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error creating general details', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    updateGeneralDetails(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.data = resp.data;
            this.signals.emit({ id: this.data.id, loading: false });
            this.getGeneralDetails();
            this.toastrService.success(resp.message, 'General details successfully updated', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error updating general details', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    // Upload Document
    getDocuments() {
        this.signals.emit({ loading: true });
        let slug = `${environment.customerms}/customers/customer-document?customer=${this.customerId}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.signals.emit({ loading: false });
            this.selectedDocs = resp.data['data'];
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error getting doucments', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
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

        let fileType = selectedFile.type;
        let fileSize = selectedFile.size / 1024;

        if (selectedFile && fileSize >= 5120) {
            this.imageError = 'File size is more than 5MB. Upload a valid file';
            return;
        } else {
            this.imageError = '';
        }
        selectedFile = event.target.files[0];
        this.uploadDocsForm.get('document_file')?.setValue(selectedFile);
        this.uploadDocsForm.get('document_name')?.markAsTouched();
        this.submitted = false;
        // console.log('image -== ', selectedFile);
        // this.readImageURL(event.target);
    }

    readImageURL(input: any) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = (e: any) => {
                this.selectedImage = e?.target['result']
                this.uploadDocsForm.get('doc_to_show')?.setValue(this.selectedImage);
            }
            this.imageLoading = false;
            reader.readAsDataURL(input.files[0]);
        }
    }

    uploadDoc() {
        console.log("this.uploadDocsForm.value;===", this.uploadDocsForm.value)
        if (this.uploadDocsForm.value['document_file'] == null) {
            this.submitted = true;
            return
        }
        this.signals.emit({ loading: true });
        let slug = `${environment.customerms}/customers/customer-document`;
        let formData = this.uploadDocsForm.value;
        formData.customer = this.customerId;
        delete formData.doc_to_show;
        // delete formData.id;
        let doc = formData.document_file;
        if (typeof (doc) === 'string' && doc.includes('https')) {
            delete formData.document_file;
        }

        let payload = this.convertToFormData(formData);
        // console.log("formData while document== ", formData)
        if (!!formData.id) {
            this.updateDocument(slug, payload);
        } else {
            this.uploadDocument(slug, payload);
        }
    }

    convertToFormData(formData: any) {
        let form_data = new FormData();
        for (let key in formData) {
            form_data.append(key, formData[key]);
        }
        return form_data;
    }

    uploadDocument(slug: string, payload: any) {
        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.uploadDocsForm.reset();
            this.data = resp.data;
            this.signals.emit({ loading: false, activeId: 'pkg' });
            this.getDocuments();
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error uploading document', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    updateDocument(slug: string, payload: any) {
        this.apiService.patch(slug, payload).subscribe((resp: ApiResponse) => {
            this.uploadDocsForm.reset();
            this.signals.emit({ loading: false });
            this.toastrService.success(resp.message, 'Document successfully updated', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            this.getDocuments();
        }, (err: any) => {
            this.signals.emit({ loading: false });
            this.toastrService.error(err.error['message'], 'Error updating document', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    onEditDoc(ev: any) {
        this.uploadDocsForm.patchValue(ev);
    }

    onViewDoc(ev: any) {
        console.log('ev ', ev);
        const dialogRef = this.modalRef.open(ImageViewerComponent, { size: 'md', scrollable: true });

        dialogRef.componentInstance.imgSource = ev.document_file;
    }

    onRemoveDoc(row: any) {
        let slug = `${environment.customerms}/customers/customer-document?document_id=${row.id}`;
        AlertService.warn('Are you sure?', 'You want to delete this document', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.signals.emit({ loading: true });
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.signals.emit({ loading: false });
                    this.toastrService.success(resp.message, 'Document successfully deleted', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.getDocuments();
                }, (err: any) => {
                    this.signals.emit({ loading: false });
                    this.toastrService.error(err.error['message'], 'Error deleting document', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        });
    }

    onCloseModel() {
        // this.modalRef.close();
        this.generalForm.reset();
    }

}
