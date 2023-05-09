import http from "@/config/request";

export declare namespace UserInfoModule {
  interface Role {
    id: number;
    code: string;
    name: string;
    create_user: string;
    create_time: string;
    modify_user: string;
    modify_time: string;
  }

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
    avatar: string;
    registerTime: string;
    modifyTime: string;
    role: Role;
  }

  type UserInsert = Omit<User, "id" | "registerTime" | "modifyTime">;

  type UserUpdate = RequiredKeyPartialOther<Omit<User, "registerTime" | "modifyTime">, "username">;

  type UserDelete = RequiredKeyPartialOther<User, "username">;

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

export const login = (params: LoginInfo) => {
  return http.request<http.Response<string>>({
    url: "/login",
    method: "post",
    params: {
      ...params,
    },
  });
};

export const getUserInfo = (token: string) => {
  return http.request<http.Response<UserInfoModule.User>>({
    url: "/user/getUserInfo",
    method: "post",
    params: {
      token,
    },
  });
};

export const queryUserListPages = (page?: http.Page, user?: UserInfoModule.UserSearch) => {
  return http.request<http.Response<UserInfoModule.User[]>>({
    url: "/user/queryUserListPages",
    method: "get",
    params: {
      ...user,
      ...page,
    },
  });
};

export const queryUserConditionsPages = (condition: http.Condition[], page?: http.Page) => {
  return http.request<http.Response<UserInfoModule.User[]>>({
    url: "/user/queryUserConditionsPages",
    method: "get",
    params: {
      ...page,
    },
    data: condition,
  });
};

export const insertUser = (user: UserInfoModule.UserInsert) => {
  return http.request<http.Response<string>>({
    url: "/user/insertUser",
    method: "post",
    data: user,
  });
};

export const updateUser = (user: UserInfoModule.UserUpdate) => {
  return http.request<http.Response<string>>({
    url: "/user/updateUser",
    method: "post",
    data: user,
  });
};

export const deleteUser = (user: UserInfoModule.UserDelete) => {
  return http.request<http.Response<string>>({
    url: "/user/deleteUserById",
    method: "post",
    data: user,
  });
};

export const queryMemberInProject = (secretKey: string, page?: http.Page) => {
  return http.request<http.Response<Omit<UserInfoModule.User, "id" | "password">[]>>({
    url: `/user/queryMemberInProject/${secretKey}`,
    method: "get",
    params: {
      ...page,
    },
  });
};

export const queryAllMemberNotInProject = (secretKey: string) => {
  return http.request<http.Response<UserInfoModule.User[]>>({
    url: `/user/queryAllMemberNotInProject/${secretKey}`,
    method: "get",
  });
};

export const queryGenericUserRole = (secretKey: string) => {
  return http.request<http.Response<Pick<UserInfoModule.Role, "code" | "name">>>({
    url: `/user/queryUserRole/${secretKey}`,
    method: "get",
  });
};

export const updateUserRole = (username: string, projectId: number, roleCode: string) => {
  return http.request<http.Response<string>>({
    url: "/user/updateUserRole",
    method: "post",
    params: {
      _type: "form",
    },
    data: {
      username,
      projectId,
      roleCode,
    },
  });
};

export const addMember = (projectId: number, userList: Array<{ username: string }>) => {
  return http.request<http.Response<string>>({
    url: `/user/insertUserProject/${projectId}`,
    method: "post",
    data: userList,
  });
};

export const removeOneMember = (username: string, projectId: number) => {
  return http.request<http.Response<string>>({
    url: `/user/removeOneMember`,
    method: "post",
    params: {
      _type: "form",
    },
    data: {
      username,
      projectId,
    },
  });
};
