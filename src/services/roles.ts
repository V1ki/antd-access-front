import { request } from 'umi';


export async function getRoles() {
    return request(`/api/roles`);
}

export async function createRole(role: API.Role) {
  return request(`/api/role`,{
    method : "post" ,
    data: role
  });
}

export async function updateRole(role: API.Role) {
  return request(`/api/role/${role.id}`,{
    method : "post" ,
    data: role
  });
}

export async function deleteRole(id: string) {
  return request(`/api/role/${id}`,{
    method : "delete" ,
  });
}
