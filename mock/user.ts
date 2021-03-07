import { Request, Response } from 'express';

const total_users: API.User[] = [
  {
    id: '1',
    account: 'admin',
    name: 'Serati Ma',
    passwd: 'ant.design',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    mobile: 'xxxxxxxxx',
    email: 'antdesign@alipay.com',
    status: '',
  },

  {
    id: '2',
    account: 'user',
    name: 'V1ki',
    passwd: 'ant.design',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    mobile: 'xxxxxxxxx',
    email: 'antdesign@alipay.com',
    status: '',
  },
];

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

async function getFakeCaptcha(req: Request, res: Response) {
  await waitTime(2000);
  return res.json('captcha-xxx');
}

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
// let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

let user: API.User | null = null;

const getUsers = async (req: Request, res: Response) => {
  const result = {
    success: true,
    data: total_users,
  };
  return res.json(result);
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const index = total_users.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.json({
      success: false,
      data: '数据不存在',
    });
  }

  total_users.splice(index, 1);
  const result = {
    success: true,
    data: '数据删除成功',
  };
  return res.json(result);
};

const createUser = async (req: Request, res: Response) => {
  const account = req.body.account;

  const index = total_users.findIndex((r) => r.account === account);
  if (index !== -1) {
    return res.json({
      success: false,
      data: '用户已存在',
    });
  }

  const newUser: API.User = {
    id: `${total_users.length + 1}`,
    account: account,
    name: req.body.name,
    passwd: req.body.passwd,
    avatar: req.body.avatar,
    mobile: req.body.mobile,
    email: req.body.email,
    status: '',
  };
  total_users.push(newUser);
  const result = {
    success: true,
    data: '数据添加成功',
  };
  return res.json(result);
};

const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  const index = total_users.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.json({
      success: false,
      data: '数据不存在',
    });
  }
  const oldUser = total_users[index];
  const newUser: API.User = {
    id: oldUser.id,
    account: oldUser.account,
    name: req.body.name,
    passwd: req.body.passwd,
    avatar: req.body.avatar,
    mobile: req.body.mobile,
    email: req.body.email,
    status: '',
  };

  total_users.splice(index, 1, newUser);
  const result = {
    success: true,
    data: '数据修改功',
  };
  return res.json(result);
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': (req: Request, res: Response) => {
    if (!user) {
      res.status(401).send({
        data: {
          isLogin: false,
        },
        errorCode: '401',
        errorMessage: '请先登录！',
        success: true,
      });
      return;
    }

    res.send({
      name: user.name,
      avatar: user.avatar,
      userid: user.id,
      email: user.email,
      access: 'admin',
      phone: user.email,
    });
  },
  'POST /api/login/account': async (req: Request, res: Response) => {
    const { password, username, type } = req.body;
    await waitTime(2000);

    if (type === 'mobile') {
      res.send({
        status: 'error',
        type,
      });
      return;
    }

    const index = total_users.findIndex((u) => u.account === username && u.passwd === password);

    if (index === -1) {
      res.send({
        status: 'error',
        type,
      });
      return;
    }
    user = total_users[index];

    res.send({
      status: 'ok',
      type,
      currentAuthority: 'admin',
    });
    return;
  },
  'GET /api/login/outLogin': (req: Request, res: Response) => {
    user = null;
    res.send({ data: {}, success: true });
  },
  'POST /api/register': (req: Request, res: Response) => {
    res.send({ status: 'ok', currentAuthority: 'user', success: true });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },

  'GET  /api/login/captcha': getFakeCaptcha,

  'DELETE /api/user/:id': deleteUser,
  'POST /api/user/:id': updateUser,
  'POST /api/user': createUser,
  'GET /api/users': getUsers,
};
