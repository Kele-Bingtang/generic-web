import Vue from "vue";
import Vuex from "vuex";
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
}

export default new Vuex.Store<IStoreState>({});
