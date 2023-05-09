import http from "@/config/request";

export declare namespace ServiceModule {
  interface Service {
    id: number;
    serviceName: string;
    serviceUrl: string;
    fullUrl: string;
    status: number;
    serviceDesc: string;
    selectSql: string;
    selectTable: string;
    updateTable: string;
    insertTable: string;
    deleteTable: string;
    isAuth: number;
    createUser: string;
    createTime: string;
    modifyUser: string;
    modifyTime: string;
    projectId: number;
    categoryId: number;
    reportTitle: string;
  }

  type ServiceInsert = RequiredKeyPartialOther<
    Omit<Service, "id" | "createTime" | "modifyTime">,
    "serviceName" | "serviceUrl"
  >;

  type ServiceUpdate = RequiredKeyPartialOther<
    Omit<Service, "createUser" | "createTime" | "modifyTime" | "projectId" | "categoryId">,
    "id"
  >;

  type ServiceDelete = RequiredKeyPartialOther<Service, "id">;

  type ServiceSearch = Partial<Service>;

  interface ServiceColList {
    serviceColId: number;
    serviceColJsonName: string;
  }

  interface ServiceAndServiceCol {
    serviceId: number;
    serviceName: string;
    serviceColList: ServiceColList[];
  }
}

export const defaultServiceData: Partial<ServiceModule.Service> = {
  id: -1,
  serviceName: "",
  serviceUrl: "",
  fullUrl: "",
  status: 1,
  serviceDesc: "",
  selectSql: "",
  updateTable: "",
  insertTable: "",
  deleteTable: "",
  isAuth: 0,
};

export const queryOneService = (service: ServiceModule.ServiceSearch) => {
  return http.request<http.Response<ServiceModule.Service>>({
    url: "/service/queryOneService",
    method: "get",
    params: { ...service },
  });
};

export const queryServiceList = (service?: ServiceModule.ServiceSearch) => {
  return http.request<http.Response<ServiceModule.Service[]>>({
    url: "/service/queryServiceList",
    method: "get",
    params: { ...service },
  });
};

export const queryServiceListPages = (page?: http.Page, service?: ServiceModule.ServiceSearch) => {
  return http.request<http.Response<ServiceModule.Service[]>>({
    url: "/service/queryServiceListPages",
    method: "get",
    params: {
      ...service,
      ...page,
    },
  });
};

export const queryServiceAndServiceColList = (projectId: number) => {
  return http.request<http.Response<ServiceModule.ServiceAndServiceCol[]>>({
    url: `/service/queryServiceAndServiceColList/${projectId}`,
    method: "get",
  });
};

export const insertService = (service: ServiceModule.ServiceInsert) => {
  return http.request<http.Response<string>>({
    url: "/service/insertService",
    method: "post",
    data: service,
  });
};

export const updateService = (service: ServiceModule.ServiceUpdate) => {
  return http.request<http.Response<string>>({
    url: "/service/updateService",
    method: "post",
    data: service,
  });
};

export const deleteService = (service: ServiceModule.ServiceDelete) => {
  return http.request<http.Response<string>>({
    url: "/service/deleteServiceById",
    method: "post",
    data: service,
  });
};

export const queryTableViewName = (databaseName: string) => {
  return http.request<
    http.Response<{
      table: string[];
      view: string[];
    }>
  >({
    url: `/service/queryTableViewNameByDatabaseName/${databaseName}`,
    method: "get",
  });
};

export const verifySql = (sql: string) => {
  return http.request<http.Response<number>>({
    url: "/service/verifySql",
    method: "post",
    data: {
      sql,
    },
    params: {
      _type: "form",
    },
  });
};
