import { environment } from "src/environments/environment";

export class QRCodeTableConfig {
    private static columnCondition(item: any) {
        return item.sensor_flag;
    }
    public static config = {
        title: 'QR Code',
        slug: `${environment.inventoryms}/inventory/device-types/?`,

        showHeader: false,
        showAdd: true,
        showRowActions: true,
        showSearch: false,
        // searchOptions: [
        //     { column: 'device_type_name', title: 'Device Type' },
        //     { column: 'package_name', title: 'Package' },
        //     { column: 'make', title: 'Make' },
        //     { column: 'warranty', title: 'Warranty' },
        //     { column: 'category', title: 'Category' },
        //     { column: 'sensors', title: 'Sensors' },
        // ],
        
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
            { name: 'sensors', title: 'Connected Sensors', sortable: true, isLoop: true, makeOvals: true, condition: QRCodeTableConfig.columnCondition, width: '178px' },
            { name: 'data_sheet', title: 'Data Sheet', sortable: true, clickable: true, action: 'onView',  value: 'View' },
        ]
    }
}