import { environment } from "src/environments/environment";

export class ApiHandlerTableConfig {
    public static config = {
        title: 'Action',
        slug: `${environment.da}/api/actions?`,

        showHeader: true,
        showAdd: true,
        showSearch: true,
        showDownload: false,
        doApiCall: true,
        showRowActions: true,
        searchOptions: [
            { column: 'id', title: 'ID' },
            { column: 'action', title: 'Name' },
            { column: 'device_sdk', title: 'Post URL' },
        ],

        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger' }
        ],

        columns: [
            { name: 'id', title: 'id' },
            { name: 'command', title: 'Name', sortable: true },
            { name: 'device_sdk', title: 'Post URL', sortable: true },
            // { name: 'parameter', title: 'Parameter', sortable: true },
            // { name: 'response', title: 'Response Key', sortable: true },
        ]
    }
}