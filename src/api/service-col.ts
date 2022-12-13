import request from "@/config/request";
import { Condition, Response } from "@/types/http";

export declare module ServiceColModule {
  interface ServiceCol {
    id: number;
    tableCol: string;
    jsonCol: string;
    reportCol: string;
    colType: string;
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
    modifyUser: number;
    modifyTime: string;
    serviceId: number;
  }

  interface ServiceColInsert {}

  interface ServiceColUpdate {}

  interface ServiceColDelete {}
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
  displaySeq: 0,
  reportColWidth: 0,
  detailColWidth: 0,
  colAlign: 0,
  createUser: "",
  createTime: "",
  modifyUser: 0,
  modifyTime: "",
  serviceId: 0,
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
  serviceCol: ServiceColModule.ServiceCol
): Promise<Response<Array<ServiceColModule.ServiceCol>>> => {
  return request({
    url: "/serviceCol/queryServiceColList",
    method: "get",
    params: { ...serviceCol },
  });
};

export const insertServiceCol = (
  serviceCol: ServiceColModule.ServiceCol
): Promise<Response<Array<ServiceColModule.ServiceCol>>> => {
  return request({
    url: "/serviceCol/insertServiceCol",
    method: "post",
    data: serviceCol,
  });
};

export const updateServiceCol = (serviceCol: any): Promise<Response<Array<ServiceColModule.ServiceCol>>> => {
  return request({
    url: "/serviceCol/updateServiceCol",
    method: "post",
    data: serviceCol,
  });
};

export const deleteServiceCol = (
  serviceCol: ServiceColModule.ServiceCol
): Promise<Response<Array<ServiceColModule.ServiceCol>>> => {
  return request({
    url: "/serviceCol/deleteServiceColById",
    method: "post",
    data: serviceCol,
  });
};
