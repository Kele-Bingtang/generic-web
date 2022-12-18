import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { defaultProjectData, ProjectModule } from "@/api/project";
import { CategoryModule, defaultCategoryData } from "@/api/category";
import { defaultServiceData, ServiceModule } from "@/api/service";

type Project = ProjectModule.Project;
type Category = CategoryModule.Category;
type Service = ServiceModule.Service;

export interface DataState {
  project: Partial<Project>; // 存储进入的项目
  category: Partial<Category>; // 存储进入的目录
  service: Partial<Service>; // 存储进入的接口
}

@Module({ dynamic: true, store, name: "data", namespaced: true })
class Data extends VuexModule implements DataState {
  public project = { ...defaultProjectData };
  public category = { ...defaultCategoryData };
  public service = { ...defaultServiceData };

  @Action
  public updateProject(project: Partial<Project>) {
    this.UPDATE_PROJECT(project);
  }

  @Action
  public updateCategory(category: Partial<Category>) {
    this.UPDATE_CATEGORY(category);
  }

  @Action
  public updateService(service: Partial<Service>) {
    this.UPDATE_SERVICE(service);
  }

  @Mutation
  public UPDATE_PROJECT(project: Partial<Project>) {
    this.project = project;
  }

  @Mutation
  public UPDATE_CATEGORY(category: Partial<Category>) {
    this.category = category;
  }

  @Mutation
  public UPDATE_SERVICE(service: Partial<Service>) {
    this.service = service;
  }
}

export const DataModule = getModule(Data);
