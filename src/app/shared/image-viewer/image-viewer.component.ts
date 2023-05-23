import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {

    data: any;
    @Input() imgSource: string;
    @Input() fileName: string;
    @Input() directDownload: boolean;

    sanitizedURL: any = null;
    title: string;

    constructor(
        private modalRef: NgbActiveModal,
        private domSanitizer: DomSanitizer
    ) {
        this.data = null;
        this.imgSource = '';
        this.fileName = '';
        this.directDownload = false;
        this.title = 'Preview Image';
    }

    ngOnInit(): void {
        if (this.imgSource && this.imgSource.includes('pdf')) {
            // this.sanitizedURL = this.domSanitizer.bypassSecurityTrustResourceUrl(this.imgSource);
            window.open(this.imgSource, '_blank');
            this.modalRef.close();
        }
    }

    onCloseModal() {
        this.modalRef.close();
    }

}
