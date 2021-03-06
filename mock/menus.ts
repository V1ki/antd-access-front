import { Request, Response } from 'express';
import { waitTime } from '../src/utils/utils';

// c存储到数据库的数据
const total_menus: API.Menu[] = [
  {
    id: '1',
    name: 'welcome',
    icon: 'ad',
    path: '/welcome',
    parent: '0',
    hide: false,
    order: 0,
  },
  {
    id: '2',
    name: 'admin',
    icon: 'crown',
    path: '/admin',
    parent: '0',
    hide: false,
    order: 1,
  },
  {
    id: '3',
    name: 'sub-page',
    icon: 'smile',
    path: '/admin/sub-page',
    parent: '2',
    hide: false,
    order: 0,
  },
  {
    id: '4',
    name: 'menus',
    icon: 'smile',
    path: '/menus',
    parent: '0',
    hide: false,
    order: 0,
  },
];

// DTO
// POJO

const menus: API.Menu[] = [];

const refreshMenus: () => void = () => {
  menus.splice(0, menus.length);
  total_menus
    .filter((m) => m.parent === '0')
    .forEach((m) => {
      const items = total_menus.filter((item) => item.parent === m.id);

      // if(items){
      //   items.forEach( i => {
      //     const items = total_menus.filter(item => item.parent === i.id) ;
      //     i.children = items ;
      //   })
      // }

      m.children = items;

      menus.push(m);
    });
};

refreshMenus();

const getMenus = async (req: Request, res: Response) => {
  await waitTime(500);
  const result = {
    success: true,
    data: menus,
  };
  return res.json(result);
};

const createMenu = async (req: Request, res: Response) => {
  const index = total_menus.findIndex((r) => r.path === req.body.path);
  if (index !== -1) {
    return res.json({
      success: false,
      data: 'id 已经存在',
    });
  }

  const parent = req.body.parent || '0';

  const menu: API.Menu = {
    id: `${total_menus.length + 1}`,
    name: req.body.name,
    icon: req.body.icon,
    path: req.body.path,
    children: [],
    parent: parent,
    hide: req.body.hide,
    order: req.body.order,
  };

  total_menus.push(menu);

  refreshMenus();
  const result = {
    success: true,
    data: '数据添加成功',
  };
  return res.json(result);
};

const updateMenu = async (req: Request, res: Response) => {
  const id = req.params.id;
  const index = total_menus.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.json({
      success: false,
      data: '数据修改失败',
    });
  }
  const lastMenu = total_menus[index];

  const menu: API.Menu = {
    id: id,
    name: req.body.name,
    icon: req.body.icon,
    parent: lastMenu.parent,
    path: req.body.path,
    children: lastMenu.children,
    hide: req.body.hide,
    order: req.body.order,
  };

  total_menus.splice(index, 1, menu);
  refreshMenus();

  const result = {
    success: true,
    data: '数据修改成功',
  };
  return res.json(result);
};

const deleteMenu = async (req: Request, res: Response) => {
  const id = req.params.id;
  const index = total_menus.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.json({
      success: false,
      data: '数据不存在',
    });
  }

  total_menus.splice(index, 1);
  refreshMenus();

  const result = {
    success: true,
    data: '数据删除成功',
  };
  return res.json(result);
};

export default {
  'GET /api/menus': getMenus,
  'POST /api/menu': createMenu,
  'POST /api/menu/:id': updateMenu,
  'DELETE /api/menu/:id': deleteMenu,
};
