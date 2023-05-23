export interface Inventory {
    device_id?: number;
    device_type: string;
    customer: string;
    package?: string;
    customer_type: string;
    status: string;
    sim_sn?: number;
    sim_msisdn?: number;
    no_of_sim?: number;
    type_of_sim?: string;
    sku_category?: string;
    description?: string;
    make?: string;
    model?: string;
    supplier?: string;
    hs_code?: string;
    product_code?: string;
    cc_price?: number;
    dom?: number;
    created_at?: string;
}