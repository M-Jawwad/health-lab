import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { SortEvent } from 'src/app/shared/directives/models';
import { SortableTableHeader } from 'src/app/shared/directives/table-sort';
import { DownloadFileComponent } from 'src/app/shared/download-file/download-file.component';
import { UserGroupFormComponent } from './user-group-form/user-group-form.component';
import { PermissionService } from 'src/app/services/check-permissions.service';
import { environment } from 'src/environments/environment';


interface User {
    id?: number;
    name: string;
    description: string;
    status?: string
    users: string;
}

@Component({
    selector: 'app-user-groups',
    templateUrl: './user-groups.component.html',
    styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {
    @ViewChildren(SortableTableHeader) headers!: QueryList<SortableTableHeader>;

    loading: boolean;
    groups: any[];
    permission: any[];
    count: number;
    offset: number;
    limit: number;
    cols: any[];

    showFilters: boolean = false;
    search: any = null;
    sorting: any = null;
    slug: string = '';
    readonly: boolean;

    constructor(
        private dialog: NgbModal,
        private apiService: ApiService,
        private toastrService: ToastrService,
        private router: Router,
        private checkPermService: PermissionService
    ) {
        this.loading = false;
        this.limit = 10;
        this.offset = 0;
        this.count = 0;
        this.cols = [
            {column: 'name', title: 'Name'},
            {column: 'description', title: 'Description'},
            {column: 'status', title: 'Status'}
        ];
        this.permission = [];
        this.groups = [];

        this.search = { search_with: '', search_text: '' };
        this.sorting = { column: '', direction: '' };
        this.readonly = false;
    }

    ngOnInit(): void {
        this.checkPermissions();
        this.getGroups();
    }

    checkPermissions() {
        let perm = this.checkPermService.checkPermissions();
        this.readonly = perm && perm.length > 0 && perm.includes('RW') ? false : true;
    }

    onSort({column, direction}: SortEvent) {
        // resetting other headers
        this.headers.forEach(header => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });

        this.sorting = { search_with: this.search.search_with, search_text: this.search.search_text, column: column, direction: direction };
        this.getGroups(this.sorting);
    }

    getGroups(ev?: any) {
        this.loading = true;
        this.slug = !!ev ? `${environment.userms}/group/?search_with=${ev.search_with}&search_text=${ev.search_text}&order_by=${ev.column}&order=${ev.direction}&offset=${this.offset}&limit=${this.limit}` : 
            `${environment.userms}/group/?offset=${this.offset}&limit=${this.limit}`;
        // const slug = ev ? `group/?search_with=${ev.column}&search_text=${ev.search}` : `group/`;
        this.apiService.get(this.slug).subscribe((resp: any) => {
            this.loading = false;
            this.groups = resp.data['data'];
            this.count = resp.data['count'];

            if (!!ev && ev.search_with != 'all_columns' && !!ev.search_text && this.groups.length > 0) {
                this.showFilters = true;
            } else {
                this.showFilters = false;
            }
        }, (err => {
            this.loading = false;
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error gettting groups', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }
        }));
    }

    onAddGroup(data?: any, action?: string) {
        const options: NgbModalOptions = { size: 'md', scrollable: true };
        const dialogRef = this.dialog.open(UserGroupFormComponent, options);


        if (!!data) {
            dialogRef.componentInstance.data = data;
        }

        if (!!action) {
            dialogRef.componentInstance.action = action;
        }

        dialogRef.closed.subscribe(() => {
            this.getGroups();
            this.checkPermissions();
        });
    }

    onDownload() {
        const options: NgbModalOptions = { size: 'md' };
        const dialogRef = this.dialog.open(DownloadFileComponent, options);

        dialogRef.componentInstance.slug = this.slug;
        dialogRef.componentInstance.fileName = 'Groups List';
    }

    onDeleteGroup(group: any) {
        const slug = `${environment.userms}/group/?id=${group.id}`;

        AlertService.confirm('Are you sure?', 'Associated users will be effected while deleting this group.', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.loading = true;
                this.apiService.delete(slug).subscribe((resp: any) =>
                {
                    this.toastrService.info(resp.message, 'Success', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.getGroups();
                }, (err: any) => {
                    this.loading = false;
                    this.toastrService.error(err.error['message'], 'Error', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                });
            } else {
                return;
            }
        });
    }

    onSearch(ev: any) {
        this.search = { search_with: ev.column, search_text: ev.search, column: this.sorting.column, direction: this.sorting.direction };
        this.getGroups(this.search);
    }

    onChangePage(event: any) {
        this.limit = event.pageSize;
        this.offset = event.offset;
        let ev = { search_with: this.search.search_with, search_text: this.search.search_text, column: this.sorting.column, direction: this.sorting.direction }
        this.getGroups(ev);
    }

}
