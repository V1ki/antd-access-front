import { Request, Response } from 'express';
import { waitTime } from '../src/utils/utils';
// import menus from './menus' ;

type RoleData = API.Role & { menus: string[] };

const roles: RoleData[] = [
  {
    id: '1',
    name: 'Admin',
    identifier: 'admin',
    order: 0,
    enabled: true,
    menus: [],
  },
  {
    id: '2',
    name: 'Test',
    identifier: 'test',
    order: 100,
    enabled: false,
    expireTime: 1614528000,
    menus: [],
  },
];

const getRoles = async (req: Request, res: Response) => {
  await waitTime(500);
  const result = {
    success: true,
    data: roles,
  };
  return res.json(result);
};

const createRole = async (req: Request, res: Response) => {
  const index = roles.findIndex((r) => r.identifier === req.body.identifier);
  if (index !== -1) {
    return res.json({
      success: false,
      data: 'identifier 已经存在',
    });
  }

  const role: RoleData = {
    id: `${roles.length + 1}`,
    name: req.body.name,
    identifier: req.body.identifier,
    order: req.body.order,
    enabled: req.body.enabled,
    menus: [],
  };
  roles.push(role);

  const result = {
    success: true,
    data: '数据添加成功',
  };
  return res.json(result);
};

const updateRole = async (req: Request, res: Response) => {
  const index = roles.findIndex((r) => r.id === req.body.id);
  if (index === -1) {
    return res.json({
      success: false,
      data: '数据修改失败',
    });
  }

  const role: RoleData = {
    id: req.body.id,
    name: req.body.name,
    identifier: req.body.identifier,
    order: req.body.order,
    enabled: req.body.enabled,
    menus: [],
  };

  roles.splice(index, 1, role);

  const result = {
    success: true,
    data: '数据修改成功',
  };
  return res.json(result);
};

const updateRoleMenu = async (req: Request, res: Response) => {
  const id = req.params.id;
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.json({
      success: false,
      data: '数据不存在',
    });
  }
  const lastRole = roles[index];

  const role: RoleData = {
    ...lastRole,
    menus: req.body.menus,
  };

  roles.splice(index, 1, role);

  const result = {
    success: true,
    data: '数据修改成功',
  };
  return res.json(result);
};

const getRoleMenus = async (req: Request, res: Response) => {
  const id = req.params.id;
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.json({
      success: false,
      data: '数据不存在',
    });
  }

  const lastRole = roles[index];

  const result = {
    success: true,
    data: {
      ...lastRole,
      // menus: menus.formatMenus(lastRole.menus)
    },
  };
  return res.json(result);
};

const deleteRole = async (req: Request, res: Response) => {
  const id = req.params.id;
  const index = roles.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.json({
      success: false,
      data: '数据不存在',
    });
  }

  roles.splice(index, 1);

  const result = {
    success: true,
    data: '数据删除成功',
  };
  return res.json(result);
};

export default {
  'GET /api/roles': getRoles,
  'POST /api/role': createRole,
  'POST /api/role/:id': updateRole,
  'DELETE /api/role/:id': deleteRole,
  'POST /api/role/:id/menus': updateRoleMenu,
  'GET /api/role/:id/menus': getRoleMenus,
};
