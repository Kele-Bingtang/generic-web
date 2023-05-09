import { defineStore } from "pinia";
import { defaultProjectData, type ProjectModule } from "@/api/project";
import { type CategoryModule, defaultCategoryData } from "@/api/category";
import type { UserInfoModule } from "@/api/user";

type Project = ProjectModule.Project;
type Category = CategoryModule.Category;
type Role = Pick<UserInfoModule.Role, "code" | "name">;

export interface DataState {
  project: Partial<Project>; // 存储进入的项目
  category: Partial<Category>; // 存储进入的目录
  userRole: Partial<Role>; //  用户角色
}

export const useDataStore = defineStore("dataStore", () => {
  const project = ref({ ...defaultProjectData });
  const category = ref({ ...defaultCategoryData });
  const userRole = ref<Partial<Role>>({ code: "", name: "" });
  const isVisitor = computed(() => userRole.value.code?.toLocaleLowerCase() === "visitor");

  const updateProject = (projectParams: Partial<Project>) => {
    project.value = projectParams;
  };
  const updateCategory = (categoryParams: Partial<Category>) => {
    category.value = categoryParams;
  };
  const updateUserRole = (userRoleParams: Partial<Role>) => {
    userRole.value = userRoleParams;
  };

  return {
    project,
    category,
    userRole,
    isVisitor,
    updateCategory,
    updateProject,
    updateUserRole,
  };
});
