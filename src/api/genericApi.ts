import http from "@/config/request";
import type { ServiceColModule } from "./serviceCol";

export const queryGenericData = (
  fullUrl: string,
  secretKey: string,
  page?: http.Page,
  searchParams?: { [key: string]: ServiceColModule.ServiceCol }
) => {
  return http.request<http.Response<any[]>>({
    url: fullUrl,
    method: "get",
    params: {
      _type: "multi",
      _from: "report", // 如果是 report，则不仅返回数据，还返回对应的字段配置信息
      ...page,
      ...searchParams,
    },
    headers: {
      "Secret-Key": secretKey,
    },
  });
};

export const operateGenericDataForm = (
  fullUrl: string,
  secretKey: string,
  data: any,
  submitType: "insert" | "update" | "delete"
) => {
  return http.request<http.Response<string>>({
    url: fullUrl,
    method: "post",
    headers: {
      "Secret-Key": secretKey,
    },
    params: {
      _type: "form",
    },
    data: {
      submitType,
      ...data,
    },
  });
};
