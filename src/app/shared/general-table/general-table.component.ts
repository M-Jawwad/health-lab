import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { PermissionService } from 'src/app/services/check-permissions.service';
import { ApiService } from 'src/app/services/api.service';
import { ApiResponse } from 'src/app/interfaces/response';

import { TableAction, TableColumn, TableConfig, TableRowAction } from './model';
import { DownloadFileComponent } from '../download-file/download-file.component';
import { SortEvent } from '../directives/models';
import { SortableTableHeader } from '../directives/table-sort';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FORMATS } from './formats';


@Component({
    selector: 'general-table',
    templateUrl: './general-table.component.html',
    styleUrls: ['./general-table.component.scss']
})
export class GeneralTableComponent implements OnInit, OnDestroy {

    @ViewChildren(SortableTableHeader) headers!: QueryList<SortableTableHeader>;

    @Input() config: TableConfig;
    @Input() dataSource: any[];
    @Input() actions: Subject<TableAction>;

    @Output() signals = new EventEmitter<any>();

    loading: boolean;
    readonly: boolean;
    directDownload: boolean;

    count: number;
    limit: number;
    offset: number;

    search: any;
    sorting: any;
    sorting2: any;
    data: any[];

    slug: string;

    private _unsubscribeAll: Subject<any>;

    constructor(
        private checkPermService: PermissionService,
        private apiService: ApiService,
        private toastrService: ToastrService,
        private modal: NgbModal
    ) {
        this.actions = new Subject<TableAction>();
        this._unsubscribeAll = new Subject();
        this.config = new TableConfig(null);
        this.loading = false;
        this.readonly = false;
        this.directDownload = true;

        this.count = 0;
        this.limit = 10;
        this.offset = 0;

        this.slug = '';

        this.search = { search_with: '', search_text: '' };
        this.sorting = { column: '', direction: '' };
        this.sorting2 = { column: '', direction: '' };

        this.dataSource = [];
        this.data = [];
    }

    ngOnInit(): void {
        this.slug = `${this.config.slug}`;
        let limit = localStorage.getItem('limit');
        if (limit) {
            this.limit = +limit;
        }

        this.count = this.dataSource.length;
        this.checkPermission();
        if (this.config.doApiCall) {
            this.doApiCall();
        }

        if (!!this.actions) {
            this.actions.pipe(takeUntil(this._unsubscribeAll)).subscribe((e: TableAction) => {
                this.handleTableAction(e);
            });
        }
    }

    handleTableAction(e: TableAction) {
        switch (e.action) {
            case 'reload':
                if (this.config.doApiCall) {
                    this.doApiCall();
                }
                break;
            case 'loadingTrue':
                this.loading = true;
                break;
            case 'loadingFalse':
                this.loading = false;
                break;
        }
    }

    checkPermission() {
        let perm = this.checkPermService.checkPermissions();
        this.readonly = perm && perm.length > 0 && perm.includes('RW') ? false : true;
    }

    doApiCall(ev?: any) {
        this.loading = true;
        this.directDownload = false;
        this.slug = !!ev ? `${this.config.slug}search_with=${ev.search_with}&search_text=${ev.search_text}&order_by=${ev.column}&order=${ev.direction}&offset=${this.offset}&limit=${this.limit}` :
            `${this.config.slug}offset=${this.offset}&limit=${this.limit}`;

        this.apiService.get(this.slug).subscribe((resp: ApiResponse) => {
            this.loading = false;
            let data = resp.data
            this.data = resp.data['data'] || resp.data;
            this.dataSource = data['data'] || data;
            this.count = data['count'] || data.length;
            this.signals.emit({ type: 'onData', data: data });
            
            if (this.sorting2.column && this.sorting2.direction) {
                let dt = this.dataSource;
                if (this.sorting2.direction === 'asc') {
                    this.dataSource = dt.sort((a, b) => a[this.sorting2.column] - b[this.sorting2.column] )
                } else if (this.sorting2.direction === 'desc') {
                    this.dataSource = dt.sort((a, b) => b[this.sorting2.column] - a[this.sorting2.column] )
                }
            }

            if (!!ev && ev.search_with !== 'all_columns' && !!ev.search_text && this.dataSource.length > 0) {
                this.config.showSearchFilters = true;
            } else {
                this.config.showSearchFilters = false;
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
                this.toastrService.error(err.error['message'], 'Error getting data', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }
        });
    }

    onRowAction(action: TableRowAction, row?: any) {
        const ac = { type: action.action, row: row };
        this.signals.emit(ac);
    }

    onCellClick(row: any, column: any): void {
        const ac = { type: column.action, row: row };
        this.signals.emit(ac);
    }

    onAddNew(): void {
        const d = { type: 'OpenForm' };
        this.signals.emit(d);
    }

    onOptionalBtn(): void {
        this.signals.emit({ type: 'onOptionalBtn' });
    }

    onDownload(): void {
        const options: NgbModalOptions = { size: 'md' };
        const modalRef = this.modal.open(DownloadFileComponent, options);

        modalRef.componentInstance.slug = this.slug;
        modalRef.componentInstance.directDownload = this.directDownload;
        modalRef.componentInstance.fileName = this.config.title + ' List';
    }

    onSort({ column, direction }: SortEvent, col?: TableColumn): void {
        // resetting other headers
        this.headers.forEach(header => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });
        const dt = this.dataSource;
        if (col?.sortableFromView) {
            this.sorting2 = { column: column, direction: direction };
            if (direction === 'asc') {
                this.dataSource = dt.sort((a, b) => a[col.name] - b[col.name] )
            } else if (direction === 'desc') {
                this.dataSource = dt.sort((a, b) => b[col.name] - a[col.name] )
            } else {
                this.sorting = { search_with: this.search.search_with, search_text: this.search.search_text, column: '', direction: '' };
                this.doApiCall(this.sorting);
            }
        } else {
            this.sorting = { search_with: this.search.search_with, search_text: this.search.search_text, column: column, direction: direction };
            this.doApiCall(this.sorting);
        }
    }

    onSearch(ev: any): void {
        this.search = { search_with: ev.column, search_text: ev.search, column: this.sorting.column, direction: this.sorting.direction };
        this.doApiCall(this.search);
    }

    onPageChange(event: any): void {
        this.offset = event.offset;
        this.limit = event.pageSize;
        let ev = { search_with: this.search.search_with, search_text: this.search.search_text, column: this.sorting.column, direction: this.sorting.direction }
        this.doApiCall(ev);
    }

    cellValue(col: TableColumn, row: any) {
        if (!col.format) {
            return row[col.name];
        } else {
            // return FORMATS['date'](row[col.name], row, col);
            return FORMATS[col.format](row[col.name], row, col);
        }
    }

    ngOnDestroy(): void {
        if (this._unsubscribeAll != null) {
            this._unsubscribeAll.next(null);
            this._unsubscribeAll.complete();
        }
    }

}
