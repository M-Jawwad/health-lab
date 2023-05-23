import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
    selector: 'app-circle-progress',
    templateUrl: './circle-progress.component.html',
    styleUrls: ['./circle-progress.component.scss']
})
export class CircleProgressComponent implements OnInit {

    @Input() title: string;
    @Input() data: any;
    @Output() signal: EventEmitter<any>;

    constructor() {
        this.title = 'Title';
        this.signal = new EventEmitter<any>();

        this.data = null;
    }

    ngOnInit(): void {
    }
}
