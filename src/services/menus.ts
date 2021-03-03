import { request } from 'umi';


export async function getMenus() {
    return request(`/api/menus`);
}

export async function createMenu(menu: API.Menu) {
  return request(`/api/menu`,{
    method : "post" ,
    data: menu
  });
}

export async function updateMenu(menu: API.Menu) {
  return request(`/api/menu/${menu.id}`,{
    method : "post" ,
    data: menu
  });
}

export async function deleteMenu(id: string) {
  return request(`/api/menu/${id}`,{
    method : "delete" ,
  });
}
