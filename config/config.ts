// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    // default en-US
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      icon: 'dashboard',
      component: './dashboard',
      access: 'isAdmin',
    },
    {
      path: '/category',
      access: 'isAdmin',
      name: 'category',
      icon: 'cluster',
      component: './category',
    },
    {
      path: '/manage-menu-item',
      access: 'isAdmin',
      name: 'manage-menu-item',
      icon: 'appstore',
      component: './manage-menu-item',
    },
    {
      path: '/menu',
      name: 'menu',
      access: 'isUser',
      icon: 'appstore',
      component: './menu',
    },
    {
      path: '/order-history',
      name: 'order-history',
      icon: 'unordered-list',
      component: './order-history',
    },
    {
      path: '/table',
      access: 'isAdmin',
      name: 'table',
      icon: 'shop',
      component: './table/list',
    },
    {
      path: '/table/detail/:zoneId',
      access: 'isAdmin',
      name: 'table.detail',
      hideInMenu: true,
      component: './table/detail',
    },
    {
      path: '/reservation',
      name: 'reservation',
      icon: 'calendar',
      component: './reservation',
    },
    {
      name: 'exception',
      icon: 'warning',
      path: '/exception',
      hideInMenu: true,
      routes: [
        {
          path: '/exception',
          redirect: '/exception/403',
        },
        {
          name: '403',
          icon: 'smile',
          path: '/exception/403',
          component: './exception/403',
        },
        {
          name: '404',
          icon: 'smile',
          path: '/exception/404',
          component: './exception/404',
        },
        {
          name: '500',
          icon: 'smile',
          path: '/exception/500',
          component: './exception/500',
        },
      ],
    },
    {
      path: '/manage-user',
      access: 'isAdmin',
      name: 'manage-user',
      icon: 'team',
      component: './manage-user',
    },
    {
      path: '/chat',
      name: 'chat',
      icon: 'message',
      component: './chat',
    },
    {
      name: 'account',
      icon: 'user',
      path: '/account',
      component: './account/center',
    },
    {
      path: '/',
      wrappers: ['@/wrappers/auth'],
      component: './home',
    },
    {
      component: '404',
    },
  ],
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
