import { request } from 'umi';

export async function getRoles() {
  return request(`/api/role/list`);
}

export async function createRole(role: API.Role) {
  return request(`/api/role/create`, {
    method: 'post',
    data: role,
  });
}

export async function updateRole(role: API.Role) {
  return request(`/api/role/${role.id}`, {
    method: 'post',
    data: role,
  });
}

export async function deleteRole(id: string) {
  return request(`/api/role/${id}`, {
    method: 'delete',
  });
}
export async function getRoleMenus(id: string) {
  return request(`/api/role/${id}/menus`, {
    method: 'get',
  });
}

export async function updateRoleMenu(id: string, menus: string[]) {
  return request(`/api/role/${id}/menus`, {
    method: 'post',
    data: {
      menus,
    },
  });
}
