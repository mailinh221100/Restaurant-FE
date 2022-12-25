import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading, SettingDrawer } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import defaultSettings from '../config/defaultSettings';
import type { RequestConfig } from '@@/plugin-request/request';
import { BASE_URL } from '@/constants/constants';
import socketUtil from './socket.util';
import { SmileOutlined } from '@ant-design/icons';
import { notification } from 'antd';
import { setLocale } from 'umi';

setLocale('en-US');

socketUtil.init();

const loginPath = '/user/login';

const getAccessToken = () => {
  return window.localStorage.getItem('token');
};

const authHeaderInterceptor = (url: string, options: any) => {
  const authHeader = { Authorization: 'Bearer ' + getAccessToken() };
  return {
    url: `${BASE_URL}${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

export const request: RequestConfig = {
  // Add a pre-request interceptor that automatically adds an AccessToken
  requestInterceptors: [authHeaderInterceptor],
};

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();

      socketUtil.get().removeAllListeners();
      if (msg && msg.roles && msg.roles.includes('admin')) {
        socketUtil.get().on('create', (message: any) => {
          console.log(message);
          notification.open({
            message: message?.type,
            description: message?.message,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
          });
        });
      } else {
        console.log(`update-${msg._id}`);
        socketUtil.get().on(`update-${msg._id}`, (message: any) => {
          console.log(message);
          notification.open({
            message: message?.type,
            description: message?.message,
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
          });
        });
      }

      return msg;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.fullName,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};

