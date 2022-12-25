import { request } from 'umi';

export async function createTableAPI(data: any) {
  return request('/api/diningTable', {
    method: 'POST',
    data,
  });
}

export async function deleteTableAPI(id: string) {
  return request('/api/diningTable/' + id, {
    method: 'DELETE',
  });
}
