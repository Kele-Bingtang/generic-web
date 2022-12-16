import request from "@/config/request";
import { Condition, Page, Response } from "@/types/http";
import { RequiredKey } from "@/utils/layout";

export declare module ServiceModule {
  interface Service {
    id: number;
    serviceName: string;
    serviceUrl: string;
    fullUrl: string;
    status: number;
    serviceDesc: string;
    serviceSql: string;
    updateTable: string;
    insertTable: string;
    deleteTable: string;
    createUser: number;
    createTime: string;
    modifyUser: number;
    modifyTime: string;
    projectId: number;
    categoryId: number;
  }

  type ServiceInsert = Omit<Service, "id" | "createTime" | "modifyTime">;

  type ServiceUpdate = RequiredKey<
    Omit<Service, "createUser" | "createTime" | "modifyTime" | "projectId" | "categoryId">,
    "id"
  >;

  type ServiceDelete = RequiredKey<Service, "id">;

  type ServiceSearch = Partial<Service>;
}

export const defaultServiceData: Partial<ServiceModule.Service> = {
  id: 0,
  serviceName: "",
  serviceUrl: "",
  fullUrl: "",
  status: 0,
  serviceDesc: "",
  serviceSql: "",
  updateTable: "",
  insertTable: "",
  deleteTable: "",
  createUser: 0,
  createTime: "",
  modifyUser: 0,
  modifyTime: "",
  projectId: 0,
  categoryId: 0,
};

export const queryGenericServiceByConditions = (
  condition: Array<Condition>
): Promise<Response<Array<ServiceModule.Service>>> => {
  return request({
    url: "/genericService/queryGenericServiceByConditions",
    method: "get",
    data: condition,
  });
};

export const queryGenericServiceList = (
  service?: ServiceModule.Service
): Promise<Response<Array<ServiceModule.Service>>> => {
  return request({
    url: "/genericService/queryGenericServiceList",
    method: "get",
    params: { ...service },
  });
};

export const queryGenericServiceListPages = (
  service?: ServiceModule.Service,
  page?: Page
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

export const queryGenericServiceConditionsPages = (
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
