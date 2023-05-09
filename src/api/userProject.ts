// import http from "@/config/request";

// export declare namespace UserProjectModule {
//   interface UserProject {
//     id: number;
//     userId: number;
//     projectId: number;
//     createTime: string;
//     modifyTime: string;
//   }

//   type UserProjectInsert = Omit<UserProject, "id" | "createTime" | "modifyTime">;

//   type UserProjectUpdate = RequiredKeyPartialOther<Omit<UserProject, "createTime" | "modifyTime">, "id">;

//   type UserProjectDelete = RequiredKeyPartialOther<UserProject, "id">;

//   type UserProjectSearch = Partial<UserProject>;
// }

// export const defaultUserProjectData: Partial<UserProjectModule.UserProject> = {
//   id: 0,
//   userId: 0,
//   projectId: 0,
// };

// export const queryUserProjectList = (
//   userProject: UserProjectModule.UserProject
// ) => {
//   return http.request<http.Response<UserProjectModule.UserProject[]>>({
//     url: "/userProject/queryUserProjectList",
//     method: "get",
//     params: { ...userProject },
//   });
// };

// export const insertUserProject = (
//   userProject: UserProjectModule.UserProjectInsert
// ) => {
//   return http.request<http.Response<UserProjectModule.UserProject[]>>({
//     url: "/userProject/insertUserProject",
//     method: "post",
//     data: userProject,
//   });
// };

// export const updateUserProject = (
//   userProject: UserProjectModule.UserProjectUpdate
// ) => {
//   return http.request<http.Response<UserProjectModule.UserProject[]>>({
//     url: "/userProject/updateUserProject",
//     method: "post",
//     data: userProject,
//   });
// };

// export const deleteUserProject = (
//   userProject: UserProjectModule.UserProjectDelete
// ) => {
//   return http.request<http.Response<UserProjectModule.UserProject[]>>({
//     url: "/userProject/deleteUserProjectById",
//     method: "post",
//     data: userProject,
//   });
// };
