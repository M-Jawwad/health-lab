import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from 'src/app/services/api.service';
import { PermissionService } from 'src/app/services/check-permissions.service';
import { Usecase } from 'src/app/interfaces/package-model';
import { ApiResponse } from 'src/app/interfaces/response';
import { SortableTableHeader } from 'src/app/shared/directives/table-sort';
import { SortEvent } from 'src/app/shared/directives/models';

import { UsecaseFormComponent } from '../use-case-form/use-case-form.component';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-usecase-list',
    templateUrl: './usecase-list.component.html',
    styleUrls: ['./usecase-list.component.scss']
})
export class UsecaseListComponent implements OnInit {

    @ViewChildren(SortableTableHeader) headers!: QueryList<SortableTableHeader>;

    loading: boolean;
    readonly: boolean;
    showFilters: boolean;
    cols: any[];
    slug: string;

    usecases: any[];
    count: number;
    search: any;
    sorting: any;
    limit: number;
    offset: number;

    constructor(
        private checkPermService: PermissionService,
        private apiService: ApiService,
        private toastrService: ToastrService,
        private modal: NgbModal
    ) {
        this.loading = false;
        this.readonly = false;
        this.showFilters = false;
        this.cols = [
            {column: 'usecase_name', title: 'Usecase Name'},
            {column: 'packages', title: 'Packages'}
        ];
        this.count = 0;
        this.limit = 10;
        this.offset = 0;
        this.search = { search_with: '', search_text: '' };
        this.sorting = { column: '', direction: '' };
        this.slug = '';

        this.usecases = [];

        this.count = this.usecases.length;
    }

    ngOnInit(): void {
        let limit = localStorage.getItem('limit');
        if (limit) {
            this.limit = +limit;
        }

        this.checkPermission();
        this.getUsecases();
    }

    getUsecases(ev?: any) {
        this.loading = true;
        this.slug = !!ev ? `${environment.pkgms}/usecase-configuration/?search_with=${ev.search_with}&search_text=${ev.search_text}&order_by=${ev.column}&order=${ev.direction}&offset=${this.offset}&limit=${this.limit}` : 
            `${environment.pkgms}/usecase-configuration/?offset=${this.offset}&limit=${this.limit}`;
        // this.slug = `${environment.pkgms}/usecase-configuration/`;
        this.apiService.get(this.slug).subscribe((resp: any) => {
            this.loading = false;
            let data = resp.data;
            this.usecases = data['data'];
            this.count = data['count'];

            if (!!ev && ev.search_with !== 'all_columns' && !!ev.search_text && this.usecases.length > 0) {
                this.showFilters = true;
            } else {
                this.showFilters = false;
            }
        }, (err: any) => {
            this.loading = false;
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error getting packages', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }
        });
    }

    checkPermission() {
        let perm = this.checkPermService.checkPermissions();
        this.readonly = perm && perm.length > 0 && perm.includes('RW') ? false : true;
    }

    onAddNew(ev?: Usecase) {
        const modalRef = this.modal.open(UsecaseFormComponent, { size: 'md-md', scrollable: true });

        if (!!ev) {
            modalRef.componentInstance.data = ev;
            modalRef.componentInstance.title = 'Edit Usecase';
            // modalRef.componentInstance.doNotUpdate = true;
        }

        modalRef.dismissed.subscribe(() => {
            console.log('closed');
            this.getUsecases();
        });
    }

    onDelete(ev: Usecase) {
        const slug = `${environment.pkgms}/usecase-configuration/?id=${ev.id}`;
        
        AlertService.warn('Are you sure?', 'You want to delete this usecase?', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.loading = true;
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.getUsecases();
                    this.toastrService.success(resp.message, 'Usecase successfully deleted', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                }, (err: any) => {
                    this.loading = false;
                    this.toastrService.error(err.error['message'], 'Error deleting usecase', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        });
    }

    onSort({column, direction}: SortEvent) {
        // resetting other headers
        this.headers.forEach(header => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });
        if (direction === 'asc' || direction === 'desc') {
            this.sorting = { search_with: this.search.search_with, search_text: this.search.search_text, column: column, direction: direction };
            this.getUsecases(this.sorting);
        } else {
            this.getUsecases();
        }
    }

    onSearch(ev: any)
    {
        this.search = { search_with: ev.column, search_text: ev.search, column: this.sorting.column, direction: this.sorting.direction };
        this.getUsecases(this.search);
    }

    onPageChange(event: any) {
        this.offset = event.offset;
        this.limit = event.pageSize;
        let ev = { search_with: this.search.search_with, search_text: this.search.search_text, column: this.sorting.column, direction: this.sorting.direction }
        this.getUsecases(ev);
    }

}
