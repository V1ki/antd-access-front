import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type { ResponseError } from 'umi-request';
import { queryCurrent, queryCurrentMenus } from './services/user';
import defaultSettings from '../config/defaultSettings';
import type { MenuDataItem } from '@umijs/route-utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * 获取用户信息比较慢的时候会展示一个 loading
 */
export const initialStateConfig = {
  loading: <PageLoading />,
};

export async function getInitialState(): Promise<{
  settings?: LayoutSettings;
  currentUser?: API.CurrentUser;
  menus?: MenuDataItem[];
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  fetchMenus?: () => Promise<MenuDataItem[]>;
}> {
  const fetchUserInfo = async () => {
    try {
      const currentUser = await queryCurrent();
      return currentUser;
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };

  const fetchMenus = async () => {
    // const resp = await getMenus();
    // 加上用户的角色判断.
    // 从用户的角色中获取对应的菜单
    const resp = await queryCurrentMenus();

    const menu2MenuDataItem: (m: API.Menu) => MenuDataItem = (m: API.Menu) => {
      const item: MenuDataItem = {
        name: m.name,
        path: m.path,
        hideInMenu: m.hide,
        icon: m.icon,
        children: m.children?.map(menu2MenuDataItem),
      };
      return item;
    };
    if (resp.code === 0) {
      return resp.data.map(menu2MenuDataItem);
    }
    return [];
  };

  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    const currentUser = await fetchUserInfo();
    const menus = await fetchMenus();
    return {
      fetchUserInfo,
      fetchMenus,
      menus,
      currentUser,
      settings: defaultSettings,
    };
  }
  return {
    fetchUserInfo,
    fetchMenus,
    settings: defaultSettings,
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== '/user/login') {
        console.log('重定向到 login');
        history.push('/user/login');
      }
    },
    menuHeaderRender: undefined,
    menuDataRender: (menuData: MenuDataItem[]) => {
      console.log('menuDataRender:', menuData, ' initialState menus:', initialState?.menus);
      if (initialState?.menus) {
        return initialState?.menus;
      }
      return [];
    },
    menuItemRender: (item) => {
      return (
        <>
          <Link to={item.path || '/'}>
            <FontAwesomeIcon icon={`${item.icon}`} />
            {item.name}
          </Link>
        </>
      );
    },
    subMenuItemRender: (item) => {
      return (
        <>
          <FontAwesomeIcon icon={item.icon} />
          {item.name}
        </>
      );
    },
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
  credentials: 'include'
};
