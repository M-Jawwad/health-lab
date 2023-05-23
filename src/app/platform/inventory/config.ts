import { environment } from "src/environments/environment"

export class InventoryTableConfig {
    public static config = {
        title: 'Inventory',
        slug: `${environment.inventoryms}/inventory/?`,
        addBtnText: 'Add Device',
        optionalBtnIcon: 'ri-upload-line',

        showOptionalBtn: true,
        optionalBtnText: 'Bulk Upload',
        showHeader: true,
        showRowActions: true,
        doApiCall: false,
        searchOptions: [
            { column: 'device_id', title: 'Device ID' },
            { column: 'device_type_name', title: 'Device Type' },
            { column: 'customer', title: 'Customer' },
            { column: 'status', title: 'Status' },
            { column: 'package', title: 'Package' },
            { column: 'sim_serial_number', title: 'Sim SN' },
            { column: 'sim_msisdn', title: 'Sim MSISDN' },
            // { column: 'date_of_manufacture', title: 'Date of Manufacture' },
        ],

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', type: 'icon', action: 'onEdit' },
            { icon: 'ri-delete-bin-6-line', tooltip: 'Delete', type: 'icon', action: 'onDelete', btnColor: 'btn-danger' },
            // { icon: 'ri-search-2-line', tooltip: 'Device History', type: 'icon', action: 'onShowHistsory', conditional: false },
        ],

        columns: [
            { name: 'device_id', title: 'Device ID', sortable: true, clickable: true, action: 'onDeviceId' },
            { name: 'device_type_name', title: 'Device Type', sortable: true },
            { name: 'customer_name', title: 'Customer', sortable: true, clickable: true, action: 'onCustomerDetails' },
            { name: 'package_name', title: 'Packages', sortable: true },
            { name: 'customer_type', title: 'Customer Type', sortable: true },
            { name: 'inventory_status', title: 'Status', sortable: true },
            { name: 'status', title: 'Status', visible: false },
            { name: 'sim_serial_number', title: 'Sim SN', sortable: true },
            { name: 'sim_msisdn', title: 'Sim MSISDN', sortable: true },

            { name: 'number_of_sim', title: 'Number of Sim', visible: false },
            { name: 'type_of_sim', title: 'Type of Sim', visible: false },
            { name: 'sku_category', title: 'Sku Category', visible: false },
            { name: 'item_description', title: 'Item Description', visible: false },
            { name: 'make', title: 'Make', visible: false },
            { name: 'model', title: 'Model', visible: false },
            { name: 'supplier', title: 'Supplier', visible: false },
            { name: 'hs_code', title: 'HS Code', visible: false },
            { name: 'product_code', title: 'Product Code', visible: false },
            { name: 'current_cost_price', title: 'Current Cost Price', visible: false },
            { name: 'created_at', title: 'Created Date', format: 'date', sortable: true },
            { name: 'additional_information', title: 'Addtional Information', visible: false },
            // comment this below column for now. Will incoporate/open in later
            // { name: 'device_history', title: 'Device History', clickable: true, value: 'Device History', action: 'onShowHistory' },
        ]
    }
}

export class AvailableDevicesTableConfig {
    public static config = {
        title: 'Inventory',
        slug: `${environment}/inventory/?status=1&`,

        showHeader: true,
        showAdd: false,
        showRowActions: true,
        searchOptions: [
            { column: 'device_id', title: 'Device ID' },
            { column: 'device_type_name', title: 'Device Type' },
            { column: 'customer', title: 'Customer' },
            // { column: 'status', title: 'Status' },
            { column: 'package', title: 'Package' },
            { column: 'sim_serial_number', title: 'Sim SN' },
            { column: 'sim_msisdn', title: 'Sim MSISDN' },
        ],

        rowActions: [
            { icon: 'ri-pencil-line', tooltip: 'Edit', action: 'onEdit' }
        ],

        columns: [
            { name: 'device_id', title: 'Device ID', sortable: true, clickable: true, action: 'onDeviceId' },
            { name: 'device_type_name', title: 'Device Type', sortable: true },
            { name: 'customer_name', title: 'Customer', sortable: true, clickable: true, action: 'onCustomerDetails' },
            { name: 'package_name', title: 'Package', sortable: true },
            { name: 'customer_type', title: 'Customer Type', sortable: true },
            { name: 'inventory_status', title: 'Status', sortable: true },
            { name: 'sim_serial_number', title: 'Sim Sn', sortable: true },
            { name: 'sim_msisdn', title: 'Sim msisdn', sortable: true },
            { name: 'created_at', title: 'Created Date', format: 'date', sortable: true },
            // comment this below column for now. Will incoporate/open in later
            // { name: 'device_history', title: 'Device History', clickable: true, value: 'Device History', action: 'onShowHistory' },
        ]
    }
}

export class AllocatedDevicesTableConfig {
    public static config = {
        title: 'Inventory',
        slug: `${environment}/inventory/?status=2&`,

        showHeader: true,
        showAdd: false,
        showRowActions: true,
        searchOptions: [
            { column: 'device_id', title: 'Device ID' },
            { column: 'device_type_name', title: 'Device Type' },
            { column: 'customer', title: 'Customer' },
            // { column: 'status', title: 'Status' },
            { column: 'package', title: 'Package' },
            { column: 'sim_serial_number', title: 'Sim SN' },
            { column: 'sim_msisdn', title: 'Sim MSISDN' },
        ],

        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' }
        ],

