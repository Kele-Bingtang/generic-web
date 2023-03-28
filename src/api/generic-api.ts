import request from "@/config/request";
import { Page, Response } from "@/types/http";
import { ServiceColModule } from "./service-col";

export const queryGenericData = (
  fullUrl: string,
  secretKey: string,
  page?: Page,
  searchParams?: { [key: string]: ServiceColModule.ServiceCol }
): Promise<Response<any[]>> => {
  return request({
    url: fullUrl,
    method: "get",
    params: {
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
): Promise<Response<string>> => {
  return request({
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
