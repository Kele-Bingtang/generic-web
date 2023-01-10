import request from "@/config/request";
import { Condition, Response } from "@/types/http";
import { RequiredKey } from "@/utils/layout";

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
    createUser: string;
    createTime: string;
    modifyUser: string;
    modifyTime: string;
    serviceId: number;
  }

  type ReportUpdate = RequiredKey<Omit<Report, "createUser" | "createTime" | "modifyTime" | "serviceId">, "id">;

  type ProjectSearch = Partial<Report>;
}

export const defaultReportData: Partial<ReportModule.Report> = {
  id: -1,
  reportTitle: "",
  description: "",
  allowEdit: 0,
  allowAdd: 0,
  allowDelete: 0,
  allowFilter: 0,
  allowExport: 0,
  pageSize: 20,
  chartType: 0,
};

export const queryReportByConditions = (
  condition: Array<Condition>
): Promise<Response<Array<ReportModule.Report>>> => {
  return request({
    url: "/genericReport/queryGenericReportByConditions",
    method: "get",
    data: condition,
  });
};

export const queryReportList = (report: ReportModule.ProjectSearch): Promise<Response<Array<ReportModule.Report>>> => {
  return request({
    url: "/genericReport/queryGenericReportList",
    method: "get",
    params: { ...report },
  });
};

export const queryOneReport= (report: ReportModule.ProjectSearch): Promise<Response<ReportModule.Report>> => {
  return request({
    url: "/genericReport/queryOneGenericReport",
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

export const updateReport = (report: ReportModule.ReportUpdate): Promise<Response<Array<ReportModule.Report>>> => {
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
