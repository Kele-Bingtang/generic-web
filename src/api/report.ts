import request from "@/config/request";
import { Condition, Response } from "@/types/http";

export declare module ReportModule {
  interface Report {
    id: number;
    reportTitle: string;
    description: string;
    allowEdit: number;
    allowAdd: number;
    allowDelete: number;
    allowFilter: number;
    allowExport: number;
    pageSize: number;
    chartType: number;
    createUser: number;
    createTime: string;
    modifyUser: number;
    modifyTime: string;
    serviceId: number;
  }

  interface ReportUpdate {}
}

export const defaultReportData: Partial<ReportModule.Report> = {
  id: 0,
  reportTitle: "",
  description: "",
  allowEdit: 0,
  allowAdd: 0,
  allowDelete: 0,
  allowFilter: 0,
  allowExport: 0,
  pageSize: 0,
  chartType: 0,
  createUser: 0,
  createTime: "",
  modifyUser: 0,
  modifyTime: "",
  serviceId: 0,
};

export const queryGenericReportByConditions = (
  condition: Array<Condition>
): Promise<Response<Array<ReportModule.Report>>> => {
  return request({
    url: "/genericReport/queryGenericReportByConditions",
    method: "get",
    data: condition,
  });
};

export const queryReportList = (report: ReportModule.Report): Promise<Response<Array<ReportModule.Report>>> => {
  return request({
    url: "/genericReport/queryGenericReportList",
    method: "get",
    params: { ...report },
  });
};

// export const insertReport = (report: ReportModule.Report): Promise<Response<Array<ReportModule.Report>>> => {
//   return request({
//     url: "/genericReport/insertGenericReport",
//     method: "post",
//     data: report,
//   });
// };

export const updateReport = (report: any): Promise<Response<Array<ReportModule.Report>>> => {
  return request({
    url: "/genericReport/updateGenericReport",
    method: "post",
    data: report,
  });
};

// export const deleteReport = (report: ReportModule.Report): Promise<Response<Array<ReportModule.Report>>> => {
//   return request({
//     url: "/genericReport/deleteGenericReportById",
//     method: "post",
//     data: report,
//   });
// };