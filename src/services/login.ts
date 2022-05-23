import { request } from 'umi';

export type LoginParamsType = {
  username: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
};


export async function loginRequest(params: LoginParamsType) {

  const { username, password } = params;
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  return request<API.ResponseData>('/api/v1/login', {
    method: 'POST',
    data: formData,
  });
}
