import request from "@/config/request";
import { Page, Response } from "@/types/http";

export const queryGenericData = (fullUrl: string, secretKey: string, page?: Page): Promise<Response<any[]>> => {
  return request({
    url: fullUrl,
    method: "get",
    params: {
      _from: "report", // 如果是 report，则不仅返回数据，还返回对应的字段配置信息
      ...page,
    },
    headers: {
      generic_secret_key: secretKey,
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
      generic_secret_key: secretKey,
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
