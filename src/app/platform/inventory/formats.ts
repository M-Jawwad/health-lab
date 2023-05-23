function inventoryStatus(v: any, r?: any, c?: any)
{
    if (r.status === 1) {
        return `<span>Available</span>`;
    } else if (r.status === 2) {
        return `<span>Allocated</span>`;
    } else if (r.status === 3) {
        return `<span>Sold</span>`;
    } else if (r.status === 4) {
        return `<span>Deactivate</span>`;
    } else if (r.status === 5) {
        return `<span>Faulty</span>`;
    } else {
        return v;
    }
}
    
export const STATUS: any = (v: any, r?: any, c?: any) => inventoryStatus(v, r, c);