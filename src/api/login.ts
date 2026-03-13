import type { LoginResult, UserResInfo, UserRegisterInput, RegisterResult } from "@/type";
import Request, { type ApiResponse } from "@/utils/request";

export function login(username: string, password: string): Promise<ApiResponse<LoginResult>> {
  return Request.request<LoginResult>({
    url: '/login',
    method: 'post',
    headers: { isToken: false, repeatSubmit: false },
    data: { username, password }
  });
}

export function getInfo(): Promise<ApiResponse<UserResInfo>> {
  return Request.request<UserResInfo>({
    url: '/getInfo',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false }
  });
}

export function register(userData: UserRegisterInput): Promise<ApiResponse<RegisterResult>> {
  return Request.request<RegisterResult>({
    url: '/register',
    method: 'post',
    headers: { isToken: false, repeatSubmit: false },
    data: userData
  });
}