import request from "@/config/request";
import { Response } from "@/types/http";

export declare module UserProjectModule {
  interface UserProject {
    id: number;
    userId: number;
    projectId: number;
    createTime: string;
    modifyTime: string;
  }

  interface UserProjectInsert {}

  interface UserProjectUpdate {}

  interface UserProjectDelete {}
}

export const defaultUserProjectData: Partial<UserProjectModule.UserProject> = {
  id: 0,
  userId: 0,
  projectId: 0,
  createTime: "",
  modifyTime: "",
};

export const queryUserProjectById = (
  userProject: UserProjectModule.UserProject
): Promise<Response<Array<UserProjectModule.UserProject>>> => {
  return request({
    url: "/userProject/queryUserProjectById",
    method: "get",
    params: {
      userProject,
    },
  });
};

export const queryUserProjectList = (): Promise<Response<Array<UserProjectModule.UserProject>>> => {
  return request({
    url: "/userProject/queryUserProjectList",
    method: "get",
  });
};

export const insertUserProject = (
  userProject: UserProjectModule.UserProject
): Promise<Response<Array<UserProjectModule.UserProject>>> => {
  return request({
    url: "/userProject/insertUserProject",
    method: "post",
    data: userProject,
  });
};

export const updateUserProject = (userProject: any): Promise<Response<Array<UserProjectModule.UserProject>>> => {
  return request({
    url: "/userProject/updateUserProject",
    method: "post",
    data: userProject,
  });
};

export const deleteUserProject = (
  userProject: UserProjectModule.UserProject
): Promise<Response<Array<UserProjectModule.UserProject>>> => {
  return request({
    url: "/userProject/deleteUserProjectById",
    method: "post",
    data: userProject,
  });
};
