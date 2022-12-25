import { request } from 'umi';

export async function getListCategoriesAPI() {
  return request('/api/category', {
    method: 'GET',
  });
}

export async function createCategoryAPI(data: any) {
  return request('/api/category', {
    method: 'POST',
    data,
  });
}

export async function deleteCategoryAPI(id: string) {
  return request('/api/category/' + id, {
    method: 'DELETE',
  });
}