        columns: [
            { name: 'device_id', title: 'Device ID', sortable: true, clickable: true, action: 'onDeviceId' },
            { name: 'device_type_name', title: 'Device Type', sortable: true },
            { name: 'customer_name', title: 'Customer', sortable: true, clickable: true, action: 'onCustomerDetails' },
            { name: 'package_name', title: 'Package', sortable: true },
            { name: 'customer_type', title: 'Customer Type', sortable: true },
            { name: 'inventory_status', title: 'Status', sortable: true },
            { name: 'sim_serial_number', title: 'Sim Sn', sortable: true },
            { name: 'sim_msisdn', title: 'Sim msisdn', sortable: true },
            { name: 'created_at', title: 'Created Date', format: 'date', sortable: true },
            // comment this below column for now. Will incoporate/open in later
            // { name: 'device_history', title: 'Device History', clickable: true, value: 'Device History', action: 'onShowHistory' },
        ]
    }
}

export class SoldDevicesTableConfig {
    public static config = {
        title: 'Inventory',
        slug: `${environment}/inventory/?status=3&`,

        showHeader: true,
        showAdd: false,
        showRowActions: true,
        searchOptions: [
            { column: 'device_id', title: 'Device ID' },
            { column: 'device_type_name', title: 'Device Type' },
            { column: 'customer', title: 'Customer' },
            // { column: 'status', title: 'Status' },
            { column: 'package', title: 'Package' },
            { column: 'sim_serial_number', title: 'Sim SN' },
            { column: 'sim_msisdn', title: 'Sim MSISDN' },
        ],

        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' }
        ],

        columns: [
            { name: 'device_id', title: 'Device ID', sortable: true, clickable: true, action: 'onDeviceId' },
            { name: 'device_type_name', title: 'Device Type', sortable: true },
            { name: 'customer_name', title: 'Customer', sortable: true, clickable: true, action: 'onCustomerDetails' },
            { name: 'package_name', title: 'Package', sortable: true },
            { name: 'customer_type', title: 'Customer Type', sortable: true },
            { name: 'inventory_status', title: 'Status', sortable: true },
            { name: 'sim_serial_number', title: 'Sim Sn', sortable: true },
            { name: 'sim_msisdn', title: 'Sim msisdn', sortable: true },
            { name: 'created_at', title: 'Created Date', format: 'date', sortable: true },
            // comment this below column for now. Will incoporate/open in later
            // { name: 'device_history', title: 'Device History', clickable: true, value: 'Device History', action: 'onShowHistory' },
        ]
    }
}

export class DeactivateDevicesTableConfig {
    public static config = {
        title: 'Inventory',
        slug: `${environment}/inventory/?status=4&`,

        showHeader: true,
        showAdd: false,
        showRowActions: true,
        searchOptions: [
            { column: 'device_id', title: 'Device ID' },
            { column: 'device_type_name', title: 'Device Type' },
            { column: 'customer', title: 'Customer' },
            // { column: 'status', title: 'Status' },
            { column: 'package', title: 'Package' },
            { column: 'sim_serial_number', title: 'Sim SN' },
            { column: 'sim_msisdn', title: 'Sim MSISDN' },
        ],

        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' }
        ],

        columns: [
            { name: 'device_id', title: 'Device ID', sortable: true, clickable: true, action: 'onDeviceId' },
            { name: 'device_type_name', title: 'Device Type', sortable: true },
            { name: 'customer_name', title: 'Customer', sortable: true, clickable: true, action: 'onCustomerDetails' },
            { name: 'package_name', title: 'Package', sortable: true },
            { name: 'customer_type', title: 'Customer Type', sortable: true },
            { name: 'inventory_status', title: 'Status', sortable: true },
            { name: 'sim_serial_number', title: 'Sim Sn', sortable: true },
            { name: 'sim_msisdn', title: 'Sim msisdn', sortable: true },
            { name: 'created_at', title: 'Created Date', format: 'date', sortable: true },
            // // comment this below column for now. Will incoporate/open in later
            // { name: 'device_history', title: 'Device History', clickable: true, value: 'Device History', action: 'onShowHistory' },
        ]
    }
}

export class FaultyDevicesTableConfig {
    public static config = {
        title: 'Faulty Devices',
        slug: `${environment}/inventory/?status=5&`,

        showHeader: true,
        showAdd: false,
        showRowActions: true,
        searchOptions: [
            { column: 'device_id', title: 'Device ID' },
            { column: 'device_type_name', title: 'Device Type' },
            { column: 'customer', title: 'Customer' },
            // { column: 'status', title: 'Status' },
            { column: 'package', title: 'Package' },
            { column: 'sim_serial_number', title: 'Sim SN' },
            { column: 'sim_msisdn', title: 'Sim MSISDN' },
        ],

        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' }
        ],

        columns: [
            { name: 'device_id', title: 'Device ID', sortable: true, clickable: true, action: 'onDeviceId' },
            { name: 'device_type_name', title: 'Device Type', sortable: true },
            { name: 'customer_name', title: 'Customer', sortable: true, clickable: true, action: 'onCustomerDetails' },
            { name: 'package_name', title: 'Package', sortable: true },
            { name: 'customer_type', title: 'Customer Type', sortable: true },
            { name: 'inventory_status', title: 'Status', sortable: true },
            { name: 'sim_serial_number', title: 'Sim Sn', sortable: true },
            { name: 'sim_msisdn', title: 'Sim msisdn', sortable: true },
            { name: 'created_at', title: 'Created Date', format: 'date', sortable: true },
            // comment this below column for now. Will incoporate/open in later
            // { name: 'device_history', title: 'Device History', clickable: true, value: 'Device History', action: 'onShowHistory' },
        ]
    }
}