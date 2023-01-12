import request from "@/config/request";
import { Response } from "@/types/http";

export const queryGenericData = (fullUrl: string, secretKey: string): Promise<Response<any[]>> => {
  return request({
    url: fullUrl,
    method: "get",
    params: {
      _from: "report", // 如果是 report，则不仅返回数据，还返回对应的字段配置信息
    },
    headers: {
      generic_secret_key: secretKey,
    },
  });
};


