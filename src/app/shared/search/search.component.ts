import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    @Input() title: string;
    @Input() cols: any[] = [];
    @Input() showFilters: boolean = false;
    @Output() signal: EventEmitter<any>;

    searchControl: FormControl;
    expandSearch: boolean;
    expandSearchedCols: boolean;
    colHasValue: boolean;
    data: any[];
    searchColumns: any[];
    columns: any[] = [];

    placeholder: string;

    colLength: number;

    constructor() {
        this.title = 'Title';
        this.signal = new EventEmitter<any>();
        this.expandSearch = false;
        this.expandSearchedCols = true;
        this.colHasValue = true;
        this.data = [];
        this.searchColumns = [];

        this.searchControl = new FormControl('');
        this.placeholder = 'Search here...';

        this.colLength = 0;
    }

    ngOnInit(): void {
        for (let i = 0; i < this.cols.length; i++) {
            this.data.push({ id: i + 1, column: this.cols[i].column, title: this.cols[i].title, checked: false });
        }
    }

    toggleSearchColumns() {
        this.expandSearch = !this.expandSearch;
    }

    onSearch(value: any, idx?: number) {
        setTimeout(() => {
            if (this.data.length > 0) {
                this.data.forEach((element, idx) => {
                    if (element.checked) {
                        if (!this.columns.includes(element.column)) {
                            this.columns.push(element.column);
                        }
                    } else {
                        let id = this.columns.findIndex(ele => {
                            return ele === element.column;
                        });
                        if (id !== -1) { this.columns.splice(id, 1); }
                    }
                });

                if (this.columns.length > 0) {
                    this.signal.emit({ column: this.columns, search: value });
                } else {
                    this.signal.emit({ column: 'all_columns', search: value });
                }
            }
        }, 100);
    }

    onSelectColumn(col: any, idx: number) {
        if (col && col.checked) {
            this.columns.push({ id: col.id, column: col.column, title: col.title, value: '', checked: true });
        } else {
            let index = this.columns.findIndex(ele => {
                return ele.id === col.id
            })
            // console.log(col, idx, index, this.columns)
            this.columns.splice(index, 1);
        }
        this.colLength = this.columns.length;

        if (this.columns.length > 0) {
            this.placeholder = `Search: ${this.columns[this.columns.length - 1].title}`
        } else {
            this.placeholder = 'Search here';
        }
    }

    onRemoveColumn(col: any, idx: number) {
        col.checked = false;
        this.data.forEach(ele => {
            if (ele.id === col.id) {
                ele.checked = false;
            }
        });
        this.onSelectColumn(col, idx);
    }

    onSearch2(value: any, idx?: number) {
        setTimeout(() => {
            if (this.columns.length > 0) {
                this.columns[this.columns.length - 1].value = value;
            }

            let cols: string[] = [];
            let vals: string[] = [];
            this.columns.forEach(element => {
                if (!!element.value && element.value !== '') {
                    cols.push(element.column);
                    vals.push(element.value);
                }
                this.colHasValue = !!element.value && element.value !== '' ? true : false;
            });

            if (this.columns.length > 0) {
                this.signal.emit({ column: cols, search: vals });
            } else {
                this.signal.emit({ column: 'all_columns', search: value });
            }
        }, 100);
    }

    @HostListener("document:click", ["$event.target"])
    onClick(element: Element): void {
        if (!element.closest(".dv")) this.expandSearch = false;
    }
}
