export interface Package {
    id?: number;
    name: string;
    is_selected?: boolean,
    description: string,
}

export interface Usecase {
    id?: number;
    usecase_name: string;
    package_name: string;
    modules?: string[];
    no_of_users: number;
    is_selected?: boolean,
}