import { defineStore } from "pinia";
import { removeCacheToken, setCacheToken } from "@/utils/layout/cache";
import { resetRouter } from "@/router";
import { useLayoutStore } from "./layout";
import { defaultUserData, getUserInfo, login, type LoginInfo, type UserInfoModule } from "@/api/user";

type UserInfo = UserInfoModule.User;

export const useUserStore = defineStore(
  "userStore",
  () => {
    const token = ref("");
    const userInfo = ref<UserInfo>({ ...defaultUserData } as UserInfo);
    const roles = ref<string[]>([]);

    const tryLogin = async ({ username, password }: LoginInfo) => {
      username = username.trim();
      const { data: token } = await login({ username, password });
      setCacheToken(token);
      setToken(token);
      return true;
    };

    const logout = async () => {
      if (token.value === "") throw Error("LogOut: token is undefined!");
      removeCacheToken();
      resetRouter();
      setToken("");
      setRoles([]);
      const layoutStore = useLayoutStore();
      layoutStore.removeAllTabs();
      layoutStore.setKeepAliveName();
    };

    const tryGetUserInfo = async () => {
      if (token.value) {
        const res = await getUserInfo(token.value);
        if (res.status === "success") {
          setUserInfo(res.data);
          const roles = ["admin"];
          setRoles(roles);
          return roles;
        } else {
          removeCacheToken();
          return ["visitor"];
        }
      } else {
        return ["visitor"];
      }
    };

    const resetToken = () => {
      removeCacheToken();
      setToken("");
      setRoles([]);
    };

    const setUserInfo = (userInfoParam: UserInfo) => {
      userInfo.value = userInfoParam;
    };

    const setToken = (tokenParam: string) => {
      token.value = tokenParam;
    };

    const setRoles = (rolesParam: string[]) => {
      roles.value = rolesParam;
    };

    return {
      token,
      userInfo,
      roles,

      tryLogin,
      logout,
      tryGetUserInfo,
      resetToken,
      setUserInfo,
      setToken,
      setRoles,
    };
  },
  {
    persist: {
      key: "kbt_userStore",
      storage: localStorage,
      paths: ["token"],
    },
  }
);
