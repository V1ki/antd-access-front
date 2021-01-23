import { request } from 'umi';


export async function getRoles() {
    return request(`/api/roles`);
}