import { environment } from "src/environments/environment";

export class DeviceTypesTableConfig {
    public static config = {
        title: 'Sensor',
        slug: `${environment.inventoryms}/sensor-configuration/?`,
        addBtnText: 'Add Sensor / Feature',

        showHeader: true,
        showAdd: true,
        showRowActions: true,
        searchOptions: [
            { column: 'sensor_id', title: 'ID' },
            { column: 'name', title: 'Name' }
        ],
        
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger' }
        ],

        columns: [
            { name: 'id', title: 'id', visible: false },
            { name: 'sensor_id', title: 'ID', sortable: true },
            { name: 'name', title: 'Name', sortable: true },
        ]
    }
}