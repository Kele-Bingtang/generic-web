import http from "@/config/request";

export declare namespace ServiceColModule {
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
    allowRequest: number;
    allowShowInReport: number;
    allowShowInDetail: number;
    displaySeq: number;
    reportColWidth: number;
    detailColWidth: number;
    colAlign: number;
    dropdownValue: string;
    dropdownService: string;
    dropdownSql: string;
    createUser: string;
    createTime: string;
    modifyUser: string;
    modifyTime: string;
    serviceId: number;
  }

  type ServiceColInsert = Omit<ServiceCol, "id" | "createTime" | "modifyTime">;

  type ServiceColUpdate = RequiredKeyPartialOther<
    Omit<ServiceCol, "createUser" | "createTime" | "modifyTime" | "serviceId">,
    "id"
  >;

  type ServiceColDelete = RequiredKeyPartialOther<ServiceCol, "id">;

  type ServiceColSearch = Partial<ServiceCol>;

  interface ServiceColBatchUpdate {
    allowInsert?: number | null;
    allowUpdate?: number | null;
    allowFilter?: number | null;
    allowRequest?: number | null;
    jsonColList: string[];
  }
}

export const defaultServiceColData: Partial<ServiceColModule.ServiceCol> = {
  id: -1,
  tableCol: "",
  jsonCol: "",
  reportCol: "",
  colType: "",
  isWhereKey: 0,
  defaultValue: "",
  dataEncrypt: 0,
  queryFilter: 0,
  orderBy: 99,
  allowInsert: 0,
  allowUpdate: 0,
  allowFilter: 0,
  allowRequest: 0,
  allowShowInReport: 0,
  allowShowInDetail: 0,
  displaySeq: 99,
  reportColWidth: -1,
  detailColWidth: -1,
  colAlign: 0,
  dropdownValue: "",
  dropdownService: "",
  dropdownSql: "",
};

export const queryServiceColList = (serviceCol?: ServiceColModule.ServiceColSearch) => {
  return http.request<http.Response<ServiceColModule.ServiceCol[]>>({
    url: "/serviceCol/queryServiceColList",
    method: "get",
    params: { ...serviceCol },
  });
};

export const queryServiceColListPages = (page?: http.Page, serviceCol?: ServiceColModule.ServiceColSearch) => {
  return http.request<http.Response<ServiceColModule.ServiceCol[]>>({
    url: "/serviceCol/queryServiceColListPages",
    method: "get",
    params: { ...serviceCol, ...page },
  });
};

export const insertServiceCol = (serviceCol: ServiceColModule.ServiceColInsert) => {
  return http.request<http.Response<string>>({
    url: "/serviceCol/insertServiceCol",
    method: "post",
    data: serviceCol,
  });
};

export const updateServiceCol = (serviceCol: ServiceColModule.ServiceColUpdate) => {
  return http.request<http.Response<string>>({
    url: "/serviceCol/updateServiceCol",
    method: "post",
    data: serviceCol,
  });
};

export const updateBatchServiceCol = (serviceCol: ServiceColModule.ServiceColBatchUpdate) => {
  return http.request<http.Response<string>>({
    url: "/serviceCol/updateBatchServiceCol",
    method: "post",
    data: serviceCol,
  });
};

export const deleteServiceCol = (serviceCol: ServiceColModule.ServiceColDelete) => {
  return http.request<http.Response<string>>({
    url: "/serviceCol/deleteServiceColById",
    method: "post",
    data: serviceCol,
  });
};

export const updateColumn = (serviceId: number) => {
  return http.request<http.Response<string>>({
    url: `/serviceCol/updateColumn/${serviceId}`,
    method: "post",
  });
};

export const deleteInvalidColumn = (serviceId: number) => {
  return http.request<http.Response<string>>({
    url: `/serviceCol/deleteInvalidColumn/${serviceId}`,
    method: "post",
  });
};
