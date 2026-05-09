export interface UserRegisterRequest {
    uniqueId: string;
    name: string;
    email: string;
    password: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserLoginResponse {
    name: string;
    token: string;
}

export interface UserDetailsResponse {
    name: string;
    email: string;
    totalLinks: number;
    totalSharedLinks: number;
}