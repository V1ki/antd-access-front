import { request } from 'umi';

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/user/current');
}

export async function queryCurrentMenus() {
  return request<{
    success: boolean;
    data: API.Menu[];
  }>('/api/currentUser/menus');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}

export async function getUsers() {
  return request(`/api/users`);
}

export async function createUser(user: API.User) {
  return request(`/api/user`, {
    method: 'post',
    data: user,
  });
}

export async function updateUser(user: API.User) {
  return request(`/api/user/${user.id}`, {
    method: 'post',
    data: user,
  });
}

export async function deleteUser(id: string) {
  return request(`/api/user/${id}`, {
    method: 'delete',
  });
}
