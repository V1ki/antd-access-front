import { request } from 'umi';

export async function getMenus() {
  return request(`/api/menu/list`);
}

export async function createMenu(menu: API.Menu) {
  return request(`/api/menu/create`, {
    method: 'post',
    data: menu,
  });
}

export async function updateMenu(menu: API.Menu) {
  return request(`/api/menu/${menu.mid}`, {
    method: 'post',
    data: menu,
  });
}

export async function deleteMenu(id: string) {
  return request(`/api/menu/${id}`, {
    method: 'delete',
  });
}
