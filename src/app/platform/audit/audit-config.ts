import { environment } from "src/environments/environment";

export class AuditTableConfig {
    public static config = {
        title: 'Audit',
        slug: `${environment.customerms}/audit/?`,
        addBtnText: 'Generate Audit Report',

        showRowActions: false,
        doApiCall: false,
        searchOptions: [
            { title: 'ID', column: 'audit_id' },
            { title: 'Entity', column: 'entity' },
            { title: 'Action', column: 'action' },
            { title: 'Action Details', column: 'action_details' },
            { title: 'Action Date', column: 'action_date' },
            { title: 'Action By', column: 'action_by' },
        ],
        
        rowActions: [],
        // acColumnWidth: '164px',

        columns: [
            { name: 'audit_id', title: 'ID', sortable: true },
            { name: 'entity', title: 'Entity', sortable: true },
            { name: 'action', title: 'Actions', sortable: false },
            { name: 'action_details', title: 'Action Details', sortable: false },
            { name: 'action_date', title: 'Action Date', sortable: true, format: 'date' },
            { name: 'action_by', title: 'Action By', sortable: true },
        ]
    }
}