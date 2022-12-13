import request from "@/config/request";
import { Condition, Page, Response } from "@/types/http";

export declare module CategoryModule {
  interface Category {
    id: number;
    categoryCode: string;
    categoryName: string;
    createUser?: string;
    createTime?: string;
    modifyUser?: string;
    modifyTime?: string;
    projectId: number;
  }

  interface CategoryInsert {}

  interface CategoryUpdate{}

  interface CategoryDelete {}
}

export const defaultCategoryData: Partial<CategoryModule.Category> = {
  id: 0,
  categoryCode: "",
  categoryName: "",
  projectId: 0,
};

export const queryGenericProjectByConditions = (condition: Array<Condition>): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/queryGenericCategoryByConditions",
    method: "get",
    data: condition,
  });
};

export const queryCategoryList = (category?: CategoryModule.Category): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/queryGenericCategoryList",
    method: "get",
    params: { ...category },
  });
};

export const queryCategoryListPages = (category?: CategoryModule.Category, page?: Page): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/queryGenericCategoryConditionsPages",
    method: "get",
    params: {
      ...category,
      ...page,
    },
  });
};

export const queryGenericCategoryConditionsPages = (
  condition: Array<Condition>,
  page?: Page
): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/queryGenericCategoryConditionsPages",
    method: "get",
    params: {
      ...page,
    },
    data: condition,
  });
};

export const insertCategory = (category: CategoryModule.Category): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/insertGenericCategory",
    method: "post",
    data: category,
  });
};

export const updateCategory = (category: any): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/updateGenericCategory",
    method: "post",
    data: category,
  });
};

export const deleteCategory = (category: CategoryModule.Category): Promise<Response<Array<CategoryModule.Category>>> => {
  return request({
    url: "/genericCategory/deleteGenericCategoryById",
    method: "post",
    data: category,
  });
};
