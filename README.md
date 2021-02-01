
# antd-access


## 项目结构

```
.
├── package.json                 -- 这个就是项目配置相关 依赖包,名称,url ,命令脚本
├── tsconfig.json                -- 这个主要就是typescript 编译配置相关的东西
├── config                       -- 对项目在运行过程的一些配置.(静态配置)
    ├── config.ts                -- 项目主配置文件入口
    ├── routes.ts                -- 路由配置文件.
    ├── proxy.ts                 -- 代理文件
    └── defaultSettigns.ts       -- 默认配置
├── mock                         -- 前端模拟后端接口返回.
├── public                       -- logo . 一些图片.
├── src                          -- 我们的源码,我们主要在这里编码
    ├── components               -- 项目组件的存放地方. 推荐存放全局组件.
    ├── e2e                      -- 端到端的测试文件.
    ├── locales                  -- 国际化文件存放地方.
    ├── models                   -- 存放model. dva model 以及 umi-plugin-model  .
    ├── pages                    -- 页面的存放地方.
    ├── services                 -- 服务的存放地方.对于前端来说,请求API.以及一些其他的操作.
    ├── utils                    -- 工具文件
    ├── app.tsx                  -- 项目配置(动态配置)
    ├── access.ts                -- 权限定义文件
    └── typing.d.ts              -- 全局的一些类型.
```

## 进度

- [x] 1. 创建前后端项目.  
- [x] 2. 前端项目的结构.以及创建页面.  
- [x] 3. 创建列表页面, 然后编写测试用例.  
- [x] 4. 开发思路及规划.  
- [x] 5. 角色界面的新建,编辑,删除.
- [x] 6. 角色界面的E2E测试,优化,以及增加国际化的代码.

