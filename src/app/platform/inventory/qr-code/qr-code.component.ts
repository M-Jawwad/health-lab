import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import * as kjua from 'kjua-svg';
import { ApiResponse } from 'src/app/interfaces/response';
import { ApiService } from 'src/app/services/api.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import { QRCodeTableConfig } from './config';
import jsPDF from 'jspdf';
import { SortEvent } from 'src/app/shared/directives/models';
import { SortableTableHeader } from 'src/app/shared/directives/table-sort';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {

    @ViewChildren(SortableTableHeader) headers!: QueryList<SortableTableHeader>;

    loading: boolean;
    showFilters: boolean;
    allSelected: boolean;
    actions: Subject<any>;
    config: TableConfig;

    cols: any[];
    devices: any[];
    selectedDevices: any[];

    search: any;
    sorting: any;

    count = 0;
    offset = 0;
    limit = 10;
    columnsPerPage = 4;
    rowsPerPage = 8;
    pageWidth = 210;
    pageHeight = 297;
    // Avery 3490
    cellWidth = 36;
    cellHeight = 36;
    borderTopBottom = ((this.pageHeight - (this.rowsPerPage * this.cellHeight)) / 2);

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService
    ) {
        this.loading = false;
        this.showFilters = false;
        this.allSelected = false;
        this.actions = new Subject();
        this.config = new TableConfig(QRCodeTableConfig.config);

        this.cols = [
            { column: 'device_id', title: 'Device ID' },
            { column: 'device_type_name', title: 'Device Type' },
            { column: 'created_at', title: 'Created Date' },
        ];

        this.devices = [];
        this.selectedDevices = [];

        this.search = { search_with: '', search_text: '' };
        this.sorting = { column: '', direction: '' };
    }

    static getBarcodeData(text: string, size = 900) {
        return kjua({
            render: "canvas", crisp: true,
            minVersion: 1, ecLevel: "Q",
            size: size, ratio: undefined,
            fill: "#333", back: "#fff",
            text, rounded: 10, quiet: 2,
            mode: "label", mSize: 5, mPosX: 50, mPosY: 100, // label: text,
            fontname: "sans-serif", fontcolor: "#3F51B5",
            image: undefined
        });
    }

    ngOnInit(): void {
        const limit = localStorage.getItem('limit');
        if (limit) {
            this.limit = +limit;
        }
        this.getInventoryDevices();
    }

    getInventoryDevices(ev?: any) {
        this.loading = true;
        // const slug = `${environment.inventoryms}/inventory/?package=all`;
        const slug = !!ev ? `${environment.inventoryms}/inventory/?package=all&search_with=${ev.search_with}&search_text=${ev.search_text}&order_by=${ev.column}&order=${ev.direction}&offset=${this.offset}&limit=${this.limit}` : 
        `${environment.inventoryms}/inventory/?package=all&offset=${this.offset}&limit=${this.limit}`;
        this.apiService.get(slug).subscribe((resp: ApiResponse) => {
            this.loading = false;
            this.allSelected = false;
            this.selectedDevices = [];
            this.devices = resp.data['data'];
            this.count = resp.data['count'];

            this.devices.forEach(element => {
                element.selected = false;
            });

            if (!!ev && ev.search_with !== 'all_columns' && !!ev.search_text && this.devices.length > 0) {
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
                this.toastrService.error(err.error['message'], 'Error getting devices', {
                    progressBar: true, progressAnimation: 'decreasing', timeOut: 3000
                });
            }
        });
    }

    onMasterToggle() {
        this.devices.forEach(device => {
            if (!this.allSelected) {
                device.selected = false;
                this.selectedDevices = [];
            } else {
                device.selected = true;
                this.selectedDevices.push(device.device_id);
            }
        });
    }

    onSelectDevice(device: any) {
        if (device.selected) {
            this.selectedDevices.push(device.device_id);
        } else {
            let indx = this.selectedDevices.findIndex(ele => {
                return device.device_id === ele;
            });
            this.selectedDevices.splice(indx, 1);
        }
    }

    onGenerateQRCode(index = 0, doc = new jsPDF(), colPos = 0, rowPos = 0) {
        let length_of_array = this.selectedDevices.length

        let code = QrCodeComponent.getBarcodeData(this.selectedDevices[index]);

        const x = ((this.pageWidth / this.columnsPerPage) / 2) - (this.cellWidth / 2) + (colPos * (this.pageWidth / this.columnsPerPage));
        const y = this.borderTopBottom + (rowPos * this.cellHeight) + 1;

        doc.addImage(code, "JPG", x, y, this.cellWidth - 2, this.cellHeight - 2);
        colPos++;
        if (colPos >= this.columnsPerPage) {
            colPos = 0;
            rowPos++;
        }
        if (rowPos >= this.rowsPerPage && index) {
            rowPos = 0;
            colPos = 0;
            doc.addPage();
        }

        if (index > length_of_array - 2) {
            doc.save(`QR-Codes.pdf`);
        } else {
            requestAnimationFrame(() => this.onGenerateQRCode(index + 1, doc, colPos, rowPos));
        }
    }

    onSearch(ev: any) {
        this.search = { search_with: ev.column, search_text: ev.search, column: this.sorting.column, direction: this.sorting.direction };
        this.getInventoryDevices(this.search);
    }

    onSort({column, direction}: SortEvent) {
        // resetting other headers
        this.headers.forEach(header => {
            if (header.sortable !== column) {
                header.direction = '';
            }
        });
        this.sorting = { search_with: this.search.search_with, search_text: this.search.search_text, column: column, direction: direction };
        this.getInventoryDevices(this.sorting);
    }

    onPageChange(event: any) {
        this.offset = event.offset;
        this.limit = event.pageSize;
        let ev = { search_with: this.search.search_with, search_text: this.search.search_text, column: this.sorting.column, direction: this.sorting.direction }
        this.getInventoryDevices(ev);
    }

}
