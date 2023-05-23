import { environment } from "src/environments/environment";

export class DeviceParametersTableConfig {
    public static config = {
        title: 'Parameter',
        slug: `${environment.ddms}/device-diagnostic/parameters?`,

        showHeader: true,
        showSearch: true,
        showDownload: false,
        showAdd: true,
        showRowActions: true,
        searchOptions: [
            { column: 'unique_id', title: 'ID' },
            { column: 'name', title: 'Parameter' },
            { column: 'values', title: 'Response Key' }
        ],

        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger' }
        ],

        columns: [
            { name: 'id', title: 'id', visible: false },
            { name: 'unique_id', title: 'ID', sortable: true },
            { name: 'name', title: 'Parameter', sortable: true },
            { name: 'values', title: 'Response Key', sortable: true },
        ]
    }
}