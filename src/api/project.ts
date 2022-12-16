import request from "@/config/request";
import { Condition, Page, Response } from "@/types/http";
import { RequiredKey } from "@/utils/layout";

export declare module ProjectModule {
  interface Project {
    id: number;
    projectName: string;
    baseUrl: string;
    description: string;
    secretKey: string;
    databaseName: string;
    createUser?: string;
    createTime?: string;
    modifyUser?: string;
    modifyTime?: string;
  }

  type ProjectInsert = Omit<Project, "id" | "secretKey" | "createTime" | "modifyTime">;

  type ProjectUpdate = RequiredKey<Omit<Project, "secretKey" | "createUser" | "createTime" | "modifyTime">, "id">;

  type ProjectDelete = RequiredKey<Project, "id">;

  type ProjectSearch = Partial<Project>;
}

export const defaultProjectData: Partial<ProjectModule.Project> = {
  id: 0,
  projectName: "",
  baseUrl: "",
  description: "",
  secretKey: "",
  databaseName: "",
};

export const queryGenericProjectByConditions = (
  condition: Array<Condition>
): Promise<Response<Array<ProjectModule.Project>>> => {
  return request({
    url: "/genericProject/queryGenericProjectByConditions",
    method: "get",
    data: condition,
  });
};

export const queryProjectList = (project?: ProjectModule.Project): Promise<Response<Array<ProjectModule.Project>>> => {
  return request({
    url: "/genericProject/queryGenericProjectList",
    method: "get",
    params: { ...project },
  });
};

export const queryGenericProjectListPages = (
  project?: ProjectModule.Project,
  page?: Page
): Promise<Response<Array<ProjectModule.Project>>> => {
  return request({
    url: "/genericProject/queryGenericProjectListPages",
    method: "get",
    params: {
      ...project,
      ...page,
    },
  });
};

export const queryGenericProjectConditionsPages = (
  condition: Array<Condition>,
  page?: Page
): Promise<Response<Array<ProjectModule.Project>>> => {
  return request({
    url: "/genericProject/queryGenericProjectConditionsPages",
    method: "get",
    params: {
      ...page,
    },
    data: condition,
  });
};

export const insertProject = (
  project: ProjectModule.ProjectInsert
): Promise<Response<Array<ProjectModule.Project>>> => {
  return request({
    url: "/genericProject/insertGenericProject",
    method: "post",
    data: project,
  });
};

export const updateProject = (
  project: ProjectModule.ProjectUpdate
): Promise<Response<Array<ProjectModule.Project>>> => {
  return request({
    url: "/genericProject/updateGenericProject",
    method: "post",
    data: project,
  });
};

export const deleteProject = (
  project: ProjectModule.ProjectDelete
): Promise<Response<Array<ProjectModule.Project>>> => {
  return request({
    url: "/genericProject/deleteGenericProjectById",
    method: "post",
    data: project,
  });
};
