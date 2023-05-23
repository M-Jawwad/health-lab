import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { PermissionService } from 'src/app/services/check-permissions.service';
import { TableConfig } from 'src/app/shared/general-table/model';
import { environment } from 'src/environments/environment';
import { AuditTableConfig } from './audit-config';


@Component({
    selector: 'app-audit',
    templateUrl: './audit.component.html',
    styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit {
    loading: boolean;
    readonly: boolean;
    config: TableConfig;
    auditData: any[];

    constructor(
        private apiService: ApiService,
        private toastrService: ToastrService,
        private checkPermService: PermissionService
    ) {
        this.loading = false;
        this.readonly = false;

        this.config = new TableConfig(AuditTableConfig.config);

        this.auditData = [
            { audit_id: 14532, entity: 'User', action: 'Create', action_details: 'New use created',
                action_date: 1644820963, action_by: 'M Jawwad' },
            { audit_id: 14532, entity: 'User', action: 'Create', action_details: 'New use created',
                action_date: 1644820963, action_by: 'M Jawwad' },
            { audit_id: 14533, entity: 'Settigns', action: 'Update', action_details: 'Password setting updated',
                action_date: 1644890999, action_by: 'Asad Umer' }
        ]
    }

    ngOnInit(): void {
    }
}
