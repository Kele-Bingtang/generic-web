import { VuexModule, Module, Mutation, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { getCacheToken, removeCacheToken, setCacheToken } from "@/utils/cache";
import { resetRouter } from "@/router";
import { LayoutModule } from "./layout";
import { loadRoutes } from "@/router/utils";
import { rolesRoutes } from "@/router/routes-config";
import router from "@/router";
import { defaultUserData, getUserInfo, login, LoginInfo, UserInfoModule } from "@/api/user";

type UserInfo = UserInfoModule.User;

export interface UserState {
  token: string; // 用户的认证 token
  userInfo: UserInfo; // 用户信息
  roles: string[]; // 有时候 roles 需要等拿到 userId，再去获取，则不会在 userInfo 里
}

@Module({ dynamic: true, store, name: "user", namespaced: true })
class User extends VuexModule implements UserState {
  public token: string = getCacheToken() || "";
  public userInfo: UserInfo = { ...defaultUserData } as UserInfo;
  public roles: string[] = [];

  @Action
  public async login(loginInfo: LoginInfo) {
    let { username, password } = loginInfo;
    username = username.trim();
    let { data: token } = await login({ username, password });
    setCacheToken(token);
    this.SET_TOKEN(token);
    return token;
  }

  @Action
  public async LogOut() {
    debugger;
    if (this.token === "") {
      throw Error("LogOut: token is undefined!");
    }
    removeCacheToken();
    resetRouter();

    // 删除 Tags
    LayoutModule.deleteAllTags();
    this.SET_TOKEN("");
    this.SET_ROLES([]);
  }

  @Action
  public async getUserInfo() {
    let { token } = this;
    if (token) {
      let res = await getUserInfo(token);
      if (res.status === "success") {
        this.setUserInfo(res.data);
        let roles = ["admin"];
        this.SET_ROLES(roles);
        return roles;
      } else {
        return ["visitor"];
      }
    } else {
      return ["visitor"];
    }
  }

  @Action
  public resetToken() {
    removeCacheToken();
    this.SET_TOKEN("");
    this.SET_ROLES([]);
  }

  @Action
  public async changeRoles(roles: string[]) {
    // 模拟新的 token
    const token = roles[0] + "-token";
    this.SET_TOKEN(token);
    setCacheToken(token);
    this.SET_ROLES(roles); // 正常不是直接赋予角色，而是调用 this.getUserInfo(token)，根据 token 重新获取对应的角色
    // await this.getUserInfo(token);
    resetRouter();
    loadRoutes(rolesRoutes, roles, router);
    LayoutModule.deleteAllTags();
  }

  @Action
  public setUserInfo(userInfo: UserInfo) {
    this.SET_USER_INFO(userInfo);
  }

  @Mutation
  public SET_TOKEN(token: string) {
    this.token = token;
  }

  @Mutation
  public SET_USER_INFO(userInfo: UserInfo) {
    this.userInfo = userInfo;
  }

  @Mutation
  public SET_ROLES(roles: string[]) {
    this.roles = roles;
  }
}

export const UserModule = getModule(User);
