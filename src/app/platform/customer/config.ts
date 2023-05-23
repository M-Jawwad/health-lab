import { environment } from "src/environments/environment";

export class CustomerTableConfig {
    public static config = {
        title: 'Customer',
        slug: `${environment.customerms}/customers/?`,

        showHeader: true,
        showAdd: true,
        showRowActions: true,
        doApiCall: true,
        searchOptions: [
            { column: 'company_name', title: 'Company' },
            { column: 'group_name', title: 'Group' },
            { column: 'phone_number', title: 'Phone No' },
            { column: 'email', title: 'Email' },
            { column: 'customer_status', title: 'Status' },
            { column: 'customer_packages', title: 'Package' },
            { column: 'super_admin_email', title: 'SuperAdmin Email' }
        ],
        
        acColumnWidth: '100px',
        rowActions: [
            { icon: 'ri-pencil-line', type: 'icon', tooltip: 'Edit', action: 'onEdit' },
            { icon: 'ri-settings-2-line', type: 'icon', tooltip: 'Change Status', action: 'onChangeStatus' },
        ],

        columns: [
            { name: 'id', title: 'id', visible: false },
            { name: 'company_name', title: 'Company', sortable: true, clickable: true, action: 'onDetails' },
            { name: 'group_name', title: 'Group', sortable: true },
            { name: 'phone_number', title: 'Phone Number', sortable: true },
            { name: 'email', title: 'Email', sortable: true },
            { name: 'customer_status', title: 'status', sortable: true },
            { name: 'customer_packages', title: 'Package', width: '252px', isLoop: true, makeOvals: true, item_name: 'package_name', sortable: true },
            { name: 'customer_admins', title: 'SuperAdmin Email', width: '200px', isLoop: true, sortable: true },
        ]
    }
}

function makeOvals(v: any, r?: any, c?: any) {
    let val: any[] = [];
    let template = '';
    if (!!r[c.name]) {
        r[c.name].forEach((element: any) => {
            // console.log(element);
            val.push(element.package_name);
        });
    }

    if (val.length > 0) {
        for (let i = 0; i < val.length; i++) {
            const element = val[i];
            // console.log(element);
        }
        template = `<span class="make-oval">${val}<span>`;
    }
    return template;
}

export const OVALS: any = (v: any, r?: any, c?: any) => makeOvals(v, r, c);