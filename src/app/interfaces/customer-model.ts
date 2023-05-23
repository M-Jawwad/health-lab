export interface Customer {
    id?: number;
    company: string;
    group: string;
    phone_no: number;
    email: string;
    status: string;
    package: string;
    super_admin_email: string;
    is_selected?: boolean,
    description?: string,
}