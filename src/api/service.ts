import request from "@/config/request";
import { Condition, Page, Response } from "@/types/http";
import { RequiredKey } from "@/utils/layout";

export declare module ServiceModule {
  interface Service {
    id: number;
    serviceName: string;
    serviceUrl: string;
    fullUrl: string;
    status: string;
    serviceDesc: string;
    selectSql: string;
    updateTable: string;
    insertTable: string;
    deleteTable: string;
    createUser: string;
    createTime: string;
    modifyUser: string;
    modifyTime: string;
    projectId: number;
    categoryId: number;
  }

  type ServiceInsert = RequiredKey<Omit<Service, "id" | "createTime" | "modifyTime">, "serviceName" | "serviceUrl">;

  type ServiceUpdate = RequiredKey<
    Omit<Service, "createUser" | "createTime" | "modifyTime" | "projectId" | "categoryId">,
    "id"
  >;

  type ServiceDelete = RequiredKey<Service, "id">;

  type ServiceSearch = Partial<Service>;
}

export const defaultServiceData: Partial<ServiceModule.Service> = {
  id: -1,
  serviceName: "",
  serviceUrl: "",
  fullUrl: "",
  status: "",
  serviceDesc: "",
  selectSql: "",
  updateTable: "",
  insertTable: "",
  deleteTable: "",
};

export const queryServiceByConditions = (
  condition: Array<Condition>
): Promise<Response<Array<ServiceModule.Service>>> => {
  return request({
    url: "/genericService/queryGenericServiceByConditions",
    method: "get",
    data: condition,
  });
};

export const queryServiceList = (
  service?: ServiceModule.ServiceSearch
): Promise<Response<Array<ServiceModule.Service>>> => {
  return request({
    url: "/genericService/queryGenericServiceList",
    method: "get",
    params: { ...service },
  });
};

export const queryServiceListPages = (
  page?: Page,
  service?: ServiceModule.ServiceSearch
): Promise<Response<Array<ServiceModule.Service>>> => {
  return request({
    url: "/genericService/queryGenericServiceListPages",
    method: "get",
    params: {
      ...service,
      ...page,
    },
  });
};

export const queryServiceConditionsPages = (
  condition: Array<Condition>,
  page?: Page
): Promise<Response<Array<ServiceModule.Service>>> => {
  return request({
    url: "/genericService/queryGenericServiceConditionsPages",
    method: "get",
    params: {
      ...page,
    },
    data: condition,
  });
};

export const insertService = (
  service: ServiceModule.ServiceInsert
): Promise<Response<Array<ServiceModule.Service>>> => {
  return request({
    url: "/genericService/insertGenericService",
    method: "post",
    data: service,
  });
};

export const updateService = (
  service: ServiceModule.ServiceUpdate
): Promise<Response<Array<ServiceModule.Service>>> => {
  return request({
    url: "/genericService/updateGenericService",
    method: "post",
    data: service,
  });
};

export const deleteService = (
  service: ServiceModule.ServiceDelete
): Promise<Response<Array<ServiceModule.Service>>> => {
  return request({
    url: "/genericService/deleteGenericServiceById",
    method: "post",
    data: service,
  });
};
