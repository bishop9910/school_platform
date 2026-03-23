import type { LoginResult, UserResInfo, UserRegisterInput, RegisterResult } from "@/type";
import Request, { type ApiResponse } from "@/utils/request";

/**
 * 登录接口
 * @后端已实现: POST /auth/login
 */
export function login(username: string, password: string): Promise<ApiResponse<LoginResult>> {
  return Request.request<LoginResult>({
    url: '/auth/login',
    method: 'post',
    headers: { isToken: false, repeatSubmit: false },
    data: { username, password }
  });
}

/**
 * 退出登录接口
 * @后端已实现: POST /auth/logout
 */
export function logout(): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/auth/logout',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false }
  });
}

/**
 * 获取用户信息接口
 * @后端已实现: GET /user/get-info
 */
export function getInfo(): Promise<ApiResponse<UserResInfo>> {
  return Request.request<UserResInfo>({
    url: '/user/get-info',
    method: 'get',
    headers: { isToken: true, repeatSubmit: false }
  });
}

export interface UpdateUserInfoInput {
  nickName?: string;
  avatar?: string;
  gender?: string;
  signature?: string;
  email?: string;
}

export function updateUserInfo(userData: UpdateUserInfoInput): Promise<ApiResponse<null>> {
  return Request.request<null>({
    url: '/user/edit',
    method: 'post',
    headers: { isToken: true, repeatSubmit: false },
    data: userData
  });
}

export function register(userData: UserRegisterInput): Promise<ApiResponse<RegisterResult>> {
  return Request.request<RegisterResult>({
    url: '/auth/register',
    method: 'post',
    headers: { isToken: false, repeatSubmit: false },
    data: userData
  });
}