import request from "@/config/request";
import { Condition, Page, Response } from "@/types/http";
import { RequiredKey } from "@/utils/layout";

export declare module ServiceColModule {
  interface ServiceCol {
    id: number;
    tableCol: string;
    jsonCol: string;
    reportCol: string;
    colType: string;
    colLength: string;
    isWhereKey: number;
    defaultValue: string;
    dataEncrypt: number;
    queryFilter: number;
    orderBy: number;
    allowInsert: number;
    allowUpdate: number;
    allowFilter: number;
    allowShowInReport: number;
    allowShowInDetail: number;
    displaySeq: number;
    reportColWidth: number;
    detailColWidth: number;
    colAlign: number;
    createUser: string;
    createTime: string;
    modifyUser: string;
    modifyTime: string;
    serviceId: number;
  }

  type ServiceColInsert = Omit<ServiceCol, "id" | "createTime" | "modifyTime">;

  type ServiceColUpdate = RequiredKey<Omit<ServiceCol, "createUser" | "createTime" | "modifyTime" | "serviceId">, "id">;

  type ServiceColDelete = RequiredKey<ServiceCol, "id">;

  type ServiceColSearch = Partial<ServiceCol>;
}

export const defaultServiceColData: Partial<ServiceColModule.ServiceCol> = {
  id: 0,
  tableCol: "",
  jsonCol: "",
  reportCol: "",
  colType: "",
  isWhereKey: 0,
  defaultValue: "",
  dataEncrypt: 0,
  queryFilter: 0,
  orderBy: 0,
  allowInsert: 0,
  allowUpdate: 0,
  allowFilter: 0,
  allowShowInReport: 0,
  allowShowInDetail: 0,
  displaySeq: 99,
  reportColWidth: 0,
  detailColWidth: 0,
  colAlign: 0,
};

export const queryServiceColByConditions = (
  condition: Array<Condition>
): Promise<Response<Array<ServiceColModule.ServiceCol>>> => {
  return request({
    url: "/serviceCol/queryServiceColByConditions",
    method: "get",
    data: condition,
  });
};

export const queryServiceColList = (
  serviceCol?: ServiceColModule.ServiceColSearch
): Promise<Response<Array<ServiceColModule.ServiceCol>>> => {
  return request({
    url: "/serviceCol/queryServiceColList",
    method: "get",
    params: { ...serviceCol },
  });
};

export const queryServiceColListPages = (
  page?: Page,
  serviceCol?: ServiceColModule.ServiceColSearch
): Promise<Response<Array<ServiceColModule.ServiceCol>>> => {
  return request({
    url: "/serviceCol/queryServiceColListPages",
    method: "get",
    params: { ...serviceCol, ...page },
  });
};

export const insertServiceCol = (
  serviceCol: ServiceColModule.ServiceColInsert
): Promise<Response<Array<ServiceColModule.ServiceCol>>> => {
  return request({
    url: "/serviceCol/insertServiceCol",
    method: "post",
    data: serviceCol,
  });
};

export const updateServiceCol = (
  serviceCol: ServiceColModule.ServiceColUpdate
): Promise<Response<Array<ServiceColModule.ServiceCol>>> => {
  return request({
    url: "/serviceCol/updateServiceCol",
    method: "post",
    data: serviceCol,
  });
};

export const deleteServiceCol = (
  serviceCol: ServiceColModule.ServiceColDelete
): Promise<Response<Array<ServiceColModule.ServiceCol>>> => {
  return request({
    url: "/serviceCol/deleteServiceColById",
    method: "post",
    data: serviceCol,
  });
};
