import request from "@/config/request";
import { Condition, Page, Response } from "@/types/http";
import { RequiredKey } from "@/utils/layout";

export declare module UserInfoModule {
  interface User {
    id: number;
    username: string;
    nickname: string;
    password: string;
    email: string;
    gender: number;
    birthday: string;
    phone: string;
    status: number;
    registerTime: string;
    modifyTime: string;
  }

  type UserInsert = Omit<User, "id" | "registerTime" | "modifyTime">;

  type UserUpdate = RequiredKey<Omit<User, "registerTime" | "modifyTime">, "username">;

  type UserDelete = RequiredKey<User, "username">;

  type UserSearch = Partial<User>;
}

export const defaultUserData: Partial<UserInfoModule.User> = {
  id: -1,
  username: "",
  nickname: "",
  password: "",
  email: "",
  gender: 0,
  birthday: "",
  phone: "",
  status: 0,
};

export interface LoginInfo {
  username: string;
  password: string;
}

export const login = (params: LoginInfo): Promise<Response<string>> => {
  return request({
    url: "/login",
    method: "post",
    params: {
      ...params,
    },
  });
};

export const getUserInfo = (token: string): Promise<Response<UserInfoModule.User>> => {
  return request({
    url: "/genericUser/getUserInfo",
    method: "post",
    params: {
      token,
    },
  });
};

export const queryUserByConditions = (condition: Array<Condition>): Promise<Response<Array<UserInfoModule.User>>> => {
  return request({
    url: "/genericUser/queryGenericUserByConditions",
    method: "get",
    data: condition,
  });
};

export const queryUserList = (user?: UserInfoModule.UserSearch): Promise<Response<Array<UserInfoModule.User>>> => {
  return request({
    url: "/genericUser/queryGenericUserList",
    method: "get",
    params: { ...user },
  });
};

export const queryUserListPages = (
  page?: Page,
  user?: UserInfoModule.UserSearch
): Promise<Response<Array<UserInfoModule.User>>> => {
  return request({
    url: "/genericUser/queryGenericUserListPages",
    method: "get",
    params: {
      ...user,
      ...page,
    },
  });
};

export const queryUserConditionsPages = (
  condition: Array<Condition>,
  page?: Page
): Promise<Response<Array<UserInfoModule.User>>> => {
  return request({
    url: "/genericUser/queryGenericUserConditionsPages",
    method: "get",
    params: {
      ...page,
    },
    data: condition,
  });
};

export const queryMemberInProject = (
  secretKey: string,
  page?: Page
): Promise<Response<Array<Omit<UserInfoModule.User, "id" | "password">>>> => {
  return request({
    url: "/genericUser/queryGenericMemberInProject",
    method: "get",
    params: {
      secretKey,
      ...page,
    },
  });
};

export const insertUser = (user: UserInfoModule.UserInsert): Promise<Response<Array<UserInfoModule.User>>> => {
  return request({
    url: "/genericUser/insertGenericUser",
    method: "post",
    data: user,
  });
};

export const updateUser = (user: UserInfoModule.UserUpdate): Promise<Response<Array<UserInfoModule.User>>> => {
  return request({
    url: "/genericUser/updateGenericUser",
    method: "post",
    data: user,
  });
};

export const deleteUser = (user: UserInfoModule.UserDelete): Promise<Response<Array<UserInfoModule.User>>> => {
  return request({
    url: "/genericUser/deleteGenericUserById",
    method: "post",
    data: user,
  });
};
