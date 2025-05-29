export interface DecodedJWT {
    uuid: string;
    sub: string;
    permissions: string[];
    exp: number;
    iat: number;
    jti: string;
    csrf: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    faceImages: string[];
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: any;
}

export interface User {
    uuid: string;
    email: string;
    name: string;
    permissions: string[];
}