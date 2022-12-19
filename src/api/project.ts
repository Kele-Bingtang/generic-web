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
    createUser: string;
    createTime: string;
    modifyUser: string;
    modifyTime: string;
  }

  interface UserProject {
    id: number;
    userId: number;
    projectId: number;
    roleId: number;
    enterType: number;
    createTime: string;
    modifyTime: string;
  }

  type ProjectInsert = Omit<Project, "id" | "secretKey" | "createTime" | "modifyTime">;

  type ProjectUpdate = RequiredKey<Omit<Project, "secretKey" | "createUser" | "createTime" | "modifyTime">, "id">;

  type ProjectDelete = RequiredKey<Project, "id">;

  type ProjectSearch = Partial<Project>;

  type UserProjectSearch = Partial<UserProject>
}

export const defaultProjectData: Partial<ProjectModule.Project> = {
  id: -1,
  projectName: "",
  baseUrl: "",
  description: "",
  secretKey: "",
  databaseName: "",
};

export const queryProjectByConditions = (
  condition: Array<Condition>
): Promise<Response<Array<ProjectModule.Project>>> => {
  return request({
    url: "/genericProject/queryGenericProjectByConditions",
    method: "get",
    data: condition,
  });
};

export const queryProjectListOwner = (
  project?: ProjectModule.UserProjectSearch
): Promise<Response<Array<ProjectModule.Project>>> => {
  return request({
    url: "/genericProject/queryGenericProjectListOwner",
    method: "get",
    params: { ...project },
  });
};

export const queryProjectList = (
  project?: ProjectModule.ProjectSearch
): Promise<Response<Array<ProjectModule.Project>>> => {
  return request({
    url: "/genericProject/queryGenericProjectListOwner",
    method: "get",
    params: { ...project },
  });
};

export const queryProjectListPages = (
  project?: ProjectModule.ProjectSearch,
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

export const queryProjectConditionsPages = (
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
