import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { ApiService } from 'src/app/services/api.service';
import { PermissionService } from 'src/app/services/check-permissions.service';
import { Package } from 'src/app/interfaces/package-model';
import { PackageFormComponent } from '../package-form/package-form.component';
import { ApiResponse } from 'src/app/interfaces/response';
import { SortEvent } from 'src/app/shared/directives/models';
import { SortableTableHeader } from 'src/app/shared/directives/table-sort';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-package-list',
    templateUrl: './package-list.component.html',
    styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {

    @ViewChildren(SortableTableHeader) headers!: QueryList<SortableTableHeader>;

    loading: boolean;
    readonly: boolean;
    cols: any[];
    
    packages: Package[];
    count: number;

    showFilters: boolean;
    sorting: any = null;
    search: any = null;
    slug: string;
    offset: number;
    limit: number;
    
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
            {column: 'name', title: 'Name'},
            {column: 'description', title: 'Description'}
        ];
        this.count = 0;

        this.search = { search_with: '', search_text: '' };
        this.sorting = { column: '', direction: '' };
        this.slug = '';
        this.offset = 0;
        this.limit = 10;

        this.packages = [];

        this.count = this.packages.length;
    }

    ngOnInit(): void {
        let limit = localStorage.getItem('limit');
        if (limit) {
            this.limit = +limit;
        }
        this.checkPermission();
        this.getPackages();
    }

    getPackages(ev?: any) {
        this.loading = true;
        this.slug = !!ev ? `${environment.pkgms}/package-configuration/?search_with=${ev.search_with}&search_text=${ev.search_text}&order_by=${ev.column}&order=${ev.direction}&offset=${this.offset}&limit=${this.limit}` : 
            `${environment.pkgms}/package-configuration/?offset=${this.offset}&limit=${this.limit}`;
        this.apiService.get(this.slug).subscribe((resp: ApiResponse) => {
            this.loading = false;
            let data = resp.data['data'];
            this.packages = data;
            this.count = resp.data['count'];

            if (!!ev && ev.search_with !== 'all_columns' && !!ev.search_text && this.packages.length > 0) {
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

    onAddNew(ev?: Package) {
        const modalRef = this.modal.open(PackageFormComponent, { size: 'sm', scrollable: true });

        if (!!ev) {
            modalRef.componentInstance.data = ev;
            modalRef.componentInstance.title = 'Edit Package';
        }

        modalRef.closed.subscribe(() => {
            this.getPackages();
        });
    }

    onDelete(ev: any) {
        let slug = `cobnewpackages/package-configuration/?id=${ev.id}`;
        AlertService.confirm('Are you sure?', 'You want to delete this package?', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.loading = true;
                this.apiService.delete(slug).subscribe((resp: ApiResponse) => {
                    this.getPackages();
                }, (err: any) => {
                    this.loading = false;
                    this.toastrService.error(err.error['message'], 'Error deleting package', {
                        progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
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
            this.getPackages(this.sorting);
        } else {
            this.getPackages();
        }
    }

    onSearch(ev: any)
    {
        this.search = { search_with: ev.column, search_text: ev.search, column: this.sorting.column, direction: this.sorting.direction };
        this.getPackages(this.search);
    }

    onPageChange(event: any) {
        this.offset = event.offset;
        this.limit = event.pageSize;
        let ev = { search_with: this.search.search_with, search_text: this.search.search_text, column: this.sorting.column, direction: this.sorting.direction }
        this.getPackages(ev);
    }

}
