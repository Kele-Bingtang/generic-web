import { UserModule } from "@/store/modules/user";
import message from "@/utils/message";
import notification from "@/utils/notification";
import axios, { AxiosRequestConfig } from "axios";

const cancelToken = axios.CancelToken;
const source = cancelToken.source();

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000,
});

// request 拦截器
service.interceptors.request.use(
  config => {
    // if(!token) {
    //   config.cancelToken = source.token;
    //   source.cancel("身份异常！")
    // }
    config.headers!["Authorization"] = `Bearer ${UserModule.token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  response => {
    let res = response.data;
     if (res.code !== 200 || res.status !== "success") {
      notification.error(res.message);
    }
    return res;
  },
  error => {
    message.error(error.message);
    return Promise.reject(error);
  }
);
export { service };

export default function request<T, R>(config: AxiosRequestConfig<T>) {
  return service(config) as unknown as Promise<R>;
}
