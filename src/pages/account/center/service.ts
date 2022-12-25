import { request } from 'umi';
import type { CurrentUser } from './data.d';

export async function queryCurrent(): Promise<{ data: CurrentUser }> {
  return request('/api/auth/current_user');
}

export async function changePasswordAPI(body: any) {
  return request('/api/auth/reset_password', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
