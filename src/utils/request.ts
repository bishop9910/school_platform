// utils/request.ts
import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios';
import { getToken, removeToken, setToken } from './auth';
import router from '@/router';
import { message } from 'ant-design-vue';
interface ApiResponseBase<T> {
  status: number;
  message: string;
  headers: any,
  config: InternalAxiosRequestConfig;
  statusText: string;
  code: number;
  data: T
}
import { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from './auth'

export type ApiResponse<T = any> = ApiResponseBase<T> & Partial<T>;

type ApiConfig = {
  baseURL: string,
  timeout: number
}

function getApiConfig(): ApiConfig {
  return {
    baseURL: "http://localhost:8080/app",
    timeout: 3000
  }
}

class Request {
  private instance: AxiosInstance;

  constructor() {
    const config = getApiConfig();

    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      // withCredentials: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = getToken("Auth-Token");
        if (token && config.headers && (config.headers as any).isToken) {
          (config.headers as any).Authorization = `Bearer ${token}`;
        }
        if ((config.headers as any).isToken === false) {
          delete (config.headers as any).Authorization;
        }
        delete config.headers.isToken;
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const res = response.data;
        return res
      },
      (error: any) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = getToken(REFRESH_TOKEN_KEY);
          if (refreshToken) {
            return axios.create({ baseURL: getApiConfig().baseURL })
              .post('/auth/refresh', { refresh_token: refreshToken })
              .then(res => {
                setToken(AUTH_TOKEN_KEY, res.data.access_token);
                originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
                return this.instance.request(originalRequest);
              })
              .catch(() => {
                removeToken(AUTH_TOKEN_KEY);
                removeToken(REFRESH_TOKEN_KEY);
                message.error('登录已过期，请重新登录');
                setTimeout(() => router.push('/login'), 1500);
                return Promise.reject(error);
              });
          } else {
            removeToken(AUTH_TOKEN_KEY);
            removeToken(REFRESH_TOKEN_KEY);
            message.error('登录已过期，请重新登录');
            setTimeout(() => router.push('/login'), 1500);
            return Promise.reject(error);
          }
        }
        message.error(error.response?.data?.message || '请求失败');
        return Promise.reject(error);
      });
  }

  public setBaseURL(newBaseURL: string): void {
    this.instance.defaults.baseURL = newBaseURL;
    console.log(`API baseURL updated to: ${newBaseURL}`);
  }

  public getBaseURL(): string {
    return this.instance.defaults.baseURL || "";
  }

  public request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.request(config);
  }
}

export default new Request();