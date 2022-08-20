export interface UsersQueryResponse {
    users: IRandomUserTableModel[];
    total: number;
    start: number;
}

export interface IRandomUserResponse {
    info: Array<IRandomUserInfo>;
    results: Array<IRandomUserResults>;
}

export interface IRandomUserInfo {
    page: number;
    results: number;
    seed: string;
    version: string;
}

export interface IRandomUserResults {
    cell: string;
    dob: {
        age: number;
        date: string;
    };
    email: string;
    gender: string;
    id: any;
    location: IRandomUserLocation;
    login: {
        md5: string;
        password: string;
        salt: string;
        sha1: string;
        sha256: string;
        username: string;
        uuid: string;
    };
    name: {
        title: string;
        first: string;
        last: string;
    };
    nat: string;
    phone: string;
    picture: {
        large: string;
        medium: string;
        thumbnail: string;
    };
    registered: {
        date: string;
        age: number;
    };
}

export interface IRandomUserTableModel {
    no: number;
    nameTitle: string;
    nameFirst: string;
    nameLast: string;
    gender: string;
    country: string;
    city: string;
    postcode: number;
    email: string;
    cell: string;
}

export interface IRandomUserLocation {
    city: string;
    coordinates: { latitude: string; longitude: string };
    country: string;
    postcode: number;
    state: string;
    street: { number: number; name: string };
    timezone: any;
}

export interface IBrewInfo {
    id: number;
    name: string;
    tagline: string;
    first_brewed: string;
    description: string;
    brewers_tips: string;
}

export interface IBrewDatasourceResponse {
    brewInfo: IBrewInfo[];
    total: number;
}
