import { Route, RouteConfig } from "vue-router";
import Layout from "@/layout/index.vue";

/**
  可配置的参数:
  path: string                                路由的地址，这是必须设置的，如果是个有效的 http 或者 https 链接，则点击该菜单跳转到新窗口
  name: string | "_noUseI18n_xxx"             路由的名字，这是必须设置的，如果开启了 I18n，某些路由又不想使用 I18n，则 name 以 _noUseI18n- 开头
  redirect: string | function                 重定向到某个路由下，可选，function 使用方式请看官网：https://router.vuejs.org/zh/api/index.html#redirect

  ......

  meta: {
    roles: ['admin', 'visitor']               可访问该页面的权限数组，当前路由设置的权限会影响子路由
    title: { string | number | Function }
                    显示在侧边栏、面包屑和标签栏的文字
                    使用 '{{ 多语言字段 }}' 形式结合「多语言」使用
                    可以传入一个回调函数，参数是当前路由对象 to
    notClickBread: boolean                    如果为 true，则该路由无法在面包屑中被点击，默认为 false
    hideInBread: boolean                      如果为 true，则该路由将不会出现在面包屑中，默认为 false
    hideInMenu: boolean                       如果为 true，则该路由不会显示在左侧菜单，默认为 false
    alwaysShowRoot: boolean                   如果为 false 且某一级路由下只有一个二级路由，则左侧菜单直接显示该二级路由，如果为 true，则总会让一级菜单作为下拉菜单，默认为 false，仅限父级路由使用
    notCache: boolean                         如果为 true，该路由在切换标签后不会缓存，如果需要缓存，则「必须」设置页面组件 name 属性（class 名）和路由配置的 name 一致，默认为 false
    icon: string                              该页面在左侧菜单、面包屑显示的图标，无默认值
    fixedInNav: boolean                       如果为 true，则该路由按照路由表顺序依次标签固定在标签栏，默认为 false
    beforeCloseName: 'before_close_normal'    如果设置该字段，则在关闭当前 tab 页时会去 @/router/before-close.js 里寻找该字段名「对应」的方法，作为关闭前的钩子函数，无默认值
    activeMenu: ''                            Restful 路由搭配使用，指定某个菜单高亮
  }
 */

type RouteConfigAndMeta = RouteConfig & {
  meta?: {
    roles?: string[];
    title?: string | number | Function;
    notClickBread?: boolean;
    hideInBread?: boolean;
    hideInMenu?: boolean;
    alwaysShowRoot?: boolean;
    notCache?: boolean;
    icon?: string;
    fixedInNav?: boolean | number;
    beforeCloseName?: string;
    activeMenu?: string;
  };
};

export const constantRoutes: Array<RouteConfigAndMeta> = [
  // 用来解决路由重复跳转问题：因为无法利用路由直接跳转，所以利用 views/redirect/Index.vue 组件实现跳转
  {
    path: "/redirect",
    component: Layout,
    meta: { hideInMenu: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue"),
      },
    ],
  },
  {
    path: "/error-logger",
    redirect: "/error-logger/index",
    component: Layout,
    meta: { hideInMenu: true },
    children: [
      {
        path: "index",
        name: "ErrorLogger",
        component: () => import("@/views/error-page/index.vue"),
        meta: { title: "错误日志" },
      },
    ],
  },
];

export const rolesRoutes: Array<RouteConfigAndMeta> = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/views/home/index.vue"),
        meta: { title: "首页", icon: "el-icon-s-home", fixedInNav: true },
      },
    ],
  },
  {
    path: "/project",
    component: Layout,
    redirect: "/project/index",
    children: [
      {
        path: "index",
        name: "Projects",
        component: () => import("@/views/project/index.vue"),
        meta: { title: "我的项目", icon: "el-icon-menu" },
      },
      {
        path: "details/:projectName/:secretKey",
        name: "Category",
        component: () => import("@/views/category/index.vue"),
        meta: { title: (route: Route) => route.params.projectName, hideInMenu: true },
      },
    ],
  },
];
