// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
