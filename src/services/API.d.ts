declare namespace API {
  export type CurrentUser = {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  };

  export type ResponseData = {
    code: number ;
    msg: string;
  };


  export type NoticeIconData = {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  };

  export type Role = {
    id: string;
    name: string;
    identifier: string;
    order: number;
    enabled: boolean;
    // 过期时间. 非必须
    expireTime?: number;
    // 角色所属菜单
    menus: Menu[];
  };
  export type Menu = {
    mid: string;
    name: string;
    icon: string;
    identifier: string;
    // 路径
    path: string;
    parent: string;
    hide: boolean;
    order: number;

    // 子菜单
    children?: Menu[];
    type?: 'inner' | 'outter' | undefined;
  };

  export type User = {
    id: string;
    account: string;
    name: string;
    passwd: string;
    avatar: string;
    mobile: string;
    email: string;
    status: string;
    roles: string[];
  };
}
