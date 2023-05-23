import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { PermissionService } from 'src/app/services/check-permissions.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import * as dateFns from 'date-fns';
import { Helpers } from 'src/app/utils/helpers';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-bulk-upload',
    templateUrl: './bulk-upload.component.html',
    styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {
    loading: boolean;
    readonly: boolean;
    showError: boolean;

    title: string;
    sampleLink: string;

    files: any[];

    data: any;
    bulkUploadedData: any;
    bulkUploadedData2: any;
    maxDate: any;

    continue_with_error: FormControl;

    constructor(
        private apiService: ApiService,
        private modalRef: NgbActiveModal,
        private toastrService: ToastrService,
        private fb: FormBuilder,
    ) {
        this.loading = false;
        this.readonly = false;
        this.showError = false;

        this.title = 'Bulk Upload';
        this.sampleLink = 'https://devdlsvfq.blob.core.windows.net/cob-new-media/device_type/cob-modified.xlsx';

        this.data = null;
        this.bulkUploadedData = null;
        this.bulkUploadedData2 = null;

        this.continue_with_error = new FormControl(false);

        this.files = [];
    }

    ngOnInit(): void {
    }

    onSelectDocs(ev: any) {
        this.files.push(...ev.addedFiles);
        if (this.files.length > 1) {
            this.toastrService.error('You can upload single file only', '', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        }

        this.files.forEach((element: any, idx: number) => {
            if (idx >= 1) {
                this.onRemoveDoc(idx);
            }
        });
        // console.log(this.files);
    }

    onRemoveDoc(ev: any) {
        this.files.splice(this.files.indexOf(ev), 1);
    }

    onBulkUpload() {
        this.loading = true;
        const slug = `${environment.inventoryms}/inventory/upload-inventory-file`;
        let formData = { continue_with_error: this.continue_with_error.value, inventory_file: this.files[0] };

        console.log(formData);
        let payload = this.convertToFormData(formData);

        this.apiService.post(slug, payload).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.bulkUploadedData = resp.data;
            this.bulkUploadedData2 = resp.data;
            let data = resp.data;

            let failed_insertion = this.bulkUploadedData.failed_insertion?.length;
            let failed_updation = this.bulkUploadedData.failed_updation?.length;
            let failed_deletion = this.bulkUploadedData.failed_deletion?.length;

            this.bulkUploadedData['totalSuccessfullRecords'] = this.bulkUploadedData.total_success_operations + failed_insertion + failed_updation + failed_deletion;
            this.bulkUploadedData['totalFailedRecords'] = failed_insertion + failed_updation + failed_deletion;

            if (data.file_recreation_payload && data.file_recreation_payload.length > 0) {
                this.showError = true;
            }
            this.toastrService.success(resp.message, 'Bulk upload completed successfully', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
            // this.modalRef.close();
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error uploading file', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    convertToFormData(formData: any) {
        let f = new FormData();
        let form_data = new FormData();
        for (var key in formData) {
            form_data.append(key, formData[key]);
        }
        return form_data;
    }

    downloadFailedXLS() {
        const slug = `${environment.inventoryms}/inventory/download-failed-inventory-file`;
        let payload = { file_recreation_payload: this.bulkUploadedData.file_recreation_payload };
        this.apiService.getExportXlsx(slug, payload).subscribe((resp: any) => {
            this.downloadCSV(resp);
        }, (err: any) => {
            this.toastrService.error(err.error['message'], 'Error uploading file', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
            });
        });
    }

    downloadCSV(resp: any) {
        const data = resp;
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob)

        let fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.download = 'Failed Records';
        fileLink.click();
    }

    onCloseModal() {
        this.modalRef.close();
    }
}
