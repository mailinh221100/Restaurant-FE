import { request } from 'umi';

export async function getListUsersAPI(email: string) {
  return request('/api/auth/list-user', {
    method: 'GET',
    params: {
      email,
    },
  });
}

export async function resetPasswordAPI(id: string) {
  return request('/api/auth/admin_reset_password/' + id, {
    method: 'PATCH',
  });
}
