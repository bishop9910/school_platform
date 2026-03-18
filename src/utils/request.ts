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
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue';
const trouter = useRouter()
interface ApiResponseBase<T>{
  status: number;
  message: string;
  headers: any,
  config: InternalAxiosRequestConfig;
  statusText: string;
  code: number;
  data: T
}

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
        if (error.status === 401) {
          removeToken("Auth_Token");
          const Refresh_Token = getToken("Refresh_Token");
          if (Refresh_Token) {
            const response = axios.post(
              '/auth/refresh',
              { refresh_token: Refresh_Token }
            ).then(res => {
              setToken("Auth_Token", res.data.access_token)
            }).catch(error => {
              message.error("请重新登录")
              setTimeout(() => {
                trouter.push('/login')
              }, 3000)
            })
          }
        }
        console.error('HTTP Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  public setBaseURL(newBaseURL: string): void {
    this.instance.defaults.baseURL = newBaseURL;
    console.log(`API baseURL updated to: ${newBaseURL}`);
  }

  public request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.instance.request(config);
  }
}

export default new Request();