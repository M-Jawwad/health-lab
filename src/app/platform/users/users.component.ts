import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { VAlertAction } from 'src/app/shared/alert/alert.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { SortEvent } from 'src/app/shared/directives/models';
import { SortableTableHeader } from 'src/app/shared/directives/table-sort';
import { DownloadFileComponent } from 'src/app/shared/download-file/download-file.component';
import { UserFormComponent } from './user-form/user-form.component';
import { PermissionService } from 'src/app/services/check-permissions.service';
import { environment } from 'src/environments/environment';


interface User {
    id: number;
    first_name?: string;
    last_name?: string;
    department?: string;
    designation?: string;
    email?: string;
    phone_no?: number;
    user_picture: string;
    selected_groups: any[];
    unselected_groups?: any;
    status: any;
}


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

    @ViewChildren(SortableTableHeader) headers!: QueryList<SortableTableHeader>;

    users: User[];
    data: User[] = [];
    count: number;
    cols: any[] = ['name', 'email', 'status'];
    permission: string[] = [];
    offset: number;
    limit: number;
    loggedInUserId: number;

    loading: boolean;
    showFilters: boolean = false;
    sorting: any = null;
    search: any = null;
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
        this.loggedInUserId = 0;
        this.count = 0;
        this.offset = 0;
        this.limit = 10;
        this.data = [];

        this.users = [];
        this.search = { search_with: '', search_text: '' };
        this.sorting = { column: '', direction: '' };
        this.readonly = false;

        this.cols = [
            {column: 'name', title: 'Username'},
            {column: 'email', title: 'Email'},
            {column: 'status', title: 'Status'}
        ]
    }

    ngOnDestroy(): void {
        this.dialog.dismissAll();
    }

    ngOnInit(): void {
        let getUser: any = localStorage.getItem('user');
        
        if (!!getUser) {
            let user = JSON.parse(getUser);
            this.loggedInUserId = user.id;
        }
        this.getUsers();
        this.checkPermissions();
    }

    getUsers(ev?: any) {
        this.loading = true;
        this.slug = !!ev ? `${environment.userms}/users/?search_with=${ev.search_with}&search_text=${ev.search_text}&order_by=${ev.column}&order=${ev.direction}&offset=${this.offset}&limit=${this.limit}` : 
            `${environment.userms}/users/?offset=${this.offset}&limit=${this.limit}`;

        this.apiService.get(this.slug).subscribe((resp: any) =>
        {
            this.loading = false;
            this.users = resp.data['data'];
            this.count = resp.data['count'];

            if (!!ev && ev.search_with !== 'all_columns' && !!ev.search_text && this.users.length > 0) {
                this.showFilters = true;
            } else {
                this.showFilters = false;
            }
        }, (err: any) =>
        {
            this.loading = false;
            const status = err.error['status'];
            const statusCodes = [401, 2, 3, 11, 151, 153, 18, 300, 301];
            if (statusCodes.includes(status)) {
                this.toastrService.error(err.error['message'], 'Access Unauthorized', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            } else {
                this.toastrService.error(err.error['message'], 'Error', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
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
            this.getUsers(this.sorting);
        } else {
            this.getUsers();
        }
    }

    checkPermissions() {
        let perm = this.checkPermService.checkPermissions();
        this.readonly = perm && perm.length > 0 && perm.includes('RW') ? false : true;
    }

    onDownload() {
        const options: NgbModalOptions = { size: 'md' };
        const dialogRef = this.dialog.open(DownloadFileComponent, options);

        dialogRef.componentInstance.slug = this.slug;
        dialogRef.componentInstance.fileName = 'Users List';
    }

    onAddNew(ev?: any) {
        const options: NgbModalOptions = { size: 'lg', scrollable: true };
        const dialogRef = this.dialog.open(UserFormComponent, options);

        if (ev) {
            dialogRef.componentInstance.data = ev;
            dialogRef.componentInstance.title = 'Edit User';
        }

        dialogRef.closed.subscribe(() => {
            this.getUsers();
        });
    }

    showDetails(ev?: any) {
        const options: NgbModalOptions = { size: 'lg', scrollable: true };
        const dialogRef = this.dialog.open(UserFormComponent, options);

        if (ev) {
            dialogRef.componentInstance.data = ev;
            dialogRef.componentInstance.title = 'User Details';
            dialogRef.componentInstance.action = 'detail';
        }

        dialogRef.closed.subscribe(() => {
            this.getUsers();
        });
    }

    onResethPassword(user: any) {
        this.loading = true;
        const slug = `${environment.userms}/users/reset-password-link`;
        const payload = { id: user.id, link: `${environment.frontendUrl}/forgot-password` };

        this.apiService.post(slug, payload).subscribe((resp: any) => {
            this.loading = false;
            this.toastrService.info(`Reset password link sent to ${user.email}.`, 'Info', {
                progressBar: true, progressAnimation: 'decreasing', timeOut: 4000
            });
        }, (err: any) => {
            this.loading = false;
            this.toastrService.error(err.error['message'], 'Error', {
                progressAnimation: 'decreasing', progressBar: true, timeOut: 3000
            });
        });
    }

    onDeleteUser(user: any) {
        const slug = `${environment.userms}/users/?id=${user.id}`;

        AlertService.confirm('Are you sure?', 'You want to delete this user?', 'Yes').subscribe((resp: VAlertAction) => {
            if (resp.positive) {
                this.loading = true;
                this.apiService.delete(slug).subscribe((resp: any) =>
                {
                    this.toastrService.info(resp.message, 'Success', {
                        progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                    });
                    this.getUsers();
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

    onSearch(ev: any)
    {
        // console.log(ev);
        this.search = { search_with: ev.column, search_text: ev.search, column: this.sorting.column, direction: this.sorting.direction };
        if (ev.search != '') {
            this.getUsers(this.search);
        } else {
            this.getUsers();
        }
    }

    onPageChange(event: any) {
        this.offset = event.offset;
        this.limit = event.pageSize;
        let ev = { search_with: this.search.search_with, search_text: this.search.search_text, column: this.sorting.column, direction: this.sorting.direction }
        this.getUsers(ev);
    }

}
