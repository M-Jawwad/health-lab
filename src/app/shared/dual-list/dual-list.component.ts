import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface Group {
    id: number;
    name: string;
    selected: boolean
}


@Component({
    selector: 'app-dual-list',
    templateUrl: './dual-list.component.html',
    styleUrls: ['./dual-list.component.scss']
})
export class DualListComponent implements OnInit {

    @Input() source: Group[];
    @Input() destination: Group[];
    @Input() default: any[];
    @Input() disabled: boolean;
    @Output() signal: EventEmitter<any>;
    selected: any[];
    lastMove: any[];
    lastMove2: any[];
    @Input() defaultSource: any[];

    sourceSelected: boolean;
    destinationSelected: boolean;

    constructor() {
        this.sourceSelected = false;
        this.destinationSelected = false;
        this.disabled = false;

        this.source = [];
        this.destination = [];
        this.default = [];
        this.selected = [];
        this.lastMove = [];
        this.lastMove2 = [];
        this.defaultSource = [];
        this.signal = new EventEmitter();
    }

    ngOnInit(): void {
        // this.defaultSource = this.source;
        // this.setDefault();
    }

    setDefault()
    {
        if (this.default.length > 0)
        {
            this.destination = this.default;
        }

        if (this.destination.length > 0)
        {
            this.destination.forEach(element =>
            {
                element.selected = false;
                let idx = this.source.findIndex(ele =>
                {
                    return ele.id === element.id;
                });

                this.source.splice(idx, 1);
            });
        }

        setTimeout(() => {
            this.signal.emit(this.destination);
        }, 100);
    }

    reload()
    {
        this.signal.emit({type: 'reload'});
        // if (this.lastMove.length > 0)
        // {
        //     this.lastMove.forEach(element =>
        //     {
        //         let idx = this.destination.findIndex(ele => {
        //             return element.id === ele.id;
        //         });

        //         this.destination.splice(idx, 1);
        //         this.source.push(element);
        //     });
        // }
        // this.lastMove = [];

        // if (this.lastMove2.length > 0)
        // {
        //     this.lastMove2.forEach(element =>
        //     {
        //         let idx = this.source.findIndex(ele => {
        //             return element.id === ele.id;
        //         });

        //         this.source.splice(idx, 1);
        //         this.destination.push(element);
        //     });
        // }
        // this.lastMove2 = [];
    }

    onSelectSource(item: any, idx: number, id: number) {

        this.source[idx].selected = !this.source[idx].selected;
        // this.sourceSelected = this.source[idx].selected ? true : false;

        this.source.forEach(ele => {
            ele.selected ? this.sourceSelected = true : false;
        });

        if (this.source[idx].selected)
        {
            this.selected.push(this.source[idx]);
        }
        else
        {
            let i = this.selected.findIndex(ele => {
                return ele.id === item.id;
            });
            this.selected.splice(i, 1);
        }
    }

    onSelectDestination(item: any, idx: number, id: number) {
        this.destination[idx].selected = !this.destination[idx].selected;
        this.destinationSelected = this.destination[idx].selected ? true : false;

        if (this.destination[idx].selected)
        {
            this.selected.push(this.destination[idx]);
        }
        else
        {
            let i = this.selected.findIndex(ele => {
                return ele.id === item.id;
            });
            this.selected.splice(i, 1);
        }
    }

    addSelected()
    {
        this.selected.forEach(element => {
            this.destination.push(element);
            this.lastMove.push(element);

            element.selected = false;
            this.sourceSelected = false;

            let idx = this.source.findIndex(ele =>
            {
                return element.id === ele.id;
            });

            if (idx !== -1) {
                this.source.splice(idx, 1);
            }
        });
        this.selected = [];

        this.signal.emit(this.destination);
    }

    addAll()
    {
        this.source.forEach(element =>
        {
            this.destination.push(element);
            this.lastMove.push(element);
        });
        this.source = [];
        this.signal.emit(this.destination);
    }

    removeSelected()
    {
        this.selected.forEach(element => {
            this.source.push(element);
            this.lastMove2.push(element);

            element.selected = false;
            this.destinationSelected = false;

            let idx = this.destination.findIndex(ele =>
            {
                return element.id === ele.id;
            });

            if (idx !== -1) {
                this.destination.splice(idx, 1);
            }
        });
        this.selected = [];
        this.signal.emit(this.destination);
    }

    removeAll()
    {
        this.destination.forEach(element =>
        {
            this.source.push(element);
            this.lastMove2.push(element);
        });
        this.destination = [];
        this.signal.emit(this.destination);
    }

}
