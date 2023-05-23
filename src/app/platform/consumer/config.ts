import { environment } from "src/environments/environment";

export class CustomerTableConfig {
    public static config = {
        title: 'Consumer',
        slug: `${environment.customerms}/consumer/?`,
        addBtnText: 'Add New Consumer',

        showHeader: true,
        showAdd: true,
        showRowActions: true,
        doApiCall: true,
        searchOptions: [
            { title: 'Consumer Name', column: 'consumer_name' },
            { title: 'Email', column: 'email' },
            { title: 'Phone Number', column: 'phone' },
            // { title: 'Total Devices', column: 'total_devices' },
            { title: 'Status', column: 'status' },
        ],

        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            { icon: 'ri-add-circle-line', type: 'icon', tooltip: 'Allocate Device', action: 'onAllocateDevices' },
            { icon: 'ri-settings-2-line', type: 'icon', tooltip: 'Change status', action: 'onChangeStatus' },
            // { icon: 'ri-delete-bin-2-line', type: 'icon', tooltip: 'Delete', action: 'onDelete', btnColor: 'btn-danger' }
        ],
        acColumnWidth: '134px',

        columns: [
            { name: 'id', title: 'id', visible: false },
            { name: 'consumer_name', title: 'Consumer Name', sortable: true, clickable: true, action: 'onDetails' },
            { name: 'first_name', title: 'First Name', visible: false },
            { name: 'last_name', title: 'Last Name', visible: false },
            { name: 'email', title: 'Email', sortable: true },
            { name: 'phone', title: 'Phone Number', sortable: true },
            { name: 'qid_passport', title: 'Q-ID / Passport', sortable: true },
            { name: 'all_devices', title: 'Total Devices', sortable: true, sortableFromView: true, clickable: true, action: 'onTotalDevices' },
            { name: 'status', title: 'status', format: 'consumer-status', sortable: true },
        ]
    }
}

function consumerStatus(v: any, r?: any, c?: any) {
    if (r[c.name] && r[c.name] === 1) {
        return `<span>Active</span>`;
    } else {
        return `<span>InActive</span>`;
    }
}

export const CONSUMERSTATUS: any = (v: any, r?: any, c?: any) => consumerStatus(v, r, c);