import http from "@/config/request";

export declare namespace FieldModule {
  interface Field {
    id: number;
    field: string;
    parentField: string;
    description: string;
    jsonCol: string[];
    createUser: string;
    createTime: string;
    modifyUser: string;
    modifyTime: string;
    serviceId: number;
  }

  type FieldInsert = Omit<Field, "id" | "createTime" | "modifyTime">;

  type FieldUpdate = RequiredKeyPartialOther<
    Omit<Field, "createUser" | "createTime" | "modifyTime" | "serviceId">,
    "id"
  >;

  type FieldDelete = RequiredKeyPartialOther<Field, "id">;
}

export const queryFieldListPages = (serviceId: number, page?: http.Page) => {
  return http.request<http.Response<FieldModule.Field[]>>({
    url: "/field/queryFieldListPages/" + serviceId,
    method: "get",
    params: {
      ...page,
    },
  });
};

export const insertField = (field: FieldModule.FieldInsert) => {
  return http.request<http.Response<FieldModule.Field>>({
    url: "/field/insertField",
    method: "post",
    data: field,
  });
};

export const updateField = (field: FieldModule.FieldUpdate) => {
  return http.request<http.Response<string>>({
    url: "/field/updateField",
    method: "post",
    data: field,
  });
};

export const deleteField = (field: FieldModule.FieldDelete) => {
  return http.request<http.Response<string>>({
    url: "/field/deleteFieldById",
    method: "post",
    data: field,
  });
};
