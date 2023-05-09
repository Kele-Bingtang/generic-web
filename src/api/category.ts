import http from "@/config/request";

export declare namespace CategoryModule {
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

  type CategoryUpdate = RequiredKeyPartialOther<
    Omit<Category, "createUser" | "createTime" | "modifyTime" | "projectId">,
    "id"
  >;

  type CategoryDelete = RequiredKeyPartialOther<Category, "id">;

  type CategorySearch = Partial<Category>;
}

export const defaultCategoryData: Partial<CategoryModule.Category> = {
  id: 0,
  categoryCode: "",
  categoryName: "",
  projectId: 0,
};

export const queryCategoryList = (category?: CategoryModule.CategorySearch) => {
  return http.request<http.Response<CategoryModule.Category[]>>({
    url: "/category/queryCategoryList",
    method: "get",
    params: { ...category },
  });
};

export const queryListPages = (page?: http.Page, category?: CategoryModule.CategorySearch) => {
  return http.request<http.Response<CategoryModule.Category[]>>({
    url: "/category/queryCategoryConditionsPages",
    method: "get",
    params: {
      ...category,
      ...page,
    },
  });
};

export const insertCategory = (category: CategoryModule.CategoryInsert) => {
  return http.request<http.Response<string>>({
    url: "/category/insertCategory",
    method: "post",
    data: category,
  });
};

export const updateCategory = (category: CategoryModule.CategoryUpdate) => {
  return http.request<http.Response<string>>({
    url: "/category/updateCategory",
    method: "post",
    data: category,
  });
};

export const deleteCategory = (category: CategoryModule.CategoryDelete) => {
  return http.request<http.Response<string>>({
    url: "/category/deleteCategoryById",
    method: "post",
    data: category,
  });
};
