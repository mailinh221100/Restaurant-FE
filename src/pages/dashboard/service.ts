import { request } from 'umi';

export async function getDetailsAPI() {
  return request('/api/dashboard/details', {
    method: 'GET',
  });
}
