import http from "@/config/request";

export declare namespace ReportModule {
  interface Report {
    id: number;
    reportTitle: string;
    description: string;
    allowEdit: number;
    allowAdd: number;
    allowDelete: number;
    allowFilter: number;
    allowExport: number;
    allowRow: number;
    dialogWidth: string;
    pageSize: number;
    chartType: number;
    createUser: string;
    createTime: string;
    modifyUser: string;
    modifyTime: string;
    serviceId: number;
  }

  type ReportUpdate = RequiredKeyPartialOther<
    Omit<Report, "createUser" | "createTime" | "modifyTime" | "serviceId">,
    "id"
  >;

  type ProjectSearch = Partial<Report>;
}

export const defaultReportSetting: Partial<ReportModule.Report> = {
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

export const queryReportList = (report: ReportModule.ProjectSearch) => {
  return http.request<http.Response<ReportModule.Report[]>>({
    url: "/report/queryReportList",
    method: "get",
    params: { ...report },
  });
};

export const queryOneReport = (report: ReportModule.ProjectSearch) => {
  return http.request<http.Response<ReportModule.Report>>({
    url: "/report/queryOneReport",
    method: "get",
    params: { ...report },
  });
};

export const updateReport = (report: ReportModule.ReportUpdate) => {
  return http.request<http.Response<string>>({
    url: "/report/updateReport",
    method: "post",
    data: report,
  });
};
