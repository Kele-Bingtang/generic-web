import Vue from "vue";
import Vuex from "vuex";
import { DataState } from "./modules/data";
import { LayoutState } from "./modules/layout";
import { PermissionState } from "./modules/permission";
import { SettingsState } from "./modules/settings";
import { UserState } from "./modules/user";

Vue.use(Vuex);

export interface IStoreState {
  layout: LayoutState;
  permission: PermissionState;
  settings: SettingsState;
  user: UserState;
  data: DataState;
}

export default new Vuex.Store<IStoreState>({});
