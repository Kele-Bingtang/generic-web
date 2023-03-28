import request from "@/config/request";
import { Condition, Page, Response } from "@/types/http";
import { RequiredKey } from "@/utils/layout";

export declare module CategoryModule {
  interface Category {
    id: number;
    categoryCode: string;
    categoryName: string;
    createUser: string;
    createTime: string;
    modifyUser: string;
    modifyTime: string;
    projectId: number;
  }

  type CategoryInsert = Omit<Category, "id" | "createTime" | "modifyTime">;

  type CategoryUpdate = RequiredKey<Omit<Category, "createUser" | "createTime" | "modifyTime" | "projectId">, "id">;

  type CategoryDelete = RequiredKey<Category, "id">;

  type CategorySearch = Partial<Category>;
}

export const defaultCategoryData: Partial<CategoryModule.Category> = {
  id: 0,
  categoryCode: "",
  categoryName: "",
  projectId: 0,
};

export const queryProjectByConditions = (
  condition: Array<Condition>
): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/queryGenericCategoryByConditions",
    method: "get",
    data: condition,
  });
};

export const queryCategoryList = (
  category?: CategoryModule.CategorySearch
): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/queryGenericCategoryList",
    method: "get",
    params: { ...category },
  });
};

export const queryListPages = (
  page?: Page,
  category?: CategoryModule.CategorySearch
): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/queryGenericCategoryConditionsPages",
    method: "get",
    params: {
      ...category,
      ...page,
    },
  });
};

export const insertCategory = (
  category: CategoryModule.CategoryInsert
): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/insertGenericCategory",
    method: "post",
    data: category,
  });
};

export const updateCategory = (
  category: CategoryModule.CategoryUpdate
): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/updateGenericCategory",
    method: "post",
    data: category,
  });
};

export const deleteCategory = (
  category: CategoryModule.CategoryDelete
): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/deleteGenericCategoryById",
    method: "post",
    data: category,
  });
};
