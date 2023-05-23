import { environment } from "src/environments/environment";

export class DeviceTypesTableConfig {
    private static columnCondition(item: any) {
        return item.sensor_flag;
    }
    public static config = {
        title: 'Device Types',
        slug: `${environment.inventoryms}/device-types/?`,

        showHeader: true,
        showAdd: true,
        showRowActions: true,
        searchOptions: [
            { column: 'device_type_name', title: 'Device Type' },
            { column: 'package_name', title: 'Package' },
            { column: 'make', title: 'Make' },
            { column: 'warranty', title: 'Warranty' },
            { column: 'category', title: 'Category' },
            { column: 'sensors', title: 'Sensors' },
        ],

        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger' },
        ],

        columns: [
            { name: 'id', title: 'Device ID', visible: false },
            { name: 'device_type_name', title: 'Device Type', sortable: true, clickable: true, action: 'showDetails' },
            { name: 'package', title: 'Package', visible: false },
            { name: 'package_name', title: 'Package', sortable: true },
            { name: 'make', title: 'Make', sortable: true },
            { name: 'warranty', title: 'Warranty', sortable: true },
            { name: 'category', title: 'Category', sortable: true },
            { name: 'sensors', title: 'Connected Sensors', sortable: false, isLoop: true, makeOvals: true, condition: DeviceTypesTableConfig.columnCondition, width: '178px' },
            { name: 'data_sheet', title: 'Data Sheet', sortable: false, clickable: true, action: 'onView', value: 'View' },
        ]
    }
}