import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dialog-header',
  templateUrl: './dialog-header.component.html',
  styleUrls: ['./dialog-header.component.scss']
})
export class DialogHeaderComponent implements OnInit {

  @Input() title: string;
  @Output() signal: EventEmitter<any>;

  constructor(private modalRef: NgbActiveModal) {
    this.title = 'Title';
    this.signal = new EventEmitter<any>();
  }

  ngOnInit(): void {
    console.log(this.title);
  }

  onCloseModel()
  {
    this.signal.emit(this.modalRef);
  }
}
