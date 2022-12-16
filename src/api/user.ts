import request from "@/config/request";
import { Condition, Page, Response } from "@/types/http";
import { RequiredKey } from "@/utils/layout";

export declare module UserModule {
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

export const defaultUserData: Partial<UserModule.User> = {
  id: 0,
  username: "",
  nickname: "",
  password: "",
  email: "",
  gender: 0,
  birthday: "",
  phone: "",
  status: 0,
  registerTime: "",
  modifyTime: "",
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

export const queryGenericProjectByConditions = (
  condition: Array<Condition>
): Promise<Response<Array<UserModule.User>>> => {
  return request({
    url: "/genericUser/queryGenericUserByConditions",
    method: "get",
    data: condition,
  });
};

export const queryUserList = (user?: UserModule.User): Promise<Response<Array<UserModule.User>>> => {
  return request({
    url: "/genericUser/queryGenericUserList",
    method: "get",
    params: { ...user },
  });
};

export const queryGenericUserListPages = (
  user?: UserModule.User,
  page?: Page
): Promise<Response<Array<UserModule.User>>> => {
  return request({
    url: "/genericUser/queryGenericUserListPages",
    method: "get",
    params: {
      ...user,
      ...page,
    },
  });
};

export const queryGenericUserConditionsPages = (
  condition: Array<Condition>,
  page?: Page
): Promise<Response<Array<UserModule.User>>> => {
  return request({
    url: "/genericUser/queryGenericUserConditionsPages",
    method: "get",
    params: {
      ...page,
    },
    data: condition,
  });
};

export const insertUser = (user: UserModule.UserInsert): Promise<Response<Array<UserModule.User>>> => {
  return request({
    url: "/genericUser/insertGenericUser",
    method: "post",
    data: user,
  });
};

export const updateUser = (user: UserModule.UserUpdate): Promise<Response<Array<UserModule.User>>> => {
  return request({
    url: "/genericUser/updateGenericUser",
    method: "post",
    data: user,
  });
};

export const deleteUser = (user: UserModule.UserDelete): Promise<Response<Array<UserModule.User>>> => {
  return request({
    url: "/genericUser/deleteGenericUserById",
    method: "post",
    data: user,
  });
};
