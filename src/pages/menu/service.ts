import { request } from 'umi';

export async function getListMenuItemsAPI(itemName: string) {
  return request('/api/menuItem', {
    method: 'GET',
    params: {
      itemName,
    },
  });
}

export async function createMenuItemAPI(data: any, file: any) {
  const formData = new FormData();
  formData.append('image', file);
  formData.set('data', JSON.stringify(data));
  return request('/api/menuItem', {
    method: 'POST',
    requestType: 'form',
    data: formData,
  });
}

export async function deleteMenuItemAPI(id: string) {
  return request('/api/menuItem/' + id, {
    method: 'DELETE',
  });
}

export async function createOrderAPI(data: any) {
  return request('/api/order', {
    method: 'POST',
    data,
  });
}

export async function getListOrdersAPI(query: any) {
  return request('/api/order', {
    method: 'GET',
    params: query,
  });
}

export async function getListOrderDetailsAPI(id: string) {
  return request('/api/order/orderDetail/' + id, {
    method: 'GET',
  });
}

export async function updateStatusOrderAPI(id: string, status: string) {
  return request(`/api/order/${id}/${status}`, {
    method: 'PATCH',
  });
}

export async function updateStatusItemAPI(id: string, status: string) {
  return request(`/api/menuItem/${id}/status`, {
    method: 'PATCH',
    data: {
      status,
    },
  });
}
