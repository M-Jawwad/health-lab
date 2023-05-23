export interface Consumer {
    id?: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_no: number;
    total_devices: number;
    status: string;
    document?: string;
}